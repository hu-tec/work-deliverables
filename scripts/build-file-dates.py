"""Build stable modification dates for documents shown by index.html."""

import json
import re
import subprocess
from datetime import datetime, timedelta, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
TODAY = datetime.now(timezone(timedelta(hours=9))).date().isoformat()
MOVES = json.loads((ROOT / "scripts/folder-move-map.json").read_text(encoding="utf-8"))
IMPORTED = tuple(
    item["to"] + "/" for item in MOVES
    if item["from"].startswith("추가_산출물/")
)


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT).decode("utf-8", errors="replace").strip()


def main():
    paths = sorted(set(re.findall(r'"path": "([^"]+)"', INDEX.read_text(encoding="utf-8"))))
    changed = set()
    status = subprocess.check_output(["git", "status", "--porcelain", "-z", "-uall"], cwd=ROOT)
    for record in status.split(b"\0"):
        if record and len(record) > 3:
            changed.add(record[3:].decode("utf-8", errors="replace").replace("\\", "/"))

    dates = {}
    for path in paths:
        if not (ROOT / path).is_file():
            continue
        if path.startswith(IMPORTED):
            dates[path] = datetime.fromtimestamp((ROOT / path).stat().st_mtime).date().isoformat()
            continue
        # 버전 폴더는 이동 전 원본 경로의 작성 이력을 사용한다.
        history_path = re.sub(r"^01_화면_디자인/랜딩페이지/랜딩페이지3종/ver[12]/",
                              "랜딩페이지/랜딩페이지3종/", path, count=1)
        if history_path == path:
            for item in sorted(MOVES, key=lambda move: len(move["to"]), reverse=True):
                target = item["to"]
                if path == target or path.startswith(target + "/"):
                    history_path = item["from"] + path[len(target):]
                    break
        committed = git("log", "-1", "--format=%cs", "--", history_path)
        substantive_change = path in changed and subprocess.run(
            ["git", "diff", "--ignore-space-at-eol", "--quiet", "--", path], cwd=ROOT
        ).returncode != 0
        if substantive_change and "/ver1/" not in path:
            dates[path] = TODAY
        else:
            dates[path] = committed or TODAY

    payload = json.dumps(dates, ensure_ascii=False).replace("</", "<\\/")
    (ROOT / "file-dates.js").write_text("window.FILE_MODIFIED_DATES = " + payload + ";\n", encoding="utf-8")
    print(f"Recorded dates for {len(dates)} indexed files")


if __name__ == "__main__":
    main()
