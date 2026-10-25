"""Import the reviewed Sinbom deliverables and register browsable documents."""

import json
import shutil
import zipfile
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"C:\Users\itban\Desktop\까마귀\신봄\신봄_업무(3.02GB)")
DEST = ROOT / "추가_산출물"
INDEX = ROOT / "index.html"

GROUPS = [
    ("예전작업/시험홈페이지_통합_구현", "시험홈페이지_통합_구현", "내부 업무도구/자동화"),
    ("파일추출_업무프롬프트_생성기", "파일추출_업무프롬프트_생성기", "내부 업무도구/자동화"),
    ("vibe_기획", "서비스_기획", "기획·전략 자료"),
    ("hutechc_design_resource_vs_figma_design", "디자인리소스_Figma_비교", "기획·전략 자료"),
    ("랜딩페이지/시안", "랜딩_커뮤니티_시안", "사용자/랜딩·신청 화면"),
    ("design_system_major", "디자인시스템_확장시안", "디자인시스템/재사용 UI"),
    ("itt-ai-시험홈페이지-신규분석", "ITT_AI_시험홈페이지_분석", "기획·전략 자료"),
    ("예전작업/신청서 삽입 예시", "신청서_삽입_예시", "사용자/랜딩·신청 화면"),
    ("휴텍씨DB_정제", "DB_정제_설명문서", "교육·시험·콘텐츠 자료"),
]

SKIP_PARTS = {".git", ".next", ".bkit", "node_modules", "build", "dist", "__pycache__"}
SKIP_SUFFIXES = {".pyc", ".zip", ".db", ".sqlite", ".sqlite3", ".wal", ".shm"}


def include(group, relative):
    parts = relative.parts
    if any(part in SKIP_PARTS or part.startswith(".DS_Store") for part in parts):
        return False
    if relative.suffix.lower() in SKIP_SUFFIXES or relative.name in {"tsconfig.tsbuildinfo", ".DS_Store"}:
        return False
    if group == "랜딩_커뮤니티_시안" and parts[0] == "community-redesign":
        return False  # Identical to 커뮤니티_시안3종.
    if group == "DB_정제_설명문서" and relative.suffix.lower() != ".md":
        return False  # Raw source data and question banks are excluded.
    if group == "파일추출_업무프롬프트_생성기" and relative.suffix.lower() == ".exe":
        return len(parts) == 1  # Keep only the latest distributed executable.
    return True


def main():
    copied = []
    entries = {"htmlDocs": [], "mdDocs": []}
    for source_name, target_name, section in GROUPS:
        origin = SOURCE / source_name
        if not origin.is_dir():
            raise FileNotFoundError(origin)
        for file in sorted(origin.rglob("*")):
            if not file.is_file():
                continue
            relative = file.relative_to(origin)
            if not include(target_name, relative):
                continue
            target = DEST / target_name / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(file, target)
            copied.append(target)
            path = target.relative_to(ROOT).as_posix()
            if file.suffix.lower() not in {".html", ".md"}:
                continue
            item = {
                "section": section,
                "subsection": target_name,
                "title": file.stem.replace("_", " ").replace("-", " "),
                "path": path,
                "date": datetime.fromtimestamp(file.stat().st_mtime).strftime("%Y-%m-%d"),
            }
            if file.suffix.lower() == ".md":
                item["content"] = file.read_text(encoding="utf-8", errors="replace")
                entries["mdDocs"].append(item)
            else:
                entries["htmlDocs"].append(item)

    # The archived AITE variants expect shared assets beside their HTML files.
    output = DEST / "랜딩_커뮤니티_시안" / "랜딩페이지_시안_도출" / "output"
    variant = output / "aite-layout-redesign-variant-02-institution.html"
    variant.write_text(
        variant.read_text(encoding="utf-8").replace('href="../styles.css"', 'href="./styles.css"'),
        encoding="utf-8",
    )
    shutil.copy2(ROOT / "랜딩페이지" / "기초_레이아웃" / "site.js", output / "site.js")
    nested_index = DEST / "디자인시스템_확장시안" / "디자인MD" / "index.html"
    nested_index.write_text(
        nested_index.read_text(encoding="utf-8")
        .replace("./docs_rendered/", "../docs_rendered/")
        .replace("./form/", "../form/"),
        encoding="utf-8",
    )

    for folder, archive_name in [
        ("시험홈페이지_통합_구현", "시험홈페이지_통합_구현.zip"),
        ("파일추출_업무프롬프트_생성기", "파일추출_업무프롬프트_생성기_소스.zip"),
    ]:
        archive = ROOT / "downloads" / archive_name
        with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as output:
            for file in sorted((DEST / folder).rglob("*")):
                if file.is_file() and file.suffix.lower() != ".exe":
                    output.write(file, file.relative_to(DEST))

    source = INDEX.read_text(encoding="utf-8")
    prefix = "      const DATA = "
    start = source.index(prefix) + len(prefix)
    data, offset = json.JSONDecoder().raw_decode(source[start:])
    end = start + offset
    for kind in entries:
        current_paths = {item["path"] for item in data[kind]}
        data[kind].extend(item for item in entries[kind] if item["path"] not in current_paths)
    source = source[:start] + json.dumps(data, ensure_ascii=False, indent=2).replace("</", "<\\/") + source[end:]
    INDEX.write_text(source, encoding="utf-8")
    print(f"Copied {len(copied)} files; indexed {len(entries['htmlDocs'])} HTML and {len(entries['mdDocs'])} Markdown files")


if __name__ == "__main__":
    main()
