# 시험 사이트 2차 생성 계획

## 1. 목적

1차 생성에서 기능 누락이 많았으므로, 2차 생성은 단순 화면 일부 구현이 아니라 `2024 전체 시험 운영 플로우 + 2025 UI/UX 개편 화면 + vibecoding 대량관리 화면 + DB_정리 더미데이터`를 함께 반영한 시험 플랫폼으로 구현한다.

핵심 원칙:

- 2024 자료는 시험 시스템의 전체 업무 흐름 기준이다.
- 2025 자료는 신규/개편 UI와 AI 작업, 양식, 템플릿, 전문가 화면 기준이다.
- vibecoding 자료는 관리자 대량 조회, 필터, 파일 업로드/다운로드, 엑셀 처리 기준이다.
- `DB_정리` 자료는 더미데이터, 분류, 시험, 문제은행, 결제/매칭 데이터의 기준이다.
- 홈페이지 첫 화면은 `http://mtpe.cognitechunion.store:8001/`의 내용을 기준으로 재현한다.

## 2. 기준 자료

반드시 참고할 문서:

- `source/design_system_major/docs/시험사이트_분석/2024_figma_사이트맵_기능정의.md`
- `source/design_system_major/docs/시험사이트_분석/2025_figma_사이트맵_기능정의.md`
- `source/design_system_major/docs/시험사이트_분석/vibecoding_화면분석_쉬운설명.md`
- `source/design_system_major/docs/디자인시스템.md`
- `source/design_system_major/docs/DB_정리/00_문서목록_및_읽는법.md`
- `source/design_system_major/docs/DB_정리/99_생성검증결과.md`

DB/더미데이터 기준:

- `source/design_system_major/docs/DB_정리/01_분류체계/*.csv`
- `source/design_system_major/docs/DB_정리/02_시험운영/*.csv`
- `source/design_system_major/docs/DB_정리/04_문제은행/*.csv`
- `source/design_system_major/docs/DB_정리/05_서비스기획/*.csv`

## 3. 구현 범위

### 3.1 공개 홈페이지

- 첫 화면은 `http://mtpe.cognitechunion.store:8001/` 기준으로 구성한다.
- 시험 소개, 자격/교육/서비스 안내, 접수 진입, 로그인/회원가입 진입을 제공한다.
- 반응형 모바일 화면에서도 주요 CTA가 접히지 않게 구성한다.
- 공개 홈페이지는 내부 운영 앱의 해시 라우트가 아니라 독립 진입 페이지로 분리한다.
- 정적 구현에서는 `2차 생성/public.html`, Next.js 구현에서는 `app/page.tsx`를 공개 페이지로 둔다.

### 3.2 인증 및 계정

- 로그인
- 로그아웃
- 회원가입
- 간편가입
- 본인인증/휴대폰 인증
- 아이디 찾기
- 비밀번호 찾기/재설정
- 회원탈퇴
- 이용약관
- 권한별 홈 이동: 수험생, 출제자, 채점자, 관리자
- 로그인은 공개 페이지와 내부 운영 앱에서 분리된 독립 페이지로 제공한다.
- 정적 구현에서는 `2차 생성/login.html`, Next.js 구현에서는 `app/auth/login/page.tsx`를 로그인 페이지로 둔다.

### 3.2.1 역할별 메뉴 IA

1차 생성의 역할 기반 IA를 2차에서도 유지한다. 로그인 또는 역할 전환 후 좌측/상단 업무 메뉴는 전체 기능 목록이 아니라 현재 역할의 업무 메뉴만 노출한다. 공통 진입 메뉴는 공개 홈페이지와 인증/계정까지만 허용하고, 관리자 전용 대량관리/운영 기능은 수험생/출제자/채점자 메뉴에 섞지 않는다.

| 역할 | 노출 메뉴 |
| --- | --- |
| 수험생 | 공개 홈페이지, 인증/계정, 시험 접수, 결제/시험 응시, 결과 확인, 자격증 신청, 마이페이지, AI 작업실/구매 |
| 출제자 | 공개 홈페이지, 인증/계정, 출제자 홈, 출제 업무 목록, 문제 작성/미리보기, 프롬프트/단답형 설정, 출제 내역, 반려 문항 재제출 |
| 채점자 | 공개 홈페이지, 인증/계정, 채점자 홈, 채점 대상 시험, 개별 답안 채점, 평가서/채점 의견, 채점 내역 |
| 관리자 | 공개 홈페이지, 관리자 대시보드, 회원/그룹/관리자, 전문가 승인/프로필, 시험/일정 관리, 문제/출제 검수, 채점 배정/관리, 결제/정산/환불, 자격증 관리, 코드/카테고리, 양식/템플릿, 문의 관리, 통계관리, vibecoding 대량관리, 누락 점검 |

