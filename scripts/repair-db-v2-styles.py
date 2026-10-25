"""Embed local Tailwind styles in archived Figma DB screens.

The original stylesheet URLs were temporary signed Figma previews and expired
on 2026-06-08. Embedding CSS keeps individual HTML downloads readable too.
"""

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CSS = (ROOT / "디자인시스템/resource/DB_v2_HTML/local-preview.css").read_text(encoding="utf-8")
DIRECTORIES = [
    ROOT / "디자인시스템/resource/DB_v2_HTML",
    ROOT / "추가_산출물/디자인시스템_확장시안/resource/DB_v2_HTML",
]
EXPIRED_LINK = re.compile(r'<link rel="stylesheet" href="https://s3-figma-foundry-cached-previews-production-sig\.figma\.com/[^\"]+">\s*')
LOCAL_STYLE = re.compile(r'\s*<style id="db-v2-local-styles">.*?</style>', re.DOTALL)


def main():
    updated = 0
    for directory in DIRECTORIES:
        for file in directory.glob("*.html"):
            html = file.read_text(encoding="utf-8")
            if "s3-figma-foundry-cached-previews-production-sig.figma.com" not in html and "db-v2-local-styles" not in html:
                continue
            html = LOCAL_STYLE.sub("", html)
            html, count = EXPIRED_LINK.subn("", html)
            if count:
                html = html.replace("</head>", f'<style id="db-v2-local-styles">{CSS}</style>\n   </head>', 1)
                file.write_text(html, encoding="utf-8")
                updated += 1
    print(f"Embedded local styles in {updated} DB screen files")


if __name__ == "__main__":
    main()
