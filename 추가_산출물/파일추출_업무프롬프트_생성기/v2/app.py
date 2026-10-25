from __future__ import annotations

import queue
import re
import shutil
import threading
import zipfile
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from xml.etree import ElementTree
from tkinter import (
    BooleanVar,
    Canvas,
    END,
    HORIZONTAL,
    LEFT,
    RIGHT,
    StringVar,
    Tk,
    Toplevel,
    filedialog,
    messagebox,
    ttk,
)
from tkinter.scrolledtext import ScrolledText


APP_TITLE = "파일 추출 + 업무 프롬프트 생성기 V2"
SUPPORTED_EXTENSIONS = ("docx", "pdf", "xlsx", "pptx", "hwp", "txt", "md", "csv")
FINAL_WORDS = ("최종", "final", "완성", "제출", "확정", "완료")
DRAFT_WORDS = ("초안", "draft", "반려", "예전", "구버전", "미확정", "참고용")
MAX_DIRECT_FOLDER_FILES = 200
MAX_PROMPT_CONTENT_FILES = 8
MAX_PROMPT_CONTENT_CHARS = 4000

GENERATORS = {
    "사업계획서": {
        "first": "너는 정부지원사업 사업계획서·시장조사 전문가야.",
        "fields": ("사업", "지원", "시장", "수익", "경쟁", "예산", "로드맵", "출처"),
        "checks": (
            "문제", "한계", "해결", "흐름", "국내", "해외", "규모", "성장",
            "수요", "유료", "B2B", "구독", "경쟁사", "비교표", "차별", "그래프",
            "도표", "예산", "로드맵", "출처",
        ),
    },
    "자격증 규정": {
        "first": "너는 민간자격 등록·운영규정 설계 전문가야.",
        "fields": ("기존", "변경", "제출", "사유", "직무", "검정", "반려"),
        "checks": ("변경사유", "직무", "검정", "합격", "응시", "등급", "반려", "동일직무", "문제표현", "전후표", "삭제유지", "Word"),
    },
    "교육과정": {
        "first": "너는 교육과정·커리큘럼·기관 제안서 기획 전문가야.",
        "fields": ("과정", "대상", "총시간", "차시", "커리큘럼", "평가", "수료"),
        "checks": ("소개", "목표", "차시", "실습", "평가", "수료", "접수", "서류", "전형", "홈페이지", "A4", "Word"),
    },
    "법무증빙": {
        "first": "너는 법무 증빙자료 정리·자문 요청서 작성 전문가야.",
        "fields": ("사건", "상대", "전달", "개요", "주장", "손해액", "질문"),
        "checks": ("개요", "타임라인", "주장", "반박", "손해액", "증거", "질문", "확인필요", "사실분리", "감정삭제", "메일", "Word"),
    },
    "업무정리": {
        "first": "너는 CEO Agent 업무정리·우선순위 설계 전문가야.",
        "fields": ("업무", "지시", "부서", "담당", "상태", "마감", "다음행동"),
        "checks": ("요약", "할일", "빠진정보", "질문", "우선순위", "다음행동", "담당자", "직원문", "대표보고", "리스크", "체크", "Word"),
    },
}

COMMON_OPTIONS = (
    "두서없는 말 정리",
    "빠진 질문",
    "중복 삭제",
    "대/중/소 정리",
    "고정/준고정/선택",
    "우선순위",
    "표 요약",
    "Word 문구",
)


@dataclass
class SearchResult:
    path: Path
    score: int
    modified: datetime
    reason: str
    preview: str


def split_keywords(value: str) -> list[str]:
    return [item.strip() for item in re.split(r"[,;\n]+", value) if item.strip()]


def xml_text_from_zip(path: Path, member_prefix: str) -> str:
    chunks: list[str] = []
    with zipfile.ZipFile(path) as archive:
        for name in archive.namelist():
            if not name.startswith(member_prefix) or not name.endswith(".xml"):
                continue
            try:
                root = ElementTree.fromstring(archive.read(name))
            except Exception:
                continue
            texts = [node.text.strip() for node in root.iter() if node.text and node.text.strip()]
            if texts:
                chunks.append(" ".join(texts))
    return "\n".join(chunks)[:30000]


def read_text_preview(path: Path) -> tuple[str, str]:
    suffix = path.suffix.lower()
    try:
        if suffix in {".txt", ".md", ".csv"}:
            return path.read_text(encoding="utf-8", errors="ignore")[:30000], "본문"
        if suffix == ".docx":
            try:
                from docx import Document  # type: ignore
            except Exception:
                return "", "docx 본문 검색 비활성: python-docx 미설치"
            doc = Document(str(path))
            return "\n".join(p.text for p in doc.paragraphs)[:30000], "본문"
        if suffix == ".pdf":
            try:
                from pypdf import PdfReader  # type: ignore
            except Exception:
                return "", "pdf 본문 검색 비활성: pypdf 미설치"
            reader = PdfReader(str(path))
            return "\n".join((page.extract_text() or "") for page in reader.pages[:10])[:30000], "본문"
        if suffix == ".xlsx":
            return xml_text_from_zip(path, "xl/"), "본문"
        if suffix == ".pptx":
            return xml_text_from_zip(path, "ppt/slides/"), "본문"
    except Exception as exc:
        return "", f"본문 읽기 실패: {exc}"
    return "", "파일명"


def period_matches(path: Path, period: str) -> bool:
    if period == "전체":
        return True
    modified = datetime.fromtimestamp(path.stat().st_mtime)
    days = 180 if period == "최근 6개월" else 365
    return modified >= datetime.now() - timedelta(days=days)


def extension_group(group_name: str) -> set[str]:
    if group_name == "문서만":
        return {"docx", "hwp", "txt", "md"}
    if group_name == "PDF만":
        return {"pdf"}
    if group_name == "전체":
        return set(SUPPORTED_EXTENSIONS)
    return {"docx", "pdf", "xlsx", "pptx", "txt", "md", "csv"}


