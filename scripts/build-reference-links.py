"""Collect external reference URLs from Markdown files for the static index page."""

import json
import re
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit


ROOT = Path(__file__).resolve().parents[1]
URL = re.compile(r"https?://[^\s<>\[\](){}\"'`]+", re.IGNORECASE)
SKIP_DIRS = {".git", "node_modules", ".bkit", "dist", "build"}
SKIP_HOSTS = {"localhost", "127.0.0.1", "example.com", "www.example.com", "아무주소"}


def purpose_for(url):
    lower = url.lower()
    host = (urlsplit(url).hostname or "").lower()
    if "54.116.15.136" in host or host == "gw.timestesol.com":
        return "사내 업무·관리"
    if any(term in lower for term in ("tesol", "ai-teacher", "timestesol.com")):
        return "테솔·교육"
    if any(term in lower for term in ("aite", "itt.or.kr", "hutechc-exam", "mtpe.cognitechunion")):
        return "시험·자격"
    if any(term in lower for term in ("figma.com", "github.com", "learn.microsoft.com", "help.openai.com", "work-deliverables")):
        return "제작·개발 참고"
    return "기타 참고"


def label_for(url):
    parts = urlsplit(url)
    host = parts.hostname or ""
    path = parts.path.strip("/")
    if host == "54.116.15.136":
        site = "휴텍씨 사내 Studio" if parts.port == 81 else "Work Studio"
        if path.endswith("work-log"):
            return "사내 Studio 업무일지"
        return site + (" 앱" if path else "")
    if host in {"itt.or.kr", "www.itt.or.kr"}:
        if "pre00" in parts.query:
            return "ITT 시험 안내"
        if "colum" in parts.query:
            return "ITT 칼럼"
        return "ITT 소개"
    if host in {"timestesol.com", "www.timestesol.com"} and parts.query:
        detail = {"colum": "칼럼", "faq04": "통번역 FAQ", "asd01": "번역 안내", "test0": "번역 시험 안내"}
        return "타임즈 테솔 · " + next((name for key, name in detail.items() if key in parts.query), "자료")
    if host == "gw.timestesol.com" and path:
        return "타임즈 인트라넷 로그인"
    if host == "aite-test.imweb.me":
        return "AITE 자격시험"
    if host == "www.figma.com" and "/make/" in parts.path:
        return "Figma · DB 페이지 시안"
    names = {
        "gw.timestesol.com": "타임즈 인트라넷",
        "timestesol.com": "타임즈 테솔",
        "www.timestesol.com": "타임즈 테솔",
        "timestesol.imweb.me": "테솔 교육원",
        "aite-test.imweb.me": "AITE 자격시험",
        "itt.or.kr": "ITT",
        "www.itt.or.kr": "ITT",
        "learn.microsoft.com": "Microsoft 문서",
        "help.openai.com": "OpenAI 도움말",
        "www.figma.com": "Figma",
        "github.com": "GitHub",
    }
    if host == "hu-tec.github.io":
        site = path.split("/")[0] if path else "HU-TEC"
        if site == "ai-teacher":
            return "AI 교사 사이트"
        return site + (" · 과정 안내" if "/courses/" in path else "")
    site = names.get(host, host.removeprefix("www."))
    return site + (" · " + path.split("/")[-1] if path else "")


def main():
    links = {}
    for path in sorted(ROOT.rglob("*.md")):
        if any(part in SKIP_DIRS for part in path.relative_to(ROOT).parts):
            continue
        source = path.relative_to(ROOT).as_posix()
        content = path.read_text(encoding="utf-8", errors="replace")
        for found in URL.findall(content):
            url = found.rstrip(".,;:!?，。")
            host = urlsplit(url).hostname
            if not host or host.lower() in SKIP_HOSTS or "<" in url or ">" in url:
                continue
            if host.startswith("192.168.") or "/api/" in url or url.endswith(".js"):
                continue
            if url in {"https://github.com/", "https://www.figma.com/design/"} or "/new-tool" in url:
                continue
            parts = urlsplit(url)
            # A page URL with or without its final slash is one reference entry.
            path = parts.path.rstrip("/") or "/"
            if host == "aite-test.imweb.me" and path == "/index":
                path = "/"
            canonical = urlunsplit((parts.scheme.lower(), parts.netloc.lower(), path, parts.query, parts.fragment))
            links.setdefault(canonical, set()).add(source)
    items = [
        {"url": url, "label": label_for(url), "purpose": purpose_for(url), "sources": sorted(sources)}
        for url, sources in sorted(links.items(), key=lambda item: (urlsplit(item[0]).hostname or "", item[0]))
    ]
    payload = json.dumps(items, ensure_ascii=False).replace("</", "<\\/")
    (ROOT / "reference-links.js").write_text(
        "window.REFERENCE_LINKS = " + payload + ";\n", encoding="utf-8"
    )
    print(f"Collected {len(items)} links from {len({p for item in items for p in item['sources']})} Markdown files")


if __name__ == "__main__":
    main()
