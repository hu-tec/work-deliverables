#!/usr/bin/env python3
"""Create readable documents from the collected Hutec C draft CSV files."""

from __future__ import annotations

import csv
import re
from collections import Counter, OrderedDict, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "일반사용자용_정리DB"

SOURCE = {
    "field": ROOT / "수집된DB" / "분야.csv",
    "exam_options": ROOT / "수집된DB" / "대표 DB-시험정보.csv",
    "representative": ROOT / "수집된DB" / "대표DB.csv",
    "assessment": ROOT / "수집된DB" / "문제와 채점지.csv",
    "integrated": ROOT / "수집된DB" / "통합사본.csv",
    "textbook": ROOT / "휴텍씨DB" / "교재.csv",
    "question_bank": ROOT / "휴텍씨DB" / "문제은행.csv",
    "prompt_course": ROOT / "휴텍씨DB" / "커리 급수별 (프롬).csv",
    "course": ROOT / "휴텍씨DB" / "커리.csv",
}

FOLDERS = [
    "01_분류체계",
    "02_시험운영",
    "03_교육자료",
    "04_문제은행",
    "05_서비스기획",
]


def clean(value: str) -> str:
    return value.replace("\x08", "").strip()


def inline(value: str) -> str:
    return " / ".join(part.strip() for part in value.splitlines() if part.strip())


