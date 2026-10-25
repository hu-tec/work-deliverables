from __future__ import annotations

import csv
import os
import queue
import re
import shutil
import threading
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from tkinter import (
    BooleanVar,
    END,
    HORIZONTAL,
    LEFT,
    RIGHT,
    StringVar,
    Tk,
    filedialog,
    messagebox,
    ttk,
)
from tkinter.scrolledtext import ScrolledText


APP_TITLE = "파일 추출 + 업무 프롬프트 생성기"
SUPPORTED_EXTENSIONS = ("docx", "pdf", "xlsx", "pptx", "hwp", "txt", "md", "csv")
FINAL_WORDS = ("최종", "final", "완성", "제출", "확정", "완료")
DRAFT_WORDS = ("초안", "draft", "반려", "예전", "구버전", "미확정", "참고용")


PROMPT_FIRST_LINES = {
    "사업계획서": "너는 정부지원사업 사업계획서·시장조사 전문가야.",
    "자격증 규정": "너는 민간자격 등록·운영규정 설계 전문가야.",
    "교육과정": "너는 교육과정·커리큘럼·기관 제안서 기획 전문가야.",
    "법무증빙": "너는 법무 증빙자료 정리·자문 요청서 작성 전문가야.",
    "업무정리/CEO Agent": "너는 CEO Agent 업무정리·우선순위 설계 전문가야.",
}


GENERATOR_FIELDS = {
    "사업계획서": [
        "사업명",
        "지원사업",
        "작성 분량",
        "시장/수익 분석",
        "경쟁사 분석",
        "수익모델",
        "예산 집행계획",
        "로드맵",
    ],
    "자격증 규정": [
        "기존 자격명",
        "변경 자격명",
        "제출 대상",
        "변경 사유",
        "직무내용",
        "검정기준",
        "반려 사유",
    ],
    "교육과정": [
        "과정명",
        "제안 대상",
        "교육 대상",
        "총시간",
        "차시 수",
        "커리큘럼",
        "평가/수료",
    ],
    "법무증빙": [
        "사건명",
        "상대방",
        "전달 대상",
        "사건 개요",
        "핵심 주장",
        "손해액",
        "변호사 질문",
    ],
    "업무정리/CEO Agent": [
        "업무명",
        "지시한 사람",
        "관련 부서",
        "담당자",
        "상태",
        "마감일",
        "다음 행동",
    ],
}


@dataclass
class SearchResult:
    path: Path
    score: int
    modified: datetime
    reason: str
    preview: str


def split_keywords(value: str) -> list[str]:
    return [item.strip() for item in re.split(r"[,;\n]+", value) if item.strip()]


def safe_read_text(path: Path) -> tuple[str, str]:
    suffix = path.suffix.lower()
    try:
        if suffix in {".txt", ".md", ".csv"}:
            return path.read_text(encoding="utf-8", errors="ignore")[:20000], "본문"
        if suffix == ".docx":
            try:
                from docx import Document  # type: ignore
            except Exception:
                return "", "docx 본문 검색 비활성: python-docx 미설치"
            doc = Document(str(path))
            text = "\n".join(p.text for p in doc.paragraphs)
            return text[:20000], "본문"
        if suffix == ".pdf":
            try:
                from pypdf import PdfReader  # type: ignore
            except Exception:
                return "", "pdf 본문 검색 비활성: pypdf 미설치"
            reader = PdfReader(str(path))
            pages = [page.extract_text() or "" for page in reader.pages[:10]]
            return "\n".join(pages)[:20000], "본문"
    except Exception as exc:
        return "", f"본문 읽기 실패: {exc}"
    return "", "파일명"


def file_matches_period(path: Path, period: str) -> bool:
    if period == "전체 기간":
        return True
    modified = datetime.fromtimestamp(path.stat().st_mtime)
    days = 365 if period == "최근 1년" else 180
    return modified >= datetime.now() - timedelta(days=days)


