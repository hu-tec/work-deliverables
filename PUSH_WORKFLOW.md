# GitHub Pages 작업/푸시 운영 규칙

이 문서는 어떤 프로젝트에서도 복사해서 쓸 수 있는 작업 규칙이다.

## 기본 원칙

- 사용자가 `푸시진행해`, `커밋하고 올려줘`, `바로 올려줘`라고 말하면 추가 확인 없이 커밋과 푸시를 진행한다.
- 변경사항은 가능한 한 의미 단위별 단일 커밋으로 묶는다.
- 원복 가능성을 위해 실험성 변경, 레이아웃 변경, 폰트 변경은 각각 따로 커밋한다.
- 커밋 메시지는 변경 목적이 드러나게 영어로 짧게 작성한다.
- 푸시 후에는 최종 커밋 해시와 확인 가능한 URL을 알려준다.

## 표준 작업 순서

```powershell
git status --short --branch
git diff --stat
git add <변경파일>
git commit -m "<commit message>"
git push origin main
git status --short --branch
```

SSH 인증이 실패하면 HTTPS 원격으로 푸시한다.

```powershell
git push https://github.com/<org-or-user>/<repo>.git main
git fetch https://github.com/<org-or-user>/<repo>.git main:refs/remotes/origin/main
```

## 새 폴더/새 산출물 추가 규칙

새롭게 만든 산출물은 루트에 파일을 흩뿌리지 않고 새 폴더 하나를 만들어 넣는다.

권장 구조:

```text
project-name/
  index.html
  README.md
  assets/
```

필요한 경우 CSS/JS는 같은 폴더 안에 둔다.

```text
project-name/
  index.html
  styles.css
  script.js
  README.md
```

## GitHub Pages 링크 규칙

저장소가 GitHub Pages로 배포 중이면 링크는 다음 형식이다.

```text
https://<org-or-user>.github.io/<repo>/<folder-name>/
```

파일명이 `index.html`이면 폴더 URL만 제공한다.

예시:

```text
https://hu-tec.github.io/work-deliverables/new-tool/
```

특정 HTML 파일이면 파일명까지 포함한다.

```text
https://hu-tec.github.io/work-deliverables/new-tool/report.html
```

한글/공백 경로는 URL 인코딩된 링크를 제공한다.

## 원복 규칙

마지막 커밋 하나를 되돌릴 때:

```powershell
git revert <commit-hash>
git push origin main
```

아직 커밋 전이면 파일 단위로 되돌린다.

```powershell
git restore <file>
```

## 이 저장소 기준

현재 저장소:

```text
https://github.com/hu-tec/work-deliverables
```

GitHub Pages 루트:

```text
https://hu-tec.github.io/work-deliverables/
```

기본 브랜치:

```text
main
```

## Codex 작업 시 주의

- 작업 폴더가 Codex workspace 밖에 있으면 `.git` 쓰기나 네트워크 푸시에서 승인이 필요할 수 있다.
- 승인 없이 자연스럽게 작업하려면 해당 저장소 폴더를 Codex workspace root로 열거나, `Documents` 아래로 저장소를 옮긴다.
- 사용자가 명시적으로 `푸시진행해`라고 말한 경우, 별도 의사 확인은 하지 않고 가능한 즉시 커밋/푸시를 진행한다.