구현 기준:

- `RoleSwitcher` 또는 로그인 권한 선택 값이 바뀌면 해당 역할 홈으로 이동하고 메뉴도 즉시 재구성한다.
- `AppShell`은 역할별 메뉴 정의를 단일 IA 데이터에서 읽어 렌더링한다.
- `AdminShell`은 관리자 메뉴 안에서 2024 운영 기능과 2025 개편 기능을 하위 탭/섹션으로 분리한다.
- 접근 권한이 없는 역할에는 관리자 대량관리, 정산, 회원관리, 시스템관리 메뉴를 표시하지 않는다.

### 3.3 수험생 영역

수험생 핵심 플로우는 `시험 접수 -> 결제 -> 시험 응시 -> 결과 확인 -> 자격증 신청`이다.

필수 기능:

- 시험 접수 목록
- 시험 접수 상세/신청 팝업
- 접수 정보 변경
- 접수 취소 및 환불 가능 여부 확인
- 응시 가능한 시험 목록
- 시험 시작 전 안내
- 시험 진행 화면
- 남은 시간 표시
- 전체화면 상태
- 답안 임시저장/자동저장
- 제출/제출 확인
- 시험 종료 및 다음 차시 이동
- 시험 결과 목록
- 합격/불합격, 점수, 채점중 상태 표시
- 자격증 신청

시험 유형:

- 번역형 시험
- 음성/영상 번역 시험
- 웹툰 번역 시험
- 프롬프트형 시험
- 단답형 시험

### 3.4 출제자 영역

필수 기능:

- 출제자 홈
- 출제 업무 목록
- 번역형 문제 상세 작성
- 프롬프트형 문제 상세 작성
- 단답형 문제 상세 작성
- 출제 내역
- 출제 기본 설정
- 프롬프트 출제 설정/확인
- 단답형 출제/확인
- 미리보기
- 임시저장
- 최종 제출
- 반려 문항 수정/재제출

핵심 필드:

- 시험명
- 회차
- 등급
- 언어쌍
- 대/중/소분류
- 문제 유형
- 난이도
- 배점
- 지문
- 문제
- 정답
- 해설
- 평가기준
- 첨부파일

### 3.5 채점자 영역

필수 기능:

- 채점자 홈
- 채점 대상 시험 선택
- 개별 답안 채점
- 채점 내역
- 번역형 답안 채점
- 프롬프트형 답안 채점
- 단답형 답안 채점
- 평가서/채점 의견 팝업
- 점수 입력
- 코멘트 입력
- 임시저장
- 채점완료

### 3.6 관리자 영역

2024 전체 관리자 기능과 2025 개편 화면을 모두 반영한다.

필수 기능:

- 관리자 대시보드
- 회원관리
- 회원 상세
- 그룹관리
- 관리자 관리
- 전문가 관리
- 전문가 신청 승인/반려
- 전문가 프로필 관리
- 시험관리
- 시험 신규 등록
- 시험 일정 관리
- 시험 결과 관리
- 자격증 관리
- 문제관리
- 출제 검수
- 채점 배정/관리
- 결제관리
- 정산관리
- 환불관리
- 코드/분류 관리
- 카테고리 관리
- 1:1 문의 관리
- 통계관리
- 데이터 없음 상태
- 삭제/저장/반려/승인 등 공통 확인 팝업

### 3.7 2025 신규/개편 기능

1차 plan에서 누락 방지를 위해 정의한 2025 범위를 2차에서도 필수로 반영한다.

| 구분 | 화면/기능 |
| --- | --- |
| 관리자 개편 | 관리자 관리, 관리자 시험관리 신규, 관리자 자격증관리 상세, 관리자 카테고리 관리, 어드민 대시보드 |
| 양식/템플릿 | 양식관리, 양식관리 신규, 양식관리 상세, 프롬프트 첫화면, 템플릿 양식 관리자 |
| AI 작업 | 메타-T 번역, 번역/편집 작업 화면, 파일 업로드 |
| 사용자/마이페이지 | 마이페이지, 사용자 영역 설명, 전문가 프로필 상세입력 |
| 출제/채점 개편 | 단답형 출제 상세, 프롬프트 출제 설정, 프롬프트 출제 확인 |
| 결제/구매 | 장바구니, 결제, 포인트 결제, 구독 신청, 전문가 견적 요청 |
| 구분/분류 | 구분 화면, 구분-1 ~ 구분-14 계열 |
| 재사용/차이반영 | 시험관리 신규, 채점관리 단답형 상세, 출제관리 프롬프트 상세, 회원관리 상세 전체 |

