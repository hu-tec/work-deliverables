# 2024 MVP Implementation Log

## 공통 기준

- 디자인 토큰: `app/globals.css`
- IA/권한 라우트: `lib/ia.js`
- 테이블 상태 로직: `lib/table.js`
- 공통 컴포넌트: `components/AppShell.tsx`, `components/DataTable.tsx`, `components/Button.tsx`, `components/StatusBadge.tsx`, `components/ConfirmModal.tsx`
- 테스트: `tests/ia.test.js`, `tests/table.test.js`

## 화면별 기록

| 화면 | 구현 라우트 | 공통 컴포넌트 | 테스트 |
| --- | --- | --- | --- |
| 로그인 | `/login` | `Button` | 기준 디자인 경로 검증 |
| 회원관리 | `/admin/members` | `AppShell`, `PageHeader`, `DataTable`, `Button`, `StatusBadge` | 권한 접근, 테이블 검색/필터/선택 |
| 회원 상세 | `/admin/members/[id]` | `AppShell`, `PageHeader`, `Button` | 권한 접근 |
| 시험관리 신규 | `/admin/exams/new` | `AppShell`, `PageHeader`, `Button` | 권한 접근 |
| 시험접수 | `/candidate/exams/register` | `AppShell`, `PageHeader`, `DataTable`, `Button` | 권한 접근 |
| 출제 상세 | `/author/items` | `AppShell`, `PageHeader`, `Button` | 권한 접근 |
| 채점 상세 | `/grader/scoring` | `AppShell`, `PageHeader`, `Button` | 권한 접근 |

## 현재 차이

- PDF 픽셀 단위 복제 전 단계이며, 레이아웃/컴포넌트/상태 흐름을 먼저 고정했다.
- 실제 인증, 저장, 결제 연동은 목 데이터와 폼 골격으로 대체했다.
- 다음 단계에서 PDF별 스크린샷 비교와 시각 보정이 필요하다.
