"""Report unresolved local assets referenced by imported HTML and CSS."""

import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
IMPORTED = ROOT / "추가_산출물"


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
    for file in IMPORTED.rglob("*"):
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