def score_file(path: Path, body: str, required: list[str], boost: list[str], hold: list[str], latest: bool, final_first: bool) -> tuple[int, str]:
    haystack = f"{path.name}\n{body}".lower()
    name = path.name.lower()
    score = 0
    reasons: list[str] = []

    for keyword in required:
        if keyword.lower() in haystack:
            score += 30
            reasons.append(f"필수:{keyword}")

    for keyword in boost:
        if keyword.lower() in haystack:
            score += 10
            reasons.append(f"강화:{keyword}")

    for keyword in hold:
        if keyword.lower() in haystack:
            score -= 5
            reasons.append(f"검토:{keyword}")

    if final_first and any(word in name for word in FINAL_WORDS):
        score += 15
        reasons.append("최종본")

    if any(word in name for word in DRAFT_WORDS):
        score -= 10
        reasons.append("초안/구버전")

    if latest:
        age_days = (datetime.now() - datetime.fromtimestamp(path.stat().st_mtime)).days
        if age_days <= 30:
            score += 10
            reasons.append("최근30일")
        elif age_days <= 180:
            score += 5
            reasons.append("최근6개월")

    return score, ", ".join(reasons) or "파일명 기준"


class PromptApp:
    def __init__(self, root: Tk) -> None:
        self.root = root
        self.root.title(APP_TITLE)
        self.root.geometry("1240x820")
        self.root.minsize(1020, 720)

        self.results: list[SearchResult] = []
        self.worker_queue: queue.Queue[tuple[str, object]] = queue.Queue()

        self.source_dir = StringVar()
        self.output_dir = StringVar(value=str(Path.cwd() / "outputs"))
        self.period = StringVar(value="최근 1년")
        self.generator = StringVar(value="사업계획서")
        self.prompt_stage = StringVar(value="1차 구조 설계")
        self.target = StringVar(value="심사위원")
        self.tone = StringVar(value="전문적이고 쉽게")
        self.output_type = StringVar(value="표 + Word용 문서")

        self.include_required = StringVar(value="사업계획서, 시장조사, 수익모델")
        self.include_boost = StringVar(value="AI교육, 문제생성, 평가플랫폼")
        self.hold_keywords = StringVar(value="초안, 예전안, 반려, 미확정, 참고용")
        self.exclude_keywords = StringVar(value="폐기, 사용안함, 삭제, 구버전")

        self.latest_first = BooleanVar(value=True)
        self.final_first = BooleanVar(value=True)
        self.search_body = BooleanVar(value=True)

        self.extension_vars = {ext: BooleanVar(value=ext in {"docx", "pdf", "xlsx", "pptx", "txt", "md"}) for ext in SUPPORTED_EXTENSIONS}
        self.option_vars = {
            "두서없는 말 정리": BooleanVar(value=True),
            "빠진 내용 질문": BooleanVar(value=True),
            "중복 내용 삭제": BooleanVar(value=True),
            "대/중/소 분류": BooleanVar(value=True),
            "고정/준고정/선택 구분": BooleanVar(value=True),
            "우선순위 표시": BooleanVar(value=True),
            "마지막 표 요약": BooleanVar(value=True),
            "Word 다운로드용 문구 포함": BooleanVar(value=True),
        }

        self.generator_entries: dict[str, StringVar] = {}
        self.build_ui()
        self.root.after(150, self.consume_queue)

    def build_ui(self) -> None:
        main = ttk.Frame(self.root, padding=10)
        main.pack(fill="both", expand=True)

        header = ttk.Frame(main)
        header.pack(fill="x")
        ttk.Label(header, text=APP_TITLE, font=("맑은 고딕", 16, "bold")).pack(side=LEFT)
        ttk.Button(header, text="프롬프트 생성", command=self.generate_prompt).pack(side=RIGHT, padx=4)
        ttk.Button(header, text="저장", command=self.save_prompt).pack(side=RIGHT, padx=4)
        ttk.Button(header, text="복사", command=self.copy_prompt).pack(side=RIGHT, padx=4)

        notebook = ttk.Notebook(main)
        notebook.pack(fill="both", expand=True, pady=(10, 0))

        self.search_tab = ttk.Frame(notebook, padding=8)
        self.prompt_tab = ttk.Frame(notebook, padding=8)
        notebook.add(self.search_tab, text="STEP 1. 관련 파일 찾기")
        notebook.add(self.prompt_tab, text="STEP 2-5. 업무 프롬프트")

        self.build_search_tab()
        self.build_prompt_tab()

    def build_search_tab(self) -> None:
        top = ttk.LabelFrame(self.search_tab, text="폴더 설정", padding=8)
        top.pack(fill="x")
        self.path_row(top, "원본 폴더", self.source_dir, self.pick_source)
        self.path_row(top, "결과 저장 폴더", self.output_dir, self.pick_output)

        filters = ttk.LabelFrame(self.search_tab, text="파일 조건 / 키워드", padding=8)
        filters.pack(fill="x", pady=8)

        row1 = ttk.Frame(filters)
        row1.pack(fill="x", pady=2)
        ttk.Label(row1, text="확장자", width=14).pack(side=LEFT)
        for ext, var in self.extension_vars.items():
            ttk.Checkbutton(row1, text=ext, variable=var).pack(side=LEFT, padx=3)
        ttk.Label(row1, text="기간").pack(side=LEFT, padx=(16, 4))
        ttk.Combobox(row1, textvariable=self.period, values=["전체 기간", "최근 1년", "최근 6개월"], width=12, state="readonly").pack(side=LEFT)
        ttk.Checkbutton(row1, text="최신 파일 우선", variable=self.latest_first).pack(side=LEFT, padx=8)
        ttk.Checkbutton(row1, text="최종본 우선", variable=self.final_first).pack(side=LEFT, padx=8)
        ttk.Checkbutton(row1, text="본문 검색", variable=self.search_body).pack(side=LEFT, padx=8)

        self.entry_row(filters, "반드시 포함", self.include_required)
        self.entry_row(filters, "관련성 강화", self.include_boost)
        self.entry_row(filters, "보류/검토", self.hold_keywords)
        self.entry_row(filters, "제외 키워드", self.exclude_keywords)

        actions = ttk.Frame(self.search_tab)
        actions.pack(fill="x", pady=(0, 8))
        ttk.Button(actions, text="관련 파일 찾기", command=self.start_search).pack(side=LEFT)
        ttk.Button(actions, text="선택 파일 복사", command=self.copy_selected_files).pack(side=LEFT, padx=6)
        ttk.Button(actions, text="선택 파일 미리보기", command=self.preview_selected_file).pack(side=LEFT)
        self.status_label = ttk.Label(actions, text="검색 전")
        self.status_label.pack(side=RIGHT)

        paned = ttk.PanedWindow(self.search_tab, orient=HORIZONTAL)
        paned.pack(fill="both", expand=True)

        result_frame = ttk.Frame(paned)
        self.result_tree = ttk.Treeview(result_frame, columns=("score", "modified", "reason", "path"), show="headings", selectmode="extended")
        self.result_tree.heading("score", text="점수")
        self.result_tree.heading("modified", text="수정일")
        self.result_tree.heading("reason", text="근거")
        self.result_tree.heading("path", text="파일")
        self.result_tree.column("score", width=60, anchor="center")
        self.result_tree.column("modified", width=130, anchor="center")
        self.result_tree.column("reason", width=260)
        self.result_tree.column("path", width=520)
        self.result_tree.pack(fill="both", expand=True)
        self.result_tree.bind("<<TreeviewSelect>>", lambda _event: self.preview_selected_file())

        preview_frame = ttk.Frame(paned)
        self.preview_text = ScrolledText(preview_frame, height=14, wrap="word")
        self.preview_text.pack(fill="both", expand=True)
        paned.add(result_frame, weight=3)
        paned.add(preview_frame, weight=2)

    def build_prompt_tab(self) -> None:
        left = ttk.Frame(self.prompt_tab)
        left.pack(side=LEFT, fill="both", expand=False, padx=(0, 8))
        right = ttk.Frame(self.prompt_tab)
        right.pack(side=RIGHT, fill="both", expand=True)

        base = ttk.LabelFrame(left, text="공통 설정", padding=8)
        base.pack(fill="x")
        self.combo_row(base, "생성기", self.generator, list(GENERATOR_FIELDS.keys()), self.refresh_generator_fields)
        self.combo_row(base, "프롬프트 단계", self.prompt_stage, ["1차 구조 설계", "2차 UX 개선", "최종 산출물 작성", "메일/보고용 정리"])
        self.combo_row(base, "받을 사람", self.target, ["심사위원", "대표님", "이사님", "교수님", "변호사", "직원", "거래처"])
        self.combo_row(base, "말투", self.tone, ["전문적이고 쉽게", "짧고 단정하게", "부드럽지만 명확하게", "감정 빼고 핵심 중심", "강하게 요청"])
        self.combo_row(base, "결과물", self.output_type, ["표 + Word용 문서", "메일", "HTML", "보고서", "업무표"])

        fields = ttk.LabelFrame(left, text="생성기 전용 입력", padding=8)
        fields.pack(fill="both", expand=True, pady=8)
        self.generator_fields_frame = fields
        self.refresh_generator_fields()

        options = ttk.LabelFrame(left, text="정리 옵션", padding=8)
        options.pack(fill="x")
        for label, var in self.option_vars.items():
            ttk.Checkbutton(options, text=label, variable=var).pack(anchor="w")

        memo_frame = ttk.LabelFrame(right, text="내 멘션 / 두서없는 메모", padding=8)
        memo_frame.pack(fill="both", expand=True)
        self.memo_text = ScrolledText(memo_frame, height=8, wrap="word")
        self.memo_text.pack(fill="both", expand=True)

        rule_frame = ttk.LabelFrame(right, text="기본 지시사항 / 회사 규정 / 고려사항", padding=8)
        rule_frame.pack(fill="both", expand=True, pady=8)
        self.rule_text = ScrolledText(rule_frame, height=8, wrap="word")
        self.rule_text.insert("1.0", "입력하지 않은 항목은 생략해줘.\n표로 요약하고 Word 문서 제목 구조를 포함해줘.")
        self.rule_text.pack(fill="both", expand=True)

        output_frame = ttk.LabelFrame(right, text="생성된 프롬프트", padding=8)
        output_frame.pack(fill="both", expand=True)
        self.output_text = ScrolledText(output_frame, height=12, wrap="word")
        self.output_text.pack(fill="both", expand=True)

    def path_row(self, parent: ttk.Frame, label: str, variable: StringVar, command) -> None:
        row = ttk.Frame(parent)
        row.pack(fill="x", pady=2)
        ttk.Label(row, text=label, width=14).pack(side=LEFT)
        ttk.Entry(row, textvariable=variable).pack(side=LEFT, fill="x", expand=True)
        ttk.Button(row, text="찾기", command=command).pack(side=LEFT, padx=(6, 0))

    def entry_row(self, parent: ttk.Frame, label: str, variable: StringVar) -> None:
        row = ttk.Frame(parent)
        row.pack(fill="x", pady=2)
        ttk.Label(row, text=label, width=14).pack(side=LEFT)
        ttk.Entry(row, textvariable=variable).pack(side=LEFT, fill="x", expand=True)

    def combo_row(self, parent: ttk.Frame, label: str, variable: StringVar, values: list[str], callback=None) -> None:
        row = ttk.Frame(parent)
        row.pack(fill="x", pady=2)
        ttk.Label(row, text=label, width=12).pack(side=LEFT)
        combo = ttk.Combobox(row, textvariable=variable, values=values, width=24, state="readonly")
        combo.pack(side=LEFT, fill="x", expand=True)
        if callback:
            combo.bind("<<ComboboxSelected>>", lambda _event: callback())

    def pick_source(self) -> None:
        directory = filedialog.askdirectory(title="원본 폴더 선택")
        if directory:
            self.source_dir.set(directory)

    def pick_output(self) -> None:
        directory = filedialog.askdirectory(title="결과 저장 폴더 선택")
        if directory:
            self.output_dir.set(directory)

    def start_search(self) -> None:
        source = Path(self.source_dir.get().strip())
        if not source.exists() or not source.is_dir():
            messagebox.showerror("오류", "검색할 원본 폴더를 선택하세요.")
            return
        selected_exts = [ext for ext, var in self.extension_vars.items() if var.get()]
        if not selected_exts:
            messagebox.showerror("오류", "검색할 확장자를 하나 이상 선택하세요.")
            return

        self.result_tree.delete(*self.result_tree.get_children())
        self.preview_text.delete("1.0", END)
        self.status_label.config(text="검색 중...")

        thread = threading.Thread(target=self.search_worker, args=(source, selected_exts), daemon=True)
        thread.start()

    def search_worker(self, source: Path, selected_exts: list[str]) -> None:
        required = split_keywords(self.include_required.get())
        boost = split_keywords(self.include_boost.get())
        hold = split_keywords(self.hold_keywords.get())
        exclude = split_keywords(self.exclude_keywords.get())
        results: list[SearchResult] = []

        try:
            for path in source.rglob("*"):
                if not path.is_file() or path.suffix.lower().lstrip(".") not in selected_exts:
                    continue
                if not file_matches_period(path, self.period.get()):
                    continue
                name_lower = path.name.lower()
                if any(keyword.lower() in name_lower for keyword in exclude):
                    continue

                body = ""
                read_note = "파일명"
                if self.search_body.get():
                    body, read_note = safe_read_text(path)
                    if any(keyword.lower() in body.lower() for keyword in exclude):
                        continue

                if required and not all(keyword.lower() in f"{path.name}\n{body}".lower() for keyword in required):
                    continue

                score, reason = score_file(path, body, required, boost, hold, self.latest_first.get(), self.final_first.get())
                if score <= 0 and required:
                    continue
                modified = datetime.fromtimestamp(path.stat().st_mtime)
                preview = body[:1200].strip() if body else f"{read_note}\n{path.name}"
                results.append(SearchResult(path=path, score=score, modified=modified, reason=reason, preview=preview))

            results.sort(key=lambda item: (item.score, item.modified), reverse=True)
            self.worker_queue.put(("done", results))
        except Exception as exc:
            self.worker_queue.put(("error", str(exc)))

    def consume_queue(self) -> None:
        try:
            event, payload = self.worker_queue.get_nowait()
        except queue.Empty:
            self.root.after(150, self.consume_queue)
            return

        if event == "done":
            self.results = payload  # type: ignore[assignment]
            for index, item in enumerate(self.results):
                self.result_tree.insert(
                    "",
                    END,
                    iid=str(index),
                    values=(item.score, item.modified.strftime("%Y-%m-%d %H:%M"), item.reason, str(item.path)),
                )
            self.status_label.config(text=f"검색 완료: {len(self.results)}개")
        elif event == "error":
            self.status_label.config(text="검색 실패")
            messagebox.showerror("검색 실패", str(payload))

        self.root.after(150, self.consume_queue)

    def selected_results(self) -> list[SearchResult]:
        selected = []
        for iid in self.result_tree.selection():
            try:
                selected.append(self.results[int(iid)])
            except (ValueError, IndexError):
                pass
        return selected

    def preview_selected_file(self) -> None:
        selected = self.selected_results()
        self.preview_text.delete("1.0", END)
        if not selected:
            return
        item = selected[0]
        text = f"{item.path}\n점수: {item.score}\n근거: {item.reason}\n\n{item.preview}"
        self.preview_text.insert("1.0", text)

    def copy_selected_files(self) -> None:
        selected = self.selected_results()
        if not selected:
            messagebox.showwarning("선택 필요", "복사할 파일을 선택하세요.")
            return
        output_dir = Path(self.output_dir.get().strip())
        output_dir.mkdir(parents=True, exist_ok=True)
        copied = 0
        for item in selected:
            target = output_dir / item.path.name
            if target.exists():
                target = output_dir / f"{item.path.stem}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{item.path.suffix}"
            shutil.copy2(item.path, target)
            copied += 1
        messagebox.showinfo("복사 완료", f"{copied}개 파일을 복사했습니다.\n{output_dir}")

    def refresh_generator_fields(self) -> None:
        for child in self.generator_fields_frame.winfo_children():
            child.destroy()
        self.generator_entries = {}
        for field in GENERATOR_FIELDS[self.generator.get()]:
            variable = StringVar()
            self.generator_entries[field] = variable
            self.entry_row(self.generator_fields_frame, field, variable)

    def generate_prompt(self) -> None:
        selected_files = self.selected_results()
        file_lines = [f"- {item.path.name} | 점수 {item.score} | {item.path}" for item in selected_files]
        if not file_lines:
            file_lines = ["- 선택한 파일 없음. 사용자가 입력한 조건과 메모만 기준으로 작성"]

        field_lines = []
        for label, variable in self.generator_entries.items():
            value = variable.get().strip()
            if value:
                field_lines.append(f"- {label}: {value}")

        options = [label for label, var in self.option_vars.items() if var.get()]
        memo = self.memo_text.get("1.0", END).strip()
        rules = self.rule_text.get("1.0", END).strip()

        stage = self.prompt_stage.get()
        prompt = [
            PROMPT_FIRST_LINES[self.generator.get()],
            "",
            f"아래 조건을 기준으로 '{stage}' 프롬프트를 작성해줘.",
            "입력하지 않은 항목은 자동으로 생략하고, 중복되는 내용은 정리해줘.",
            "",
            "[참고 파일]",
            *file_lines,
            "",
            "[작업 목적]",
            f"- 생성기 종류: {self.generator.get()}",
            f"- 단계: {stage}",
            f"- 대상: {self.target.get()}",
            f"- 말투: {self.tone.get()}",
            f"- 결과물 형태: {self.output_type.get()}",
            "",
        ]

        if field_lines:
            prompt.extend(["[업무별 세부 입력]", *field_lines, ""])

        if options:
            prompt.extend(["[정리 옵션]", *[f"- {item}" for item in options], ""])

        if rules:
            prompt.extend(["[기본 지시사항 / 회사 규정]", rules, ""])

        if memo:
            prompt.extend(["[내 멘션 / 두서없는 메모]", memo, ""])

        prompt.extend(
            [
                "[출력 요청]",
                "- 먼저 빠진 정보가 있으면 질문 목록으로 정리해줘.",
                "- 그다음 바로 사용할 수 있는 업무용 문장으로 정리해줘.",
                "- 고정/준고정/선택 항목이 섞여 있으면 구분해서 표시해줘.",
                "- 마지막에는 표로 요약하고, Word 문서로 저장할 수 있도록 제목 구조를 포함해줘.",
            ]
        )

        self.output_text.delete("1.0", END)
        self.output_text.insert("1.0", "\n".join(prompt))

    def copy_prompt(self) -> None:
        text = self.output_text.get("1.0", END).strip()
        if not text:
            self.generate_prompt()
            text = self.output_text.get("1.0", END).strip()
        self.root.clipboard_clear()
        self.root.clipboard_append(text)
        self.status_label.config(text="프롬프트 복사 완료")

    def save_prompt(self) -> None:
        text = self.output_text.get("1.0", END).strip()
        if not text:
            self.generate_prompt()
            text = self.output_text.get("1.0", END).strip()

        output_dir = Path(self.output_dir.get().strip())
        output_dir.mkdir(parents=True, exist_ok=True)
        filename = f"prompt_{self.generator.get().replace('/', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        path = filedialog.asksaveasfilename(
            title="프롬프트 저장",
            initialdir=str(output_dir),
            initialfile=filename,
            defaultextension=".md",
            filetypes=[("Markdown", "*.md"), ("Text", "*.txt"), ("All files", "*.*")],
        )
        if not path:
            return
        Path(path).write_text(text, encoding="utf-8")
        messagebox.showinfo("저장 완료", f"저장했습니다.\n{path}")


def main() -> None:
    root = Tk()
    style = ttk.Style(root)
    if "vista" in style.theme_names():
        style.theme_use("vista")
    app = PromptApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
