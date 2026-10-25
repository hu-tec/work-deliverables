"""Report unresolved local assets referenced by imported HTML and CSS."""

import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
IMPORTED = [
    ROOT / "01_화면_디자인" / name
    for name in ("디자인리소스_Figma_비교", "디자인시스템_확장시안", "랜딩_커뮤니티_시안", "신청서_삽입_예시")
] + [
    ROOT / "02_분석_기획" / name
    for name in ("서비스_기획", "ITT_AI_시험홈페이지_분석", "DB_원본_엑셀", "DB_정제_설명문서")
] + [
    ROOT / "03_프로젝트_도구" / name
    for name in ("시험홈페이지_통합_구현", "파일추출_업무프롬프트_생성기")
]


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        keys = ("href",) if tag == "link" and "stylesheet" in values.get("rel", "") else ()
        if tag in {"script", "img", "iframe", "source", "video"}:
            keys += ("src", "poster")
        for key in keys:
            if values.get(key):
                self.urls.append(values[key])


def local_path(base, url):
    parsed = urlsplit(url.strip())
    if parsed.scheme or parsed.netloc or url.startswith(("#", "data:", "mailto:", "javascript:")):
        return None
    if not parsed.path:
        return None
    if parsed.path.startswith("/"):
        return ROOT / unquote(parsed.path).lstrip("/")
    return base.parent / unquote(parsed.path)


def main():
    missing = []
    for folder in IMPORTED:
      for file in folder.rglob("*"):
        if file.suffix.lower() == ".html":
            parser = References()
            parser.feed(file.read_text(encoding="utf-8", errors="replace"))
            urls = parser.urls
        elif file.suffix.lower() == ".css":
            urls = re.findall(r"url\(\s*['\"]?([^)'\"]+)", file.read_text(encoding="utf-8", errors="replace"))
        else:
            continue
        for url in urls:
            path = local_path(file, url)
            if path and not path.exists():
                missing.append((file.relative_to(ROOT).as_posix(), url))
    print(f"Missing local references: {len(missing)}")
    for file, url in missing:
        print(f"{file}\t{url}")


if __name__ == "__main__":
    main()