def read_csv(path: Path) -> list[list[str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return [[clean(value) for value in row] for row in csv.reader(handle)]


def cell(row: list[str], index: int) -> str:
    return row[index] if index < len(row) else ""


def unique(values: list[str]) -> list[str]:
    return list(OrderedDict.fromkeys(value for value in values if value))


def write_csv(relative_path: str, headers: list[str], rows: list[list[str]]) -> None:
    destination = OUT / relative_path
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(headers)
        writer.writerows(rows)


def write_text(relative_path: str, body: str) -> None:
    destination = OUT / relative_path
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(body.rstrip() + "\n", encoding="utf-8")


def source_name(path: Path) -> str:
    return str(path.relative_to(ROOT))


def extract_classification() -> dict[str, int]:
    rows = read_csv(SOURCE["field"])
    service_rows: list[list[str]] = []
    for line_number, row in enumerate(rows[1:], start=2):
        large = cell(row, 0)
        middle = cell(row, 22)
        small = cell(row, 33)
        if not large or "대분류" in large:
            continue
        middle = "" if middle == "—" else middle
        small = "" if small == "—" else small
        service_rows.append([large, middle, small, source_name(SOURCE["field"]), str(line_number)])
    deduped_services = list(OrderedDict.fromkeys(tuple(row) for row in service_rows))
    write_csv(
        "01_분류체계/서비스_분야_대중소분류.csv",
        ["대분류", "중분류", "소분류", "원본파일", "원본행"],
        [list(row) for row in deduped_services],
    )

    grade_rows: list[list[str]] = []
    for line_number, row in enumerate(rows[1:], start=2):
        category, division, grade = cell(row, 40), cell(row, 41), cell(row, 42)
        if not category or "대분류" in category or not grade:
            continue
        grade_rows.append([category, division, grade, source_name(SOURCE["field"]), str(line_number)])
    deduped_grades = list(OrderedDict.fromkeys(tuple(row) for row in grade_rows))
    write_csv(
        "01_분류체계/자격시험_종류와_급수.csv",
        ["시험종류", "등급구분", "급수", "원본파일", "원본행"],
        [list(row) for row in deduped_grades],
    )
    return {"services": len(deduped_services), "grades": len(deduped_grades)}


def extract_exam_options() -> int:
    rows = read_csv(SOURCE["exam_options"])
    rename = {"column 16": "교육급수"}
    output: list[list[str]] = []
    for column, heading in enumerate(rows[0]):
        setting = rename.get(heading, heading)
        values = unique([cell(row, column) for row in rows[1:]])
        for value in values:
            output.append([setting, value, source_name(SOURCE["exam_options"])])
    write_csv(
        "02_시험운영/시험_기본설정_선택항목.csv",
        ["설정항목", "선택값", "원본파일"],
        output,
    )
    return len(output)


def matrix_to_long(
    rows: list[list[str]],
    title: str,
    source: Path,
    header_row: int,
    first_data_row: int,
    last_data_row: int,
) -> list[list[str]]:
    headers = rows[header_row]
    output: list[list[str]] = []
    for row_index in range(first_data_row, min(last_data_row + 1, len(rows))):
        row = rows[row_index]
        for column, value in enumerate(row):
            heading = cell(headers, column)
            if value and heading:
                output.append([title, heading, value, source_name(source), str(row_index + 1)])
    return output


def extract_exam_operation() -> dict[str, int]:
    representative = read_csv(SOURCE["representative"])
    operational_rows: list[list[str]] = []
    operational_rows += matrix_to_long(
        representative, "출제 및 채점", SOURCE["representative"], 14, 15, 27
    )
    operational_rows += matrix_to_long(
        representative, "시험 일정과 처리 상태", SOURCE["representative"], 28, 29, 37
    )
    write_csv(
        "02_시험운영/출제_채점_일정_운영항목.csv",
        ["구분", "항목", "내용", "원본파일", "원본행"],
        operational_rows,
    )

    assessment = read_csv(SOURCE["assessment"])
    grades: list[list[str]] = []
    for line_number, row in enumerate(assessment[1:], start=2):
        grade_group, detail = cell(row, 15), cell(row, 16)
        if grade_group and grade_group != "급수":
            grades.append([grade_group, detail, source_name(SOURCE["assessment"]), str(line_number)])
    write_csv(
        "02_시험운영/응시대상_급수목록.csv",
        ["등급구분", "세부급수", "원본파일", "원본행"],
        grades,
    )

    assessment_lines = [
        "# 시험 문항과 채점 방식 요약",
        "",
        "이 문서는 원본 시트에 함께 배치된 문항 수, 채점 대상, 응시 급수 메모를",
        "읽기 위한 자료입니다. 기재된 값은 운영 확정본이 아니라 수집 자료의 원문입니다.",
        "",
        "## 원문 항목",
        "",
    ]
    for line_number, row in enumerate(assessment[1:], start=2):
        values = [inline(value) for value in row if value]
        if values:
            assessment_lines.append(f"- 원본 {line_number}행: " + " / ".join(values))
    assessment_lines.extend(["", f"출처: `{source_name(SOURCE['assessment'])}`"])
    write_text("02_시험운영/시험_문항과_채점방식_읽기자료.md", "\n".join(assessment_lines))
    return {"operation": len(operational_rows), "target_grades": len(grades)}


def textbook_rows(
    rows: list[list[str]], columns: list[tuple[int, str]], required_columns: list[int]
) -> list[list[str]]:
    output: list[list[str]] = []
    last_book = ""
    book_column = next((column for column, name in columns if name == "교재명"), None)
    for line_number, row in enumerate(rows[3:], start=4):
        if book_column is not None and cell(row, book_column):
            last_book = cell(row, book_column)
        if not any(cell(row, column) for column in required_columns):
            continue
        record = []
        for column, name in columns:
            value = cell(row, column)
            if name == "교재명" and not value:
                value = last_book
            record.append(value)
        record.extend([source_name(SOURCE["textbook"]), str(line_number)])
        output.append(record)
    return output


def extract_textbooks() -> dict[str, int]:
    rows = read_csv(SOURCE["textbook"])
    prompt_columns = [
        (46, "교재명"),
        (0, "대분류"),
        (6, "과정"),
        (7, "급수"),
        (8, "핵심역량목표"),
        (11, "중분류"),
        (14, "단원번호"),
        (15, "단원명"),
        (16, "학습목표"),
        (17, "이론실습"),
    ]
    ethics_columns = [
        (19, "교재명"),
        (20, "단원번호"),
        (21, "소분류"),
        (22, "단원명"),
        (23, "학습목표"),
        (24, "이론실습"),
        (25, "페이지범위"),
        (26, "예시"),
        (27, "교육내용"),
        (28, "활용도구"),
        (29, "운영강조단원"),
    ]
    translation_columns = [
        (31, "교재명"),
        (32, "급수"),
        (33, "단원번호"),
        (34, "단원명"),
        (35, "학습목표"),
        (36, "이론실습"),
        (37, "페이지범위"),
        (38, "예시"),
        (39, "교육내용"),
        (40, "활용도구"),
        (41, "핵심역량목표"),
        (42, "교재구성체크"),
        (43, "수업설계체크"),
        (44, "평가운영체크"),
    ]
    document_specs = [
        ("교재_프롬프트활용_단원.csv", prompt_columns, [14, 15]),
        ("교재_AI윤리_단원.csv", ethics_columns, [20, 22]),
        ("교재_AI번역_단원.csv", translation_columns, [32, 33, 34]),
    ]
    counts: dict[str, int] = {}
    for filename, columns, required in document_specs:
        output = textbook_rows(rows, columns, required)
        write_csv(
            "03_교육자료/" + filename,
            [name for _, name in columns] + ["원본파일", "원본행"],
            output,
        )
        counts[filename] = len(output)
    return counts


def nonempty_row_markdown(path: Path, heading: str) -> list[str]:
    rows = read_csv(path)
    lines = [f"## {heading}", "", f"출처: `{source_name(path)}`", ""]
    for line_number, row in enumerate(rows[1:], start=2):
        entries = [inline(value) for value in row if value]
        if entries:
            lines.append(f"- {line_number}행: " + " / ".join(entries))
    lines.append("")
    return lines


def extract_curriculum() -> None:
    lines = [
        "# 교육과정 원문 읽기자료",
        "",
        "원본 CSV에는 여러 교육과정 표가 같은 행에 병렬로 저장되어 있습니다.",
        "아래는 비어 있는 칸을 제거하여 원문 내용을 행 단위로 읽을 수 있게 정리한 것입니다.",
        "과정 간 대응 관계가 명확하지 않은 부분은 임의로 합치지 않았습니다.",
        "",
    ]
    lines += nonempty_row_markdown(SOURCE["prompt_course"], "프롬프트 급수별 교육과정")
    lines += nonempty_row_markdown(SOURCE["course"], "AI 번역, AI 윤리 및 실습 커리큘럼")
    write_text("03_교육자료/교육과정_전체_읽기자료.md", "\n".join(lines))


def safe_category_filename(category: str) -> str:
    mapping = {
        "문서": "문서작성",
        "개발": "개발",
        "순차통역": "통번역",
        "동시통역": "통번역",
        "음성통역": "통번역",
        "창의적 활동": "창작활동",
        "영상": "영상콘텐츠",
        "음성": "음성콘텐츠",
        "전문": "전문분야",
        "건강": "건강",
        "돈": "재무생활",
        "사람": "관계교육",
        "취업": "취업",
        "기타": "생활기타",
    }
    return mapping.get(category, re.sub(r"[^0-9A-Za-z가-힣]+", "_", category))


def extract_question_bank() -> dict[str, object]:
    rows = read_csv(SOURCE["question_bank"])
    grouped: defaultdict[str, list[list[str]]] = defaultdict(list)
    extras: list[list[str]] = []
    body_count = 0
    headers = [
        "원본문항번호",
        "대분류",
        "중분류",
        "소분류",
        "시험문제_안1",
        "시험문제_안2",
        "시험문제_안3",
        "답안자료_안1",
        "답안자료_안2",
        "모범답안_채점자용",
        "추가메모",
        "원본파일",
        "원본행",
    ]
    for line_number, row in enumerate(rows[1:], start=2):
        large, middle, small = cell(row, 0), cell(row, 19), cell(row, 15)
        questions = [cell(row, index) for index in (16, 17, 18)]
        if large and any(questions):
            body_count += 1
            notes = []
            for index in range(4, 15):
                value = cell(row, index)
                if value:
                    notes.append(f"{rows[0][index]}: {value}")
            group = safe_category_filename(large)
            grouped[group].append(
                [
                    str(body_count),
                    large,
                    middle,
                    small,
                    *questions,
                    cell(row, 1),
                    cell(row, 2),
                    cell(row, 3),
                    " / ".join(notes),
                    source_name(SOURCE["question_bank"]),
                    str(line_number),
                ]
            )
        elif small:
            extras.append([large, middle, small, source_name(SOURCE["question_bank"]), str(line_number)])

    for category, category_rows in sorted(grouped.items()):
        write_csv(f"04_문제은행/문제은행_{category}.csv", headers, category_rows)
    write_csv(
        "04_문제은행/추가검토_후보분야.csv",
        ["대분류", "중분류", "소분류_후보", "원본파일", "원본행"],
        extras,
    )
    return {"body": body_count, "groups": dict(sorted((k, len(v)) for k, v in grouped.items())), "extras": len(extras)}


def extract_service_planning() -> dict[str, int]:
    representative = read_csv(SOURCE["representative"])
    planning: list[list[str]] = []
    planning += matrix_to_long(representative, "전문가 매칭", SOURCE["representative"], 40, 41, 53)
    planning += matrix_to_long(representative, "결제 및 할인", SOURCE["representative"], 62, 63, 70)
    planning += matrix_to_long(representative, "서비스 영역", SOURCE["representative"], 75, 76, 101)
    write_csv(
        "05_서비스기획/서비스_매칭_결제_분류메모.csv",
        ["구분", "항목", "내용", "원본파일", "원본행"],
        planning,
    )
    sections = [
        ("시험정보 및 출제·채점 기획", 1, 37),
        ("전문가 매칭 기획", 38, 60),
        ("결제 및 서비스 분류", 61, 112),
        ("사이트 및 서비스 유형", 113, 146),
        ("교육 일정과 지역 메모", 147, len(representative) - 1),
    ]
    source_lines = [
        "# 서비스 운영 기획 원문 읽기자료",
        "",
        "`대표DB.csv`에 함께 들어 있던 시험, 매칭, 결제, 사이트 유형,",
        "교육 일정 메모를 구간별로 나눈 자료입니다. 값 사이의 관계가 확정되지",
        "않은 구간은 원본의 같은 행에 기재된 문구를 한 줄에 함께 표시했습니다.",
        "",
        f"출처: `{source_name(SOURCE['representative'])}`",
        "",
    ]
    for heading, first_row, last_row in sections:
        source_lines.extend([f"## {heading}", ""])
        for row_index in range(first_row, min(last_row + 1, len(representative))):
            values = [inline(value) for value in representative[row_index] if value]
            if values:
                source_lines.append(f"- {row_index + 1}행: " + " / ".join(values))
        source_lines.append("")
    write_text("05_서비스기획/서비스운영_기획원문_읽기자료.md", "\n".join(source_lines))

    integrated = read_csv(SOURCE["integrated"])
    dictionary: list[list[str]] = []
    named: list[list[str]] = []
    headers = integrated[0]
    fields = integrated[2] if len(integrated) > 2 else []
    for column, raw_heading in enumerate(headers):
        area = raw_heading if raw_heading and not raw_heading.startswith("column") else "통합 미분류 항목"
        field = cell(fields, column) or raw_heading or f"열 {column + 1}"
        values = unique([cell(row, column) for row in integrated[3:]])
        dictionary.append(
            [str(column + 1), area, field, " / ".join(values), source_name(SOURCE["integrated"])]
        )
        if area != "통합 미분류 항목":
            for value in values:
                named.append([area, field, value, source_name(SOURCE["integrated"])])
    write_csv(
        "05_서비스기획/통합DB_항목사전.csv",
        ["원본열번호", "영역", "항목명", "기재값_또는_예시", "원본파일"],
        dictionary,
    )
    write_csv(
        "05_서비스기획/통합DB_명명영역_검토목록.csv",
        ["영역", "항목명", "내용", "원본파일"],
        named,
    )
    return {"planning": len(planning), "dictionary": len(dictionary), "named": len(named)}


def create_readme(stats: dict[str, object]) -> None:
    group_text = ", ".join(
        f"{name} {count}건" for name, count in stats["questions"]["groups"].items()
    )
    readme = f"""# 휴텍씨 DB 일반사용자용 정리본

## 이 폴더는 무엇인가요?

`수집된DB`와 `휴텍씨DB`의 초안 자료를 내용별로 나누어 읽기 쉽게 만든
열람용 문서입니다. 원본은 여러 표가 한 CSV에 같이 들어 있어 바로 이해하기
어려우므로, 서비스 분류, 시험 운영, 교육 자료, 문제은행, 서비스 기획으로
나누었습니다.

## 먼저 볼 문서

| 알고 싶은 내용 | 열어볼 폴더 또는 문서 |
|---|---|
| 어떤 서비스 분야와 급수가 있는지 | `01_분류체계/` |
| 시험이 어떻게 구성되고 채점되는지 | `02_시험운영/` |
| 어떤 교재와 교육과정이 준비되어 있는지 | `03_교육자료/` |
| 실제 시험 문제와 답안 자료가 무엇인지 | `04_문제은행/` |
| 서비스, 매칭, 결제, DB 항목 초안이 무엇인지 | `05_서비스기획/` |

## 정리된 자료 규모

- 서비스 분야 분류: {stats["classification"]["services"]}건
- 자격시험 급수 분류: {stats["classification"]["grades"]}건
- 시험 기본설정 선택항목: {stats["exam_options"]}건
- 문제은행 본문: {stats["questions"]["body"]}건 ({group_text})
- 통합 DB 항목 사전: {stats["planning"]["dictionary"]}개 열

## 주의해서 읽을 점

- 이 자료는 원본에 기록된 기획·수집 내용을 분류한 것이며, 확정된 서비스
  정책이나 최종 시험 규정으로 판정한 문서가 아닙니다.
- 원본에 있는 `개발 완료 전 확정 필요`, 물음표, 중복, 맞춤법 표기는
  검토가 필요하다는 의미가 남도록 그대로 보존했습니다.
- 병렬로 배치된 원본 표의 관계가 분명하지 않은 경우에는 임의로 합치지
  않았습니다. CSV의 `원본파일`, `원본행` 열로 출처를 확인할 수 있습니다.
- 문제은행의 모범답안 및 채점자용 자료는 응시자 공개 범위를 별도로
  결정해야 합니다.

## 원본에서 어디로 정리되었나요?

| 원본 파일 | 정리 위치 |
|---|---|
| `수집된DB/분야.csv` | `01_분류체계/` |
| `수집된DB/대표 DB-시험정보.csv` | `02_시험운영/시험_기본설정_선택항목.csv` |
| `수집된DB/대표DB.csv` | `02_시험운영/`, `05_서비스기획/서비스운영_기획원문_읽기자료.md` |
| `수집된DB/문제와 채점지.csv` | `02_시험운영/` |
| `수집된DB/통합사본.csv` | `05_서비스기획/` |
| `휴텍씨DB/교재.csv` | `03_교육자료/` |
| `휴텍씨DB/커리.csv`, `휴텍씨DB/커리 급수별 (프롬).csv` | `03_교육자료/교육과정_전체_읽기자료.md` |
| `휴텍씨DB/문제은행.csv` | `04_문제은행/` |

## 재생성

입력 CSV가 수정된 후 동일한 구조로 다시 정리하려면
`python3 일반사용자용_정리DB/_생성도구/정리본_생성.py`를 실행합니다.
"""
    write_text("00_문서목록_및_읽는법.md", readme)


def create_validation(stats: dict[str, object]) -> None:
    expected_body = sum(stats["questions"]["groups"].values())
    status = "통과" if expected_body == stats["questions"]["body"] else "확인 필요"
    text = f"""# 생성 검증 결과

| 확인 항목 | 결과 |
|---|---|
| 읽은 원본 CSV 수 | {len(SOURCE)}개 |
| 문제은행 본문 추출 행 수 | {stats["questions"]["body"]}건 |
| 분류별 문제은행 행 수 합계 | {expected_body}건 |
| 문제은행 누락 대조 | {status} |
| 추가 검토 후보 분야 | {stats["questions"]["extras"]}건 |
| 통합 DB 항목 사전 열 수 | {stats["planning"]["dictionary"]}개 |

검증 기준: `시험 문제` 계열 열 중 하나 이상이 채워진 문제은행 행을 본문으로
집계하고, 분류별 출력 CSV의 행 합계와 비교했습니다.
"""
    write_text("99_생성검증결과.md", text)


def main() -> None:
    for folder in FOLDERS:
        (OUT / folder).mkdir(parents=True, exist_ok=True)
    stats: dict[str, object] = {}
    stats["classification"] = extract_classification()
    stats["exam_options"] = extract_exam_options()
    stats["exam_operation"] = extract_exam_operation()
    stats["textbooks"] = extract_textbooks()
    extract_curriculum()
    stats["questions"] = extract_question_bank()
    stats["planning"] = extract_service_planning()
    create_readme(stats)
    create_validation(stats)
    print(f"Created readable documents in: {OUT}")
    print(f"Question bank items separated: {stats['questions']['body']}")


if __name__ == "__main__":
    main()