### 3.8 vibecoding 대량관리

vibecoding 화면은 관리자용 고밀도 데이터 관리 기능으로 구현한다.

필수 기능:

- 회원/활동/결제/문의/통계 통합 탭
- 많은 체크박스를 가진 검색 필터
- 기간 검색
- 카테고리 검색
- 키워드 검색
- 대량 테이블
- 가로 스크롤 테이블
- 컬럼 그룹 구분
- 선택 삭제
- 메일 보내기
- SMS 전송
- 엑셀파일 생성
- 파일 올리기
- 파일 다운로드
- 업로드 성공/실패 상태
- 처리 결과 목록

테이블 데이터 묶음:

- 회원 기본 정보
- 활동 및 서비스 정보
- 접수 및 시험 진행 정보
- 결제/정산 정보
- 문의/통계 정보

## 4. 권장 라우트

```text
app/
  page.tsx
  auth/
    login/page.tsx
    signup/page.tsx
    find-id/page.tsx
    reset-password/page.tsx
    withdrawal/page.tsx
  examinee/
    exams/page.tsx
    exams/[id]/apply/page.tsx
    exams/[id]/take/page.tsx
    results/page.tsx
    certificates/page.tsx
    mypage/page.tsx
  author/
    dashboard/page.tsx
    questions/page.tsx
    questions/new/page.tsx
    questions/[id]/page.tsx
    history/page.tsx
  grader/
    dashboard/page.tsx
    assignments/page.tsx
    assignments/[id]/page.tsx
    history/page.tsx
  admin/
    dashboard/page.tsx
    members/page.tsx
    members/[id]/page.tsx
    groups/page.tsx
    admins/page.tsx
    experts/page.tsx
    exams/page.tsx
    exams/new/page.tsx
    exams/[id]/page.tsx
    questions/page.tsx
    grading/page.tsx
    payments/page.tsx
    settlements/page.tsx
    certificates/[id]/page.tsx
    categories/page.tsx
    codes/page.tsx
    inquiries/page.tsx
    statistics/page.tsx
    forms/page.tsx
    forms/new/page.tsx
    forms/[id]/page.tsx
    forms/prompts/page.tsx
    templates/page.tsx
    templates/[id]/page.tsx
    bulk-management/page.tsx
  workspace/
    page.tsx
    create/page.tsx
    meta-translation/page.tsx
    editor/page.tsx
    files/page.tsx
    cart/page.tsx
    checkout/page.tsx
  upload-classification/
    upload/page.tsx
    review/page.tsx
```

정적 HTML 산출물 기준:

```text
2차 생성/
  public.html     # 공개 홈페이지
  login.html      # 로그인/계정 진입
  index.html      # 로그인 후 내부 역할별 운영 앱
  styles.css
  app.js
```

## 5. 공통 컴포넌트

1차 plan의 신규 컴포넌트와 2024 전체 업무 컴포넌트를 함께 만든다.

- `AppShell`
- `AdminShell`
- `RoleHome`
- `SearchHeader`
- `FilterPanel`
- `LargeCheckboxGroup`
- `DataTable`
- `WideDataTable`
- `StatusBadge`
- `ConfirmDialog`
- `EmptyState`
- `Pagination`
- `FileUploadDropzone`
- `UploadedFileList`
- `ProcessingResultTable`
- `ExcelActionBar`
- `PromptEditor`
- `QuestionEditor`
- `ExamTimer`
- `AnswerEditor`
- `ScoringRubric`
- `TemplateCard`
- `TemplateManagerTable`
- `WorkspaceCategoryTabs`
- `AIModelSelector`
- `AdminDashboardSummary`
- `PaymentSummary`
- `CertificateApplicationForm`

## 6. 더미데이터 기준

더미데이터는 임의 문자열만 넣지 말고 `DB_정리` 자료를 사용한다.

반영 대상:

- 서비스 분야 대/중/소분류
- 자격시험 종류와 급수
- 시험 기본설정 선택항목
- 응시대상 급수목록
- 출제/채점 일정 운영항목
- 문제은행 CSV
- 서비스 매칭/결제 분류
- 통합DB 항목사전

최소 더미데이터:

