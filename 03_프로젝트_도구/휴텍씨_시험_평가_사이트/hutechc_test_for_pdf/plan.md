# Website 구현 계획

## 기준 문서

- 루트 계획서: `../plan.md`
- 비교 분석: `../figma_pdf_2024_2025_vibecoding_비교분석.md`
- IA 기준: `../ai_docs/정가영.docx`
- 디자인 원본: `../figma_pdf/2024`, `../figma_pdf/2025`, `../figma_pdf/vibecoding`

## 구현 전략

`website` 구현은 세 버전을 병렬 산출물이 아니라 순차적으로 누적되는 제품 구조로 본다.

1. `2024`: 전체 서비스 원형, IA, 공통 레이아웃, 데이터 모델, 목록/상세/등록 패턴의 기준
2. `2025`: 2024 기반 위에 신규/개편 화면을 확장하는 버전
3. `vibecoding`: 파일업로드와 구분/분류 처리에 특화된 기능 모듈

프론트엔드 구현은 Next.js 기반으로 진행한다. 라우팅은 Next.js App Router를 기준으로 설계하고, 공통 레이아웃은 `app` 디렉터리의 route group/layout 구조로 분리한다.

## 폴더 역할

```text
website/
  plan.md
  2024/
    plan.md
  2025/
    plan.md
  vibecoding/
    plan.md
```

## 공통 개발 원칙

- 기술 기준은 Next.js, TypeScript, React 컴포넌트 구조를 기본으로 한다.
- 권한 기준은 수험생, 출제자, 채점자, 관리자 4개 홈으로 나눈다.
- 공통 페이지는 로그인, 공지사항, 내 정보 관리, 1:1문의, 시험목록, 시험상세정보, 자료보기로 둔다.
- 관리자 화면은 단순 목록 관리가 아니라 시험 플랫폼 운영 컨트롤 타워로 설계한다.
- 모든 버전은 같은 디자인 토큰과 공통 컴포넌트를 공유한다.
- 2025와 vibecoding에서 추가된 화면은 2024 공통 구조를 먼저 재사용하고, 필요한 차이만 variant로 분리한다.
- 개인정보, 비밀번호, 결제정보, 시험문제는 권한별 접근 제어와 마스킹을 기본 전제로 둔다.
- 모든 구현은 TDD 방식으로 진행한다. 화면을 만들기 전에 라우트, 권한, 상태, 컴포넌트 동작에 대한 실패 테스트를 먼저 작성하고, 구현 후 통과시키며 리팩터링한다.
- 각 화면은 `figma_pdf`의 대응 디자인을 기준으로 구현한다. 레이아웃, 간격, 색상, 타이포그래피, 테이블 컬럼, 버튼 위치, 상태 표현을 PDF/이미지와 비교할 수 있어야 한다.

## TDD 및 디자인 비교 기준

작업 순서:

1. 구현 대상 화면의 Figma PDF/이미지 경로를 plan 또는 작업 이슈에 명시한다.
2. IA/라우트/권한/상태 모델 기준의 테스트를 먼저 작성한다.
3. 공통 컴포넌트 단위 테스트를 작성한다.
4. 화면 렌더링 테스트 또는 E2E 테스트로 주요 사용자 흐름을 검증한다.
5. 구현 후 기준 PDF/이미지와 스크린샷을 비교한다.
6. 차이가 있으면 토큰, 컴포넌트 variant, 레이아웃 규칙 중 어느 레벨에서 수정할지 결정한다.

필수 비교 항목:

- 화면 폭과 주요 컨테이너 정렬
- 사이드바, 헤더, 본문 영역 비율
- 테이블 헤더/셀/체크박스/페이지네이션 위치
- 버튼 종류, 크기, 순서, 정렬
- 폼 label/input/helper/error 배치
- 모달/팝업 크기와 버튼 정렬
- 색상, border, radius, shadow
- 상태 배지와 disabled/hover/focus 상태

테스트 산출물 기준:

- 컴포넌트 테스트: 공통 컴포넌트 props, 상태, 접근성 검증
- 라우트 테스트: 권한별 접근 가능/불가 검증
- 화면 테스트: 대표 화면 렌더링과 주요 액션 검증
- 시각 비교 자료: 기준 Figma PDF/이미지와 구현 스크린샷의 매핑 기록

## 공통 컴포넌트 우선순위

1. Shell/Layout
   - 권한별 홈 레이아웃
   - 관리자 사이드바
   - 상단 검색/사용자/로그아웃 영역
   - breadcrumb, page header

2. Data Display
   - 고밀도 테이블
   - 체크박스 선택
   - 상태 배지
   - 페이지네이션
   - empty/loading/error state

3. Form
   - text input, select, textarea
   - checkbox, radio
   - date range
   - 파일 업로드
   - validation/error message

4. Action
   - primary/secondary/outline/danger button
   - 저장, 검색, 수정, 삭제/정지, 승인, 반려, 다운로드
   - 일괄 처리 액션

5. Feedback
   - confirm modal
   - alert modal
   - toast
   - 처리 결과 summary

## 통합 라우트 방향

```text
app/
  (auth)/login
  (common)/notices
  (common)/my
  (common)/support/inquiries
  (student)/student/*
  (author)/author/*
  (grader)/grader/*
  (admin)/admin/*
  (workspace)/workspace/*
  (upload-classification)/upload-classification/*
```

- `/student`, `/author`, `/grader`, `/admin`은 2024 베이스 IA에서 시작한다.
- `/workspace`는 2025의 창작작업실, AI 양식, 템플릿 기능을 수용한다.
- `/upload-classification`은 2025 파일업로드와 vibecoding 구분 플로우를 수용한다.

## 전체 진행 순서

- [ ] 2024 IA와 공통 레이아웃 확정
- [ ] Next.js App Router 기준 디렉터리 구조 확정
- [ ] 2024 관리자/사용자 핵심 화면 구현 계획 확정
- [ ] 공통 디자인 토큰 및 컴포넌트 정의
- [ ] 공통 TDD 규칙과 테스트 파일 배치 기준 확정
- [ ] Figma PDF/이미지와 구현 화면 비교 방식 확정
- [ ] 2025 신규 도메인 편입 위치 결정
- [ ] 2025 신규 화면별 재사용/신규 구현 구분
- [ ] vibecoding 구분 PDF를 상태/단계별 플로우로 분류
- [ ] 파일업로드/구분 처리 모듈 라우트 확정
- [ ] 세 버전의 공통 컴포넌트 차이점을 variant로 정리
