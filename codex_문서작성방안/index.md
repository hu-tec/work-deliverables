# 워크스페이스 지침 인덱스

## 목적

이 문서는 AI 에이전트가 어떤 상황에서 어떤 문서를 읽어야 하는지 알려주는 라우터입니다.

## 항상 읽을 문서

1. `/agent.md`
2. `/rules.md`
3. `/context.md`

## 작업 유형별 읽기 문서

| 작업 유형 | 읽을 문서 |
|---|---|
| UI 작업 | `/docs/design.md`, 로컬 `design.md`, 로컬 `rules.md` |
| API 작업 | `/docs/design.md`, `/packages/api/rules.md`, `/packages/api/design.md` |
| 버그 수정 | `/error.md`, 로컬 `error.md`, 로컬 `context.md`, 로컬 `todo.md` |
| 신규 기능 | `/context.md`, `/todo.md`, `/docs/design.md`, 로컬 `design.md` |
| 리팩터링 | `/rules.md`, `/docs/design.md`, `/docs/decision.md` |
| 세션 재개 | `/handoff.md`, `/context.md`, 로컬 `todo.md` |

## 상속 원칙

루트 규칙은 전역에 적용됩니다.
로컬 규칙은 루트 규칙을 확장하거나, 허용된 범위에서만 오버라이드합니다.

충돌이 있을 경우 `/rules.md`의 우선순위 표를 따릅니다.