def score_file(path: Path, body: str, required: list[str], boost: list[str], hold: list[str], version: str) -> tuple[int, str]:
    haystack = f"{path.name}\n{body}".lower()
    name = path.name.lower()
    score = 0
    reasons: list[str] = []

    for keyword in required:
        if keyword.lower() in haystack:
            score += 30
            reasons.append(f"포함:{keyword}")
    for keyword in boost:
        if keyword.lower() in haystack:
            score += 10
            reasons.append(f"강화:{keyword}")
    for keyword in hold:
        if keyword.lower() in haystack:
            score -= 5
            reasons.append(f"보류:{keyword}")

    if version == "최신/최종":
        age_days = (datetime.now() - datetime.fromtimestamp(path.stat().st_mtime)).days
        if age_days <= 30:
            score += 10
            reasons.append("최근30일")
        if any(word in name for word in FINAL_WORDS):
            score += 15
            reasons.append("최종본")
        if any(word in name for word in DRAFT_WORDS):
            score -= 10
            reasons.append("초안/구버전")
    elif version == "반려 포함" and "반려" in haystack:
        score += 8
        reasons.append("반려참고")

    return score, ", ".join(reasons) or "파일명 기준"


class V2App:
    def __init__(self, root: Tk) -> None:
        self.root = root
        self.root.title(APP_TITLE)
        self.root.geometry("1480x900")
        self.root.minsize(1120, 760)

        self.results: list[SearchResult] = []
        self.worker_queue: queue.Queue[tuple[str, object]] = queue.Queue()

        self.source_dir = StringVar(value="")
        self.output_dir = StringVar(value=str(Path.cwd() / "outputs"))
        self.file_group = StringVar(value="문서+표+PPT")
        self.period = StringVar(value="최근 1년")
        self.version = StringVar(value="최신/최종")
        self.include_keywords = StringVar(value="사업계획서, 시장조사")
        self.boost_keywords = StringVar(value="AI교육, 문제생성, 평가플랫폼")
        self.hold_keywords = StringVar(value="초안, 예전안, 반려, 참고용")
        self.exclude_keywords = StringVar(value="폐기, 사용안함, 구버전")
        self.search_filename = BooleanVar(value=True)
        self.search_body = BooleanVar(value=True)
        self.include_subfolders = BooleanVar(value=True)

        self.generator = StringVar(value="사업계획서")
        self.stage = StringVar(value="1차 구조")
        self.target = StringVar(value="심사위원")
        self.tone = StringVar(value="전문적이고 쉽게")
        self.output_type = StringVar(value="표+Word")
        self.field_vars: dict[str, StringVar] = {}
        self.generator_check_vars: dict[str, BooleanVar] = {}
        self.option_vars = {name: BooleanVar(value=True) for name in COMMON_OPTIONS}

        self.tag_rows: list[tuple[BooleanVar, StringVar, StringVar, StringVar]] = []
        self.fixed_rule_vars = {
            "고밀도 테이블형": BooleanVar(value=True),
            "한 셀 세로배치": BooleanVar(value=True),
            "표 중심": BooleanVar(value=True),
            "대/중/소 분류": BooleanVar(value=True),
            "마지막 요약표": BooleanVar(value=True),
            "Word 구조": BooleanVar(value=True),
        }

        self.build_styles()
        self.build_ui()
        self.bind_shortcuts()
        self.root.after(150, self.consume_queue)

    def build_styles(self) -> None:
        style = ttk.Style(self.root)
        if "vista" in style.theme_names():
            style.theme_use("vista")
        style.configure("Small.TButton", font=("맑은 고딕", 9), padding=(6, 2))
        style.configure("Title.TLabel", font=("맑은 고딕", 16, "bold"))
        style.configure("Section.TLabelframe.Label", font=("맑은 고딕", 9, "bold"))
        style.configure("Tag.TLabel", background="#ffffff", borderwidth=1, relief="solid", padding=(5, 1))

    def build_ui(self) -> None:
        shell = ttk.Frame(self.root, padding=6)
        shell.pack(fill="both", expand=True)

        header = ttk.Frame(shell)
        header.pack(fill="x")
        ttk.Label(header, text=APP_TITLE, style="Title.TLabel").pack(side=LEFT)
        ttk.Label(header, text="Ctrl+F 파일 · Ctrl+G 생성 · Ctrl+S 저장 · Ctrl+1~5 생성기").pack(side=LEFT, padx=18)
        ttk.Button(header, text="복사", style="Small.TButton", command=self.copy_prompt).pack(side=RIGHT, padx=3)
        ttk.Button(header, text="저장", style="Small.TButton", command=self.save_prompt).pack(side=RIGHT, padx=3)
        ttk.Button(header, text="생성", style="Small.TButton", command=self.generate_prompt).pack(side=RIGHT, padx=3)

        self.notebook = ttk.Notebook(shell)
        self.notebook.pack(fill="both", expand=True, pady=(6, 0))
        self.work_tab = ttk.Frame(self.notebook, padding=5)
        self.file_tab = ttk.Frame(self.notebook, padding=8)
        self.setting_tab = ttk.Frame(self.notebook, padding=8)
        self.help_tab = ttk.Frame(self.notebook, padding=8)
        self.notebook.add(self.work_tab, text="① 통합작업")
        self.notebook.add(self.file_tab, text="② 파일결과")
        self.notebook.add(self.setting_tab, text="③ 설정저장")
        self.notebook.add(self.help_tab, text="④ 도움말")

        self.build_work_tab()
        self.build_file_tab()
        self.build_setting_tab()
        self.build_help_tab()

    def build_work_tab(self) -> None:
        vertical = ttk.PanedWindow(self.work_tab, orient="vertical")
        vertical.pack(fill="both", expand=True)

        work = ttk.PanedWindow(vertical, orient=HORIZONTAL)
        vertical.add(work, weight=5)
        footer = ttk.PanedWindow(vertical, orient=HORIZONTAL)
        vertical.add(footer, weight=1)

        left = ttk.Frame(work)
        center = ttk.Frame(work)
        right = ttk.Frame(work)
        work.add(left, weight=3)
        work.add(center, weight=5)
        work.add(right, weight=2)

        self.build_search_panel(left)
        self.build_prompt_panel(center)
        self.build_quick_panel(right)

        result_frame = ttk.LabelFrame(footer, text="파일 결과 요약", padding=4, style="Section.TLabelframe")
        self.footer_tree = self.create_result_tree(result_frame)
        self.footer_tree.pack(fill="both", expand=True)
        self.footer_tree.bind("<<TreeviewSelect>>", lambda _event: self.preview_selected_file())
        footer.add(result_frame, weight=45)

        preview_frame = ttk.LabelFrame(footer, text="생성 프롬프트 미리보기", padding=4, style="Section.TLabelframe")
        self.preview_output = ScrolledText(preview_frame, height=7, wrap="word", font=("Consolas", 9))
        self.preview_output.pack(fill="both", expand=True)
        footer.add(preview_frame, weight=55)

    def build_search_panel(self, parent: ttk.Frame) -> None:
        frame = ttk.LabelFrame(parent, text="① 관련 파일 찾기", padding=6, style="Section.TLabelframe")
        frame.pack(fill="both", expand=True)
        actions = ttk.Frame(frame)
        actions.pack(fill="x")
        ttk.Button(actions, text="찾기", style="Small.TButton", command=self.start_search).pack(side=RIGHT, padx=2)
        ttk.Button(actions, text="복사", style="Small.TButton", command=self.copy_selected_files).pack(side=RIGHT, padx=2)
        ttk.Button(actions, text="파일 선택", style="Small.TButton", command=self.pick_reference_files).pack(side=RIGHT, padx=2)
        ttk.Button(actions, text="폴더 선택", style="Small.TButton", command=self.pick_reference_folder).pack(side=RIGHT, padx=2)
        ttk.Button(actions, text="?", style="Small.TButton", command=self.show_file_help).pack(side=RIGHT, padx=2)

        box = ttk.LabelFrame(frame, text="폴더", padding=5)
        box.pack(fill="x", pady=4)
        self.path_row(box, "원본", self.source_dir, self.pick_source)
        self.path_row(box, "저장", self.output_dir, self.pick_output)

        simple = ttk.LabelFrame(frame, text="간단 조건", padding=5)
        simple.pack(fill="x", pady=4)
        row = ttk.Frame(simple)
        row.pack(fill="x")
        self.combo_cell(row, "파일", self.file_group, ("문서+표+PPT", "문서만", "PDF만", "전체"))
        self.combo_cell(row, "기간", self.period, ("최근 1년", "최근 6개월", "전체"))
        self.combo_cell(row, "버전", self.version, ("최신/최종", "초안 포함", "반려 포함"))

        keyword = ttk.LabelFrame(frame, text="키워드 중심 검색", padding=5)
        keyword.pack(fill="both", expand=True, pady=4)
        self.entry_row(keyword, "포함", self.include_keywords)
        self.entry_row(keyword, "강화", self.boost_keywords)
        self.entry_row(keyword, "보류", self.hold_keywords)
        self.entry_row(keyword, "제외", self.exclude_keywords)

        advanced = ttk.LabelFrame(keyword, text="고급 검색 조건", padding=4)
        advanced.pack(fill="x", pady=(6, 0))
        for label, var in (("파일명", self.search_filename), ("본문", self.search_body), ("하위폴더", self.include_subfolders)):
            ttk.Checkbutton(advanced, text=label, variable=var).pack(side=LEFT, padx=4)

        guide = ttk.LabelFrame(frame, text="안내", padding=5)
        guide.pack(fill="x", pady=4)
        ttk.Label(guide, text="대/중/소는 검색 조건이 아니라, 파일결과 탭에서 선택 파일을 저장·정리할 때 붙이는 분류 태그입니다.", wraplength=360).pack(anchor="w")

        self.status_label = ttk.Label(frame, text="검색 전")
        self.status_label.pack(anchor="e", pady=(4, 0))

    def build_prompt_panel(self, parent: ttk.Frame) -> None:
        frame = ttk.LabelFrame(parent, text="② 업무 프롬프트 설정", padding=6, style="Section.TLabelframe")
        frame.pack(fill="both", expand=True)
        actions = ttk.Frame(frame)
        actions.pack(fill="x")
        ttk.Button(actions, text="크게보기", style="Small.TButton", command=self.show_generator_modal).pack(side=RIGHT, padx=2)
        ttk.Button(actions, text="정리", style="Small.TButton", command=self.clean_memo).pack(side=RIGHT, padx=2)
        ttk.Button(actions, text="생성", style="Small.TButton", command=self.generate_prompt).pack(side=RIGHT, padx=2)

        base = ttk.LabelFrame(frame, text="공통 설정", padding=5)
        base.pack(fill="x", pady=4)
        row = ttk.Frame(base)
        row.pack(fill="x")
        self.combo_cell(row, "생성기", self.generator, tuple(GENERATORS.keys()), self.refresh_generator_fields)
        self.combo_cell(row, "단계", self.stage, ("1차 구조", "2차 UX", "최종산출", "메일/보고"))
        self.combo_cell(row, "대상", self.target, ("심사위원", "대표님", "이사님", "변호사", "직원", "거래처"))
        self.combo_cell(row, "말투", self.tone, ("전문적이고 쉽게", "짧고 단정하게", "부드럽지만 명확하게", "감정 빼고 핵심 중심", "강하게 요청"))
        self.combo_cell(row, "결과", self.output_type, ("표+Word", "메일", "HTML", "보고서", "체크리스트"))

        options = ttk.LabelFrame(frame, text="공통 정리 옵션", padding=5)
        options.pack(fill="x", pady=4)
        self.checkbox_grid(options, self.option_vars, columns=4)

        memo_frame = ttk.LabelFrame(frame, text="내 멘션 / 메모", padding=5)
        memo_frame.pack(fill="x", pady=4)
        self.memo_text = ScrolledText(memo_frame, height=5, wrap="word")
        self.memo_text.pack(fill="x")

        fields = ttk.LabelFrame(frame, text="생성기별 전용 설정", padding=5)
        fields.pack(fill="both", expand=True, pady=4)
        self.generator_canvas = tk_canvas = Canvas(fields, highlightthickness=0)
        scrollbar = ttk.Scrollbar(fields, orient="vertical", command=tk_canvas.yview)
        self.generator_fields_frame = ttk.Frame(tk_canvas)
        self.generator_fields_frame.bind(
            "<Configure>",
            lambda _event: tk_canvas.configure(scrollregion=tk_canvas.bbox("all")),
        )
        tk_canvas.create_window((0, 0), window=self.generator_fields_frame, anchor="nw")
        tk_canvas.configure(yscrollcommand=scrollbar.set)
        tk_canvas.pack(side=LEFT, fill="both", expand=True)
        scrollbar.pack(side=RIGHT, fill="y")
        tk_canvas.bind_all("<MouseWheel>", self.on_generator_mousewheel)
        self.refresh_generator_fields()

    def build_quick_panel(self, parent: ttk.Frame) -> None:
        frame = ttk.LabelFrame(parent, text="③ 빠른 선택", padding=6, style="Section.TLabelframe")
        frame.pack(fill="both", expand=True)
        self.tag_group(frame, "대상/말투", ("대표님", "이사님", "심사위원", "변호사", "짧게", "단정", "부드럽게", "공문"))
        self.checkbox_group(frame, "회사 규정", self.fixed_rule_vars)

        greeting = ttk.LabelFrame(frame, text="인삿말", padding=5)
        greeting.pack(fill="x", pady=4)
        self.greeting_text = ScrolledText(greeting, height=4, wrap="word")
        self.greeting_text.insert("1.0", "안녕하세요.\n관련 자료 정리드립니다.")
        self.greeting_text.pack(fill="x")

        closing = ttk.LabelFrame(frame, text="마무리", padding=5)
        closing.pack(fill="x", pady=4)
        self.closing_text = ScrolledText(closing, height=4, wrap="word")
        self.closing_text.insert("1.0", "확인 후 의견 부탁드립니다.\n필요한 자료가 있으면 추가 전달드리겠습니다.")
        self.closing_text.pack(fill="x")

        shortcut = ttk.LabelFrame(frame, text="단축키", padding=5)
        shortcut.pack(fill="x", pady=4)
        ttk.Label(shortcut, text="Ctrl+F 파일찾기\nCtrl+G 생성\nCtrl+S 저장\nCtrl+1~5 생성기 전환").pack(anchor="w")

    def build_file_tab(self) -> None:
        top = ttk.PanedWindow(self.file_tab, orient=HORIZONTAL)
        top.pack(fill="both", expand=True)

        result_box = ttk.LabelFrame(top, text="② 파일결과", padding=5)
        self.result_tree = self.create_result_tree(result_box)
        self.result_tree.pack(fill="both", expand=True)
        self.result_tree.bind("<<TreeviewSelect>>", lambda _event: self.preview_selected_file())
        top.add(result_box, weight=5)

        tag_box = ttk.LabelFrame(top, text="저장용 분류 태그", padding=5)
        ttk.Label(tag_box, text="대/중/소는 파일을 찾은 뒤 선택 파일을 저장·정리할 때 쓰는 태그입니다.").pack(anchor="w")
        self.tag_table = ttk.Frame(tag_box)
        self.tag_table.pack(fill="both", expand=True, pady=6)
        self.add_tag_row("정부사업", "사업계획서", "시장조사, 예산, 경쟁사")
        self.add_tag_row("업무관리", "지시사항", "이사님, 회의록", checked=False)
        ttk.Button(tag_box, text="+ 분류 추가", style="Small.TButton", command=self.add_blank_tag_row).pack(anchor="w")
        top.add(tag_box, weight=3)

        process_box = ttk.LabelFrame(top, text="선택 파일 처리", padding=5)
        self.selected_only = BooleanVar(value=True)
        self.copy_files_option = BooleanVar(value=True)
        self.summary_option = BooleanVar(value=False)
        self.word_list_option = BooleanVar(value=False)
        for label, var in (
            ("선택 파일만 프롬프트 반영", self.selected_only),
            ("선택 파일 복사", self.copy_files_option),
            ("요약 생성", self.summary_option),
            ("Word 첨부목록", self.word_list_option),
        ):
            ttk.Checkbutton(process_box, text=label, variable=var).pack(anchor="w")
        self.file_memo = ScrolledText(process_box, height=8, wrap="word")
        self.file_memo.pack(fill="both", expand=True, pady=6)
        top.add(process_box, weight=2)

    def build_setting_tab(self) -> None:
        grid = ttk.PanedWindow(self.setting_tab, orient=HORIZONTAL)
        grid.pack(fill="both", expand=True)
        fixed = ttk.LabelFrame(grid, text="③ 설정저장 - 회사 고정 규정", padding=8)
        self.checkbox_grid(fixed, self.fixed_rule_vars, columns=2)
        grid.add(fixed, weight=1)

        preset = ttk.LabelFrame(grid, text="즐겨찾기 프리셋", padding=8)
        self.tag_group(preset, "", ("대표님 보고용", "이사님 업무정리", "변호사 메일용", "심사위원 설득용"))
        ttk.Button(preset, text="현재 설정 저장", style="Small.TButton", command=self.save_settings_snapshot).pack(anchor="w", pady=8)
        grid.add(preset, weight=1)

        fixed_text = ttk.LabelFrame(grid, text="고정 멘트", padding=8)
        self.setting_greeting = ScrolledText(fixed_text, height=6, wrap="word")
        self.setting_greeting.insert("1.0", "안녕하세요.\n관련 자료 정리드립니다.")
        self.setting_greeting.pack(fill="x")
        self.setting_closing = ScrolledText(fixed_text, height=6, wrap="word")
        self.setting_closing.insert("1.0", "확인 후 의견 부탁드립니다.")
        self.setting_closing.pack(fill="x", pady=6)
        grid.add(fixed_text, weight=1)

    def build_help_tab(self) -> None:
        left = ttk.LabelFrame(self.help_tab, text="④ 도움말 - 사용 순서", padding=10)
        left.pack(side=LEFT, fill="both", expand=True, padx=(0, 6))
        help_text = (
            "1. 관련 파일 찾기에서 폴더와 키워드를 입력합니다.\n"
            "2. 파일결과 탭에서 필요한 파일을 선택합니다.\n"
            "3. 필요하면 저장용 대/중/소 태그를 지정합니다.\n"
            "4. 업무 프롬프트에서 생성기와 단계를 선택합니다.\n"
            "5. 내 멘션을 두서없이 입력한 뒤 프롬프트를 생성합니다."
        )
        ttk.Label(left, text=help_text, justify=LEFT).pack(anchor="nw")

        right = ttk.LabelFrame(self.help_tab, text="단축키", padding=10)
        right.pack(side=RIGHT, fill="both", expand=True, padx=(6, 0))
        shortcut_tree = ttk.Treeview(right, columns=("key", "desc"), show="headings", height=8)
        shortcut_tree.heading("key", text="단축키")
        shortcut_tree.heading("desc", text="기능")
        shortcut_tree.column("key", width=120, anchor="center")
        shortcut_tree.column("desc", width=280)
        for key, desc in (("Ctrl+F", "파일 찾기"), ("Ctrl+G", "프롬프트 생성"), ("Ctrl+S", "프롬프트 저장"), ("Ctrl+1~5", "생성기 전환")):
            shortcut_tree.insert("", END, values=(key, desc))
        shortcut_tree.pack(fill="x")

    def path_row(self, parent: ttk.Frame, label: str, variable: StringVar, command) -> None:
        row = ttk.Frame(parent)
        row.pack(fill="x", pady=2)
        ttk.Label(row, text=label, width=6).pack(side=LEFT)
        ttk.Entry(row, textvariable=variable).pack(side=LEFT, fill="x", expand=True)
        ttk.Button(row, text="...", width=3, command=command).pack(side=LEFT, padx=(4, 0))

    def entry_row(self, parent: ttk.Frame, label: str, variable: StringVar) -> None:
        row = ttk.Frame(parent)
        row.pack(fill="x", pady=2)
        ttk.Label(row, text=label, width=6).pack(side=LEFT)
        ttk.Entry(row, textvariable=variable).pack(side=LEFT, fill="x", expand=True)

    def combo_cell(self, parent: ttk.Frame, label: str, variable: StringVar, values: tuple[str, ...], callback=None) -> None:
        cell = ttk.Frame(parent)
        cell.pack(side=LEFT, fill="x", expand=True, padx=2)
        ttk.Label(cell, text=label).pack(anchor="w")
        combo = ttk.Combobox(cell, textvariable=variable, values=values, state="readonly", width=14)
        combo.pack(fill="x")
        if callback:
            combo.bind("<<ComboboxSelected>>", lambda _event: callback())

    def checkbox_grid(self, parent: ttk.Frame, vars_by_label: dict[str, BooleanVar], columns: int) -> None:
        for index, (label, var) in enumerate(vars_by_label.items()):
            ttk.Checkbutton(parent, text=label, variable=var).grid(row=index // columns, column=index % columns, sticky="w", padx=4, pady=2)

    def checkbox_group(self, parent: ttk.Frame, title: str, vars_by_label: dict[str, BooleanVar]) -> None:
        group = ttk.LabelFrame(parent, text=title, padding=5)
        group.pack(fill="x", pady=4)
        self.checkbox_grid(group, vars_by_label, columns=2)

    def tag_group(self, parent: ttk.Frame, title: str, labels: tuple[str, ...]) -> None:
        group = ttk.LabelFrame(parent, text=title or "태그", padding=5)
        group.pack(fill="x", pady=4)
        for label in labels:
            ttk.Button(group, text=label, style="Small.TButton", command=lambda value=label: self.apply_quick_tag(value)).pack(side=LEFT, padx=2, pady=2)

    def apply_quick_tag(self, value: str) -> None:
        target_values = {"대표님", "이사님", "심사위원", "변호사", "직원", "거래처"}
        tone_values = {
            "짧게": "짧고 단정하게",
            "단정": "짧고 단정하게",
            "부드럽게": "부드럽지만 명확하게",
            "공문": "전문적이고 쉽게",
        }
        preset_values = {
            "대표님 보고용": ("대표님", "짧고 단정하게", "보고서"),
            "이사님 업무정리": ("이사님", "짧고 단정하게", "체크리스트"),
            "변호사 메일용": ("변호사", "감정 빼고 핵심 중심", "메일"),
            "심사위원 설득용": ("심사위원", "전문적이고 쉽게", "표+Word"),
        }
        if value in target_values:
            self.target.set(value)
        elif value in tone_values:
            self.tone.set(tone_values[value])
        elif value in preset_values:
            target, tone, output_type = preset_values[value]
            self.target.set(target)
            self.tone.set(tone)
            self.output_type.set(output_type)
        if hasattr(self, "status_label"):
            self.status_label.config(text=f"빠른 선택 적용: {value}")

    def on_generator_mousewheel(self, event) -> None:
        if hasattr(self, "generator_canvas"):
            self.generator_canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")

    def create_result_tree(self, parent: ttk.Frame) -> ttk.Treeview:
        tree = ttk.Treeview(parent, columns=("selected", "score", "modified", "reason", "path"), show="headings", selectmode="extended")
        for key, text, width in (
            ("selected", "선택", 42),
            ("score", "점수", 48),
            ("modified", "수정일", 92),
            ("reason", "근거", 230),
            ("path", "파일", 420),
        ):
            tree.heading(key, text=text)
            tree.column(key, width=width, anchor="center" if key in {"selected", "score", "modified"} else "w")
        return tree

    def refresh_generator_fields(self) -> None:
        for child in self.generator_fields_frame.winfo_children():
            child.destroy()
        self.field_vars = {}
        self.generator_check_vars = {}

        field_box = ttk.LabelFrame(self.generator_fields_frame, text="기본 입력", padding=5)
        field_box.pack(fill="x", pady=(0, 6))
        for index, field in enumerate(GENERATORS[self.generator.get()]["fields"]):
            var = StringVar()
            self.field_vars[field] = var
            row = index // 4
            col = index % 4
            cell = ttk.Frame(field_box)
            cell.grid(row=row, column=col, sticky="ew", padx=2, pady=2)
            ttk.Label(cell, text=field).pack(anchor="w")
            ttk.Entry(cell, textvariable=var).pack(fill="x")
            field_box.columnconfigure(col, weight=1)

        check_box = ttk.LabelFrame(self.generator_fields_frame, text="전용 체크", padding=5)
        check_box.pack(fill="both", expand=True)
        self.generator_check_vars = {label: BooleanVar(value=True) for label in GENERATORS[self.generator.get()]["checks"]}
        self.checkbox_grid(check_box, self.generator_check_vars, columns=4)

    def add_tag_row(self, major: str, middle: str, minor: str, checked: bool = True) -> None:
        row_index = len(self.tag_rows)
        checked_var = BooleanVar(value=checked)
        major_var = StringVar(value=major)
        middle_var = StringVar(value=middle)
        minor_var = StringVar(value=minor)
        self.tag_rows.append((checked_var, major_var, middle_var, minor_var))

        if row_index == 0:
            for col, text in enumerate(("✓", "대분류", "중분류", "소분류")):
                ttk.Label(self.tag_table, text=text).grid(row=0, column=col, sticky="ew", padx=2, pady=2)
        grid_row = row_index + 1
        ttk.Checkbutton(self.tag_table, variable=checked_var).grid(row=grid_row, column=0, padx=2, pady=2)
        ttk.Entry(self.tag_table, textvariable=major_var, width=12).grid(row=grid_row, column=1, sticky="ew", padx=2, pady=2)
        ttk.Entry(self.tag_table, textvariable=middle_var, width=14).grid(row=grid_row, column=2, sticky="ew", padx=2, pady=2)
        ttk.Entry(self.tag_table, textvariable=minor_var, width=28).grid(row=grid_row, column=3, sticky="ew", padx=2, pady=2)
        for col in (1, 2, 3):
            self.tag_table.columnconfigure(col, weight=1)

    def add_blank_tag_row(self) -> None:
        self.add_tag_row("새 대분류", "새 중분류", "새 소분류")

    def pick_source(self) -> None:
        directory = filedialog.askdirectory(title="원본 폴더 선택")
        if directory:
            self.source_dir.set(directory)

    def pick_output(self) -> None:
        directory = filedialog.askdirectory(title="결과 저장 폴더 선택")
        if directory:
            self.output_dir.set(directory)

    def pick_reference_files(self) -> None:
        paths = filedialog.askopenfilenames(
            title="참고 파일 선택",
            filetypes=[
                ("지원 문서", "*.docx *.pdf *.xlsx *.pptx *.hwp *.txt *.md *.csv"),
                ("All files", "*.*"),
            ],
        )
        if paths:
            self.add_reference_paths([Path(path) for path in paths], reason="직접선택")

    def pick_reference_folder(self) -> None:
        directory = filedialog.askdirectory(title="참고 폴더 선택")
        if not directory:
            return
        root = Path(directory)
        paths = [
            path
            for path in root.rglob("*")
            if path.is_file() and path.suffix.lower().lstrip(".") in SUPPORTED_EXTENSIONS
        ][:MAX_DIRECT_FOLDER_FILES]
        self.add_reference_paths(paths, reason=f"폴더선택:{root.name}")

    def add_reference_paths(self, paths: list[Path], reason: str) -> None:
        existing = {item.path.resolve() for item in self.results if item.path.exists()}
        added = 0
        for path in paths:
            if not path.exists() or not path.is_file():
                continue
            if path.suffix.lower().lstrip(".") not in SUPPORTED_EXTENSIONS:
                continue
            resolved = path.resolve()
            if resolved in existing:
                continue
            body, note = read_text_preview(path)
            preview = body[:3000].strip() if body else f"{note}\n{path.name}"
            self.results.append(
                SearchResult(
                    path=path,
                    score=100,
                    modified=datetime.fromtimestamp(path.stat().st_mtime),
                    reason=reason,
                    preview=preview,
                )
            )
            existing.add(resolved)
            added += 1
        self.results.sort(key=lambda item: (item.score, item.modified), reverse=True)
        self.populate_results()
        self.status_label.config(text=f"참고 파일 추가: {added}개 / 전체 {len(self.results)}개")
        if added:
            self.select_all_results()

    def start_search(self) -> None:
        source = Path(self.source_dir.get().strip())
        if not source.exists() or not source.is_dir():
            messagebox.showerror("오류", "검색할 원본 폴더를 선택하세요.")
            return
        self.clear_results()
        self.status_label.config(text="검색 중...")
        thread = threading.Thread(target=self.search_worker, args=(source,), daemon=True)
        thread.start()

    def search_worker(self, source: Path) -> None:
        required = split_keywords(self.include_keywords.get())
        boost = split_keywords(self.boost_keywords.get())
        hold = split_keywords(self.hold_keywords.get())
        exclude = split_keywords(self.exclude_keywords.get())
        selected_exts = extension_group(self.file_group.get())
        iterator = source.rglob("*") if self.include_subfolders.get() else source.glob("*")
        results: list[SearchResult] = []
        try:
            for path in iterator:
                if not path.is_file() or path.suffix.lower().lstrip(".") not in selected_exts:
                    continue
                if not period_matches(path, self.period.get()):
                    continue
                name_lower = path.name.lower()
                if any(keyword.lower() in name_lower for keyword in exclude):
                    continue

                body = ""
                note = "파일명"
                if self.search_body.get():
                    body, note = read_text_preview(path)
                    if any(keyword.lower() in body.lower() for keyword in exclude):
                        continue

                haystack = f"{path.name}\n{body}".lower() if self.search_filename.get() else body.lower()
                if required and not all(keyword.lower() in haystack for keyword in required):
                    continue

                score, reason = score_file(path, body, required, boost, hold, self.version.get())
                if required and score <= 0:
                    continue
                results.append(
                    SearchResult(
                        path=path,
                        score=score,
                        modified=datetime.fromtimestamp(path.stat().st_mtime),
                        reason=reason,
                        preview=body[:1500].strip() if body else f"{note}\n{path.name}",
                    )
                )
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
            self.populate_results()
            self.status_label.config(text=f"검색 완료: {len(self.results)}개")
        else:
            self.status_label.config(text="검색 실패")
            messagebox.showerror("검색 실패", str(payload))
        self.root.after(150, self.consume_queue)

    def clear_results(self) -> None:
        self.results = []
        for tree in (getattr(self, "result_tree", None), getattr(self, "footer_tree", None)):
            if tree:
                tree.delete(*tree.get_children())

    def populate_results(self) -> None:
        for tree in (self.result_tree, self.footer_tree):
            tree.delete(*tree.get_children())
            for index, item in enumerate(self.results):
                tree.insert("", END, iid=f"{id(tree)}-{index}", values=("✓", item.score, item.modified.strftime("%Y-%m-%d"), item.reason, str(item.path)))

    def select_all_results(self) -> None:
        for tree in (self.result_tree, self.footer_tree):
            tree.selection_set(tree.get_children())

    def selected_results(self) -> list[SearchResult]:
        selected_by_path: dict[Path, SearchResult] = {}
        for tree in (self.result_tree, self.footer_tree):
            for iid in tree.selection():
                try:
                    item = self.results[int(iid.split("-")[-1])]
                except (ValueError, IndexError):
                    continue
                selected_by_path[item.path.resolve()] = item
        return list(selected_by_path.values())

    def preview_selected_file(self) -> None:
        selected = self.selected_results()
        if not selected:
            return
        item = selected[0]
        self.preview_output.delete("1.0", END)
        self.preview_output.insert("1.0", f"{item.path}\n점수: {item.score}\n근거: {item.reason}\n\n{item.preview}")

    def copy_selected_files(self) -> None:
        selected = self.selected_results()
        if not selected:
            selected = self.results[:10]
        if not selected:
            messagebox.showwarning("선택 필요", "복사할 파일을 선택하세요.")
            return
        output_dir = Path(self.output_dir.get().strip())
        output_dir.mkdir(parents=True, exist_ok=True)
        for item in selected:
            target = output_dir / item.path.name
            if target.exists():
                target = output_dir / f"{item.path.stem}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{item.path.suffix}"
            shutil.copy2(item.path, target)
        messagebox.showinfo("복사 완료", f"{len(selected)}개 파일을 복사했습니다.\n{output_dir}")

    def selected_tags(self) -> list[str]:
        tags = []
        for checked, major, middle, minor in self.tag_rows:
            if checked.get():
                tags.append(f"{major.get()} > {middle.get()} > {minor.get()}")
        return tags

    def generate_prompt(self) -> None:
        selected = self.selected_results()
        if not selected:
            selected = self.results[:5]
        file_lines = [f"- {item.path.name} | 점수 {item.score} | {item.path}" for item in selected] or ["- 선택한 파일 없음. 입력 조건과 메모만 기준으로 작성"]
        content_lines: list[str] = []
        for index, item in enumerate(selected[:MAX_PROMPT_CONTENT_FILES], start=1):
            content = item.preview.strip()
            if not content:
                content, _note = read_text_preview(item.path)
                content = content.strip()
            if not content:
                content = "본문을 읽지 못했습니다. 파일명과 경로만 참고하세요."
            if len(content) > MAX_PROMPT_CONTENT_CHARS:
                content = content[:MAX_PROMPT_CONTENT_CHARS].rstrip() + "\n... 이하 생략"
            content_lines.extend(
                [
                    f"--- 참고 파일 {index}: {item.path.name} ---",
                    f"경로: {item.path}",
                    content,
                    "",
                ]
            )
        field_lines = [f"- {label}: {var.get().strip()}" for label, var in self.field_vars.items() if var.get().strip()]
        option_lines = [f"- {label}" for label, var in self.option_vars.items() if var.get()]
        generator_lines = [f"- {label}" for label, var in self.generator_check_vars.items() if var.get()]
        rule_lines = [f"- {label}" for label, var in self.fixed_rule_vars.items() if var.get()]
        tag_lines = [f"- {tag}" for tag in self.selected_tags()]
        memo = self.memo_text.get("1.0", END).strip()
        file_memo = self.file_memo.get("1.0", END).strip() if hasattr(self, "file_memo") else ""
        greeting = self.greeting_text.get("1.0", END).strip()
        closing = self.closing_text.get("1.0", END).strip()

        prompt = [
            GENERATORS[self.generator.get()]["first"],
            "",
            f"아래 조건을 기준으로 '{self.stage.get()}' 프롬프트를 작성해줘.",
            "입력하지 않은 항목은 생략하고, 중복되는 내용은 정리해줘.",
            "",
            "[참고 파일]",
            *file_lines,
            "",
            "[참고 파일 내용]",
            *(content_lines or ["- 참고 파일 내용 없음", ""]),
            "[작업 목적]",
            f"- 생성기: {self.generator.get()}",
            f"- 단계: {self.stage.get()}",
            f"- 대상: {self.target.get()}",
            f"- 말투: {self.tone.get()}",
            f"- 결과물: {self.output_type.get()}",
            "",
        ]
        if tag_lines:
            prompt.extend(["[저장/정리 분류 태그]", *tag_lines, ""])
        if field_lines:
            prompt.extend(["[업무별 세부 입력]", *field_lines, ""])
        if generator_lines:
            prompt.extend(["[생성기 전용 반영]", *generator_lines, ""])
        if option_lines:
            prompt.extend(["[공통 정리 옵션]", *option_lines, ""])
        if rule_lines:
            prompt.extend(["[회사 고정 규정]", *rule_lines, ""])
        if greeting:
            prompt.extend(["[인삿말]", greeting, ""])
        if memo:
            prompt.extend(["[내 멘션 / 두서없는 메모]", memo, ""])
        if file_memo:
            prompt.extend(["[파일 결과 메모]", file_memo, ""])
        if closing:
            prompt.extend(["[마무리 문구]", closing, ""])
        prompt.extend(
            [
                "[출력 요청]",
                "- 먼저 빠진 정보가 있으면 질문 목록으로 정리해줘.",
                "- 그다음 바로 사용할 수 있는 업무용 문장으로 정리해줘.",
                "- 고정/준고정/선택 항목이 섞여 있으면 구분해서 표시해줘.",
                "- 마지막에는 표로 요약하고 Word 문서 제목 구조를 포함해줘.",
            ]
        )

        text = "\n".join(prompt)
        self.preview_output.delete("1.0", END)
        self.preview_output.insert("1.0", text)
        self.notebook.select(self.work_tab)

    def clean_memo(self) -> None:
        memo = self.memo_text.get("1.0", END).strip()
        cleaned = "\n".join(f"- {line.strip()}" for line in memo.splitlines() if line.strip())
        self.memo_text.delete("1.0", END)
        self.memo_text.insert("1.0", cleaned)

    def copy_prompt(self) -> None:
        text = self.preview_output.get("1.0", END).strip()
        if not text:
            self.generate_prompt()
            text = self.preview_output.get("1.0", END).strip()
        self.root.clipboard_clear()
        self.root.clipboard_append(text)
        self.status_label.config(text="프롬프트 복사 완료")

    def save_prompt(self) -> None:
        text = self.preview_output.get("1.0", END).strip()
        if not text:
            self.generate_prompt()
            text = self.preview_output.get("1.0", END).strip()
        output_dir = Path(self.output_dir.get().strip())
        output_dir.mkdir(parents=True, exist_ok=True)
        initial = f"prompt_v2_{self.generator.get()}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        path = filedialog.asksaveasfilename(
            title="프롬프트 저장",
            initialdir=str(output_dir),
            initialfile=initial,
            defaultextension=".md",
            filetypes=[("Markdown", "*.md"), ("Text", "*.txt"), ("All files", "*.*")],
        )
        if path:
            Path(path).write_text(text, encoding="utf-8")
            messagebox.showinfo("저장 완료", f"저장했습니다.\n{path}")

    def save_settings_snapshot(self) -> None:
        output_dir = Path(self.output_dir.get().strip())
        output_dir.mkdir(parents=True, exist_ok=True)
        path = output_dir / f"settings_v2_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        lines = [
            f"생성기={self.generator.get()}",
            f"단계={self.stage.get()}",
            f"대상={self.target.get()}",
            f"결과={self.output_type.get()}",
            "규정=" + ", ".join(label for label, var in self.fixed_rule_vars.items() if var.get()),
            "태그=" + " / ".join(self.selected_tags()),
        ]
        path.write_text("\n".join(lines), encoding="utf-8")
        messagebox.showinfo("설정 저장", f"저장했습니다.\n{path}")

    def show_generator_modal(self) -> None:
        modal = Toplevel(self.root)
        modal.title("생성기별 전용 설정 크게보기")
        modal.geometry("760x460")
        body = ttk.Frame(modal, padding=10)
        body.pack(fill="both", expand=True)
        for name, data in GENERATORS.items():
            box = ttk.LabelFrame(body, text=name, padding=6)
            box.pack(fill="x", pady=4)
            ttk.Label(box, text=", ".join(data["checks"]), wraplength=700).pack(anchor="w")

    def show_file_help(self) -> None:
        messagebox.showinfo(
            "대/중/소 분류 안내",
            "대/중/소는 파일 찾기 조건이 아니라 파일을 찾은 뒤 저장하거나 정리할 때 붙이는 분류 태그입니다.\n\n"
            "대분류: 정부사업, 자격증, 법무\n"
            "중분류: 사업계획서, 운영규정, 증빙자료\n"
            "소분류: 시장조사, 반려, 손해액",
        )

    def bind_shortcuts(self) -> None:
        self.root.bind("<Control-f>", lambda _event: self.start_search())
        self.root.bind("<Control-g>", lambda _event: self.generate_prompt())
        self.root.bind("<Control-s>", lambda _event: self.save_prompt())
        names = list(GENERATORS.keys())
        for index, name in enumerate(names, start=1):
            self.root.bind(f"<Control-Key-{index}>", lambda _event, value=name: self.set_generator(value))

    def set_generator(self, value: str) -> None:
        self.generator.set(value)
        self.refresh_generator_fields()


def main() -> None:
    root = Tk()
    V2App(root)
    root.mainloop()


if __name__ == "__main__":
    main()
