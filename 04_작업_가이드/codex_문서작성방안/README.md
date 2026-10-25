# Codex 문서 작성 방안

이 폴더는 AI 에이전트와 사람이 함께 작업하는 대규모 워크스페이스를 위한 표준 문서 구조 예시입니다.

핵심 원칙은 다음과 같습니다.

- `Root`는 전역 정책, 역할, 절차, 공통 설계의 단일 진실 공급원으로 사용합니다.
- `Local`은 하위 폴더별 차이점, 현재 상태, 작업 큐, 오류 기억만 관리합니다.
- 전역 규칙을 하위 폴더에 복사하지 않고, 명시적으로 상속합니다.
- AI가 항상 읽어야 하는 문서와 필요할 때만 읽는 문서를 분리해 토큰 낭비를 줄입니다.

## 권장 구조

```txt
codex문서작성방안/
├─ README.md
├─ index.md
├─ agent.md
├─ prompt.md
├─ rules.md
├─ skills.md
├─ context.md
├─ todo.md
├─ error.md
├─ handoff.md
├─ docs/
│  ├─ design.md
│  ├─ decision.md
│  └─ glossary.md
├─ sites/
│  └─ brand-a/
│     ├─ index.md
│     ├─ rules.md
│     ├─ context.md
│     ├─ design.md
│     ├─ todo.md
│     └─ error.md
└─ packages/
   ├─ ui/
   │  ├─ index.md
   │  ├─ rules.md
   │  └─ design.md
   └─ api/
      ├─ index.md
      ├─ rules.md
      └─ design.md
```

