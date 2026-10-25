# 설계 문서

## 아키텍처 원칙

이 문서 구조는 Plan A와 Plan B의 융합형을 채택합니다.

- Plan A: 루트 문서를 단일 진실 공급원으로 사용합니다.
- Plan B: 하위 폴더에 로컬 컨텍스트와 상태 문서를 배치합니다.

## 추천 구조

```txt
Root = 정책, 역할, 절차, 공통 설계의 SSOT
Local = 도메인별 차이점, 현재 상태, 작업 큐, 오류 기억
```

## 상속 우선순위

1. 시스템 또는 플랫폼 제약
2. 루트 `rules.md`
3. 루트 `agent.md`
4. 루트 `prompt.md`
5. 루트 `docs/design.md`
6. 로컬 `index.md`
7. 로컬 `rules.md`
8. 로컬 `design.md`
9. 로컬 `context.md`
10. 로컬 `todo.md`

## 충돌 해결

| 충돌 유형 | 우선권 |
|---|---|
| 보안, 데이터 삭제, 비밀키, Git 안전 | Root |
| 코드 스타일, 네이밍, 폴더 구조 | Root 우선, 허용 시 Local override |
| 브랜드 톤, UI 밀도, 카피라이팅 | Local |
| 도메인 정책 | Local, 단 Root 보안 규칙보다 낮음 |
| 현재 작업 상태 | Local |
| 전체 프로젝트 목표 | Root |

## 유지보수 원칙

- Root에는 변하지 않는 규칙만 둡니다.
- Local에는 차이점만 둡니다.
- `context.md`는 현재 상태만 유지합니다.
- `error.md`는 반복 가능한 지식만 남깁니다.
- `todo.md`는 실행 가능한 작업으로 유지합니다.
- `index.md`는 짧은 문서 라우터 역할만 합니다.