- 수험생 10명 이상
- 출제자 3명 이상
- 채점자 3명 이상
- 관리자 2명 이상
- 시험 5개 이상
- 시험 접수/응시/결과 상태별 데이터
- 번역형/프롬프트형/단답형 문제
- 결제/환불/정산 상태별 데이터
- 문의/답변 상태별 데이터
- 양식/템플릿/AI 작업 샘플
- 파일 업로드 성공/실패 샘플

## 7. 구현 순서

1. 디자인 시스템과 레이아웃 토큰 정리
2. DB_정리 기반 더미데이터 모델 작성
3. 공개 홈페이지 구현
4. 인증/권한별 홈 구현
5. 수험생 시험 접수/응시/결과/자격증 플로우 구현
6. 출제자 문제 작성/제출 플로우 구현
7. 채점자 채점/피드백 플로우 구현
8. 관리자 기본 운영 기능 구현
9. 2025 양식/템플릿/창작작업실/메타번역 구현
10. vibecoding 대량관리/파일업로드/엑셀 액션 구현
11. 모바일/반응형 점검
12. 누락 기능 체크리스트 검증

## 8. 검증 체크리스트

### 8.1 2024 전체 플로우

- [x] 공개 홈페이지가 내부 운영 앱과 분리된 별도 페이지로 제공된다.
- [x] 로그인 페이지가 내부 운영 앱과 분리된 별도 페이지로 제공된다.
- [x] 로그인 후 권한별 홈으로 이동한다.
- [x] 권한별 홈 이동 후 메뉴가 현재 역할 업무 기준으로 재구성된다.
- [x] 관리자 전용 메뉴가 수험생/출제자/채점자 메뉴에 노출되지 않는다.
- [x] 수험생이 시험 접수, 결제, 응시, 제출, 결과 확인, 자격증 신청까지 진행할 수 있다.
- [x] 출제자가 번역형/프롬프트형/단답형 문제를 작성하고 임시저장/제출할 수 있다.
- [x] 채점자가 배정된 답안을 채점하고 피드백을 저장할 수 있다.
- [x] 관리자가 회원, 시험, 문제, 채점, 결제, 정산, 문의, 통계를 관리할 수 있다.

### 8.2 2025 신규/개편 화면

- [x] 양식관리 목록/신규/상세가 구현되어 있다.
- [x] 프롬프트 첫화면 설정이 구현되어 있다.
- [x] 템플릿 양식 관리가 구현되어 있다.
- [x] 창작작업실 카테고리 탭과 AI 선택이 구현되어 있다.
- [x] 메타-T 번역 입력/언어/AI/결과 상태가 구현되어 있다.
- [x] 번역/편집 작업 화면의 원문, AI 번역기, 비교 번역기, 에디터 패널이 구현되어 있다.
- [x] 장바구니와 결제가 구현되어 있다.
- [x] 관리자 대시보드 개편 화면이 구현되어 있다.
- [x] 관리자 시험관리/자격증관리/카테고리관리 개편 화면이 구현되어 있다.

### 8.3 vibecoding 대량관리

- [x] 회원/활동/결제/문의/통계 탭이 있다.
- [x] 체크박스 필터가 많은 조건에서도 줄바꿈과 정렬이 깨지지 않는다.
- [x] 가로로 긴 테이블이 스크롤 가능하다.
- [x] 엑셀파일 생성 버튼이 있다.
- [x] 파일 올리기/다운로드 버튼이 있다.
- [x] 업로드 성공/실패/처리결과가 표시된다.
- [x] 선택 삭제, 메일 보내기, SMS 전송 액션이 있다.

### 8.4 데이터와 UI

- [x] `DB_정리` CSV/문서 기준 더미데이터가 들어가 있다.
- [x] 빈 데이터 상태가 구현되어 있다.
- [x] 저장/삭제/승인/반려/제출 확인 팝업이 구현되어 있다.
- [x] 모바일 화면에서 주요 액션이 보인다.
- [x] 관리자 테이블과 필터가 2025/vibecoding 기준 밀도를 충족한다.

## 9. 완료 기준

- 2024 전체 시험 운영 플로우가 빠짐없이 연결되어 있다.
- 2025 신규 화면이 1차 plan의 범위 이상으로 반영되어 있다.
- vibecoding의 대량관리, 파일업로드, 엑셀 처리 흐름이 구현되어 있다.
- `DB_정리` 자료 기반 더미데이터가 화면에 연결되어 있다.
- 각 역할별로 최소 1개 이상의 완성된 사용 시나리오가 동작한다.
- 구현 후 `plan.md` 체크리스트 기준으로 누락 항목을 표시하고 보완한다.
