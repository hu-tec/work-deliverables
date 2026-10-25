# 2024 Website 구현 계획

## 역할

`2024`는 전체 서비스의 원형 버전이다. 회원, 시험, 출제, 채점, 결제, 정산, 운영, 고객지원, 마이페이지, 응시자 화면까지 가장 넓은 범위를 포함하므로 웹사이트 구현의 베이스로 사용한다.

## 기준 자료

- 디자인 원본: `../../figma_pdf/2024`
- 전체 계획: `../../plan.md`
- 비교 분석: `../../figma_pdf_2024_2025_vibecoding_비교분석.md`
- IA 기준: `../../ai_docs/정가영.docx`

## 구현 목표

- Next.js App Router 기반으로 2024 베이스 라우트와 layout 구조를 만든다.
- 전체 권한별 IA를 1차 라우트로 확정한다.
- 관리자, 수험생, 출제자, 채점자 홈의 공통 골격을 만든다.
- 목록/상세/등록/수정/팝업 패턴을 공통 컴포넌트로 만든다.
- 2025와 vibecoding이 재사용할 디자인 토큰과 UI 컴포넌트 기준을 만든다.
- 모든 화면과 컴포넌트는 TDD 방식으로 작업한다.
- 구현 결과는 `../../figma_pdf/2024`의 대응 PDF/이미지와 비교할 수 있도록 기준 디자인 경로를 남긴다.

## TDD 작업 방식

2024는 전체 서비스의 베이스이므로 테스트를 먼저 작성해 이후 2025/vibecoding 확장에서 회귀를 막는다.

작업 순서:

1. 구현할 화면의 Figma PDF/이미지 경로를 확인한다.
2. 라우트, 권한, 상태값, 주요 액션의 실패 테스트를 먼저 작성한다.
3. 공통 컴포넌트는 단위 테스트를 먼저 작성한다.
4. 화면은 대표 사용자 흐름 테스트를 먼저 작성한다.
5. 최소 구현으로 테스트를 통과시킨다.
6. 디자인 토큰과 공통 컴포넌트로 리팩터링한다.
7. 구현 화면 스크린샷을 기준 PDF/이미지와 비교한다.

우선 테스트 대상:

- 권한별 라우트 접근
- 관리자 테이블 검색/필터/페이지네이션/체크박스 선택
- 회원 승인/반려/정지 상태 변경
- 시험 접수/응시/결과 상태 흐름
- 출제/채점 상세 저장과 제출
- 결제/환불/정산 상태 표시
- 모달 확인/취소 동작

## Figma 충실도 기준

각 화면 구현 시 `../../figma_pdf/2024`의 대응 디자인에 충실해야 한다. 구현 후 2025/vibecoding과 비교할 수 있도록 화면별 기준 자료를 명시한다.

비교 항목:

- 관리자 사이드바, 헤더, 본문 영역의 비율과 정렬
- 테이블 컬럼 순서, 폭, 체크박스 위치, 상태 배지
- 검색/필터 영역의 배치와 입력 컨트롤 종류
- 상세 화면의 섹션 순서와 label/value 구조
- 버튼 문구, 종류, 순서, 위치
- 팝업/모달 크기, 버튼 정렬, 배경 처리
- 색상, 폰트 크기, 간격, border, radius

화면별 작업 기록에는 다음을 남긴다.

- 기준 디자인 파일
- 구현 라우트
- 사용한 공통 컴포넌트
- 작성한 테스트
- PDF/이미지 대비 차이와 의도적 변경 여부

## 권한별 IA

| 권한 | 대메뉴 |
| --- | --- |
| 수험생 | 시험관리, 자격증관리, 결제관리, 마이페이지, 고객센터 |
| 출제자 | 출제관리, 시험관리, 자료관리, 마이페이지, 고객센터 |
| 채점자 | 채점관리, 시험관리, 자료관리, 마이페이지, 고객센터 |
| 관리자 | 회원관리, 시험관리, 출제관리, 채점관리, 결과관리, 자격증관리, 결제관리, 고객센터, 통계관리, 시스템관리 |

## 우선 구현 화면

2024 폴더는 실제 의미 화면이 가장 많으므로, 아래 우선 구현 화면은 1차 MVP 범위다. 구현 시에는 `전체 PDF 대응 범위`를 별도 체크리스트로 관리해 누락 화면이 생기지 않게 한다.

### 1. 공통/인증

- 로그인
- 로그아웃
- 회원가입
- 아이디 찾기
- 비밀번호 찾기/재설정
- 휴대폰 인증/본인인증
- 내 정보 관리
- 비밀번호 변경

대표 자료:

- `../../figma_pdf/2024/로그인.pdf`
- `../../figma_pdf/2024/회원가입.pdf`
- `../../figma_pdf/2024/아이디찾기.pdf`
- `../../figma_pdf/2024/비밀번호찾기.pdf`
- `../../figma_pdf/2024/휴대폰 인증.pdf`

### 2. 관리자

- 관리자 홈
- 회원관리/회원 상세
- 관리자관리
- 그룹관리
- 시험관리/시험관리 신규
- 출제관리/출제 상세
- 채점관리/채점 상세
- 결제관리/정산관리
- 카테고리관리
- 통계
- 사이트관리
- 알림창관리
- 고객지원, 게시판/FAQ

대표 자료:

- `../../figma_pdf/2024/관리자 홈.png`
- `../../figma_pdf/2024/회원관리.pdf`
- `../../figma_pdf/2024/회원관리_상세_전체.pdf`
- `../../figma_pdf/2024/시험관리.pdf`
- `../../figma_pdf/2024/시험관리_신규.pdf`
- `../../figma_pdf/2024/출제관리.pdf`
- `../../figma_pdf/2024/채점관리.pdf`
- `../../figma_pdf/2024/결제관리.pdf`
- `../../figma_pdf/2024/정산관리.pdf`
- `../../figma_pdf/2024/통계.pdf`

### 3. 수험생

- 시험접수
- 시험응시
- 시험결과
- 자격증 신청
- 결제내역
- 알림설정
- 1:1문의

대표 자료:

- `../../figma_pdf/2024/목록_시험접수.pdf`
- `../../figma_pdf/2024/목록_시험응시.pdf`
- `../../figma_pdf/2024/목록_시험결과.pdf`
- `../../figma_pdf/2024/목록_자격증신청.pdf`
- `../../figma_pdf/2024/목록_결제내역.pdf`
- `../../figma_pdf/2024/목록_1_1문의.pdf`

### 4. 출제자/채점자

- 출제자 홈
- 출제관리
- 출제 상세: 단답형, 번역, 프롬프트
- 채점자 홈
- 채점관리
- 채점 상세: 단답형, 번역, 프롬프트

대표 자료:

- `../../figma_pdf/2024/출제관리.pdf`
- `../../figma_pdf/2024/출제관리_단답형상세.pdf`
- `../../figma_pdf/2024/출제관리_번역상세.pdf`
- `../../figma_pdf/2024/출제관리_프롬프트상세.pdf`
- `../../figma_pdf/2024/채점자 홈.png`
- `../../figma_pdf/2024/채점관리.pdf`
- `../../figma_pdf/2024/채점관리_단답형상세.pdf`
- `../../figma_pdf/2024/채점관리_번역상세.pdf`
- `../../figma_pdf/2024/채점관리_프롬프트상세.pdf`

## 전체 PDF 대응 범위

2024는 베이스 버전이므로 대표 자료만 구현하고 끝내지 않는다. 아래 화면군은 우선 구현 이후 순차적으로 매핑한다.

### 인증/계정 상태

- `로그아웃.pdf`, `로그아웃-1.pdf`
- `비밀번호재설정.pdf`, `비밀번호설정완료.pdf`
- `아이디확인.pdf`
- `본인인증 2.pdf`
- `회원가입_간편가입.pdf`
- `회원탈퇴.pdf`, `회원탈퇴-1.pdf`
- `회원탈퇴_환불.pdf`, `회원탈퇴_환불-1.pdf`
- `이용약관.pdf`

### 수험생 응시 플로우

- `응시생_시험시작.png`
- `응시생_시험중.png`
- `응시생_시험중_문장나누기).png`
- `응시생_전체화면.png`
- `응시생_시간확인.png`
- `응시생_제출.png`
- `응시생_제출확인.png`
- `응시생_종료.png`
- `응시생_다음차시.png`
- `응시생_단답형시작.png`
- `응시생_단답형시험.png`
- `응시생_프롬프트AI선택.png`
- `응시생_프롬프트설정.png`
- `응시생_프롬프트시작.png`
- `응시생_프롬프트에디터.png`

### 시험/출제/채점 상세 상태

- `상세_단답형.pdf`
- `상세_단답형출제_출제.pdf`
- `상세_단답형출제_확인.pdf`
- `상세_출제_설정.pdf`, `상세_출제_설정-1.pdf`
- `상세_번역채점.pdf`, `상세_번역채점_피드백.pdf`
- `상세_프롬프트출제_설정.pdf`, `상세_프롬프트출제_설정-1.pdf`, `상세_프롬프트출제_확인.pdf`
- `상세_프롬프트채점.pdf`, `상세_프롬프트채점_상세.pdf`
- `다음 출제 화면.pdf`
- `다음 채점 화면.pdf`
- `평가서 팝업.png`

### 번역/음성/영상/AI 유형

- `시험_번역(번역기지정).pdf`
- `시험_출제_번역기선택(텍스트)_전체보기.pdf`
- `시험_음성영상(번역기2개).pdf`
- `시험_음성영상(번역기3개).pdf`
- `시험_웹툰번역(번역기선택).png`
- `STT.pdf`
- `STT(음성파일 업로드 후).pdf`
- `TTS.pdf`
- `STS.pdf`
- `영상.pdf`

### 결제/장바구니/정산

- `결제.pdf`, `결제-1.pdf`, `결제-2.pdf`, `결제-3.pdf`
- `결제미승인.pdf`
- `결제완료.pdf`
- `신용카드.pdf`
- `포인트 결제.pdf`, `포인트 결제-1.pdf`
- `장바구니.pdf`
- `결제/정산 관리.pdf`
- `목록_정산내역.pdf`

### 운영/콘텐츠/고객지원

- `고객지원.pdf`, `고객지원(신규).pdf`
- `1_1 문의관리.pdf`
- `마이페이지_1_1 문의 상세.pdf`
- `문의팝업.pdf`
- `게시판+FAQ.pdf`, `게시판+FAQ_상세.pdf`
- `블로그_목록.pdf`, `블로그_상세.pdf`
- `사이트관리.pdf`, `사이트관리_메인배너(수정).pdf`
- `알림창관리.png`
- `이메일발송.pdf`
- `저장.pdf`, `저장팝업.pdf`
- `임시저장.pdf`
- `정보없을경우.pdf`

### 전문가/프로필/활동

- `전문가관리.pdf`
- `전문가관리_상세_전체.pdf`
- `전문가신청.pdf`
- `전문가신청_저장.pdf`
- `목록_전문가프로필.pdf`, `목록_전문가프로필-1.pdf`
- `프로필관리.pdf`
- `활동관리.pdf`

### 분류/선택/기타 리소스

- `구분.pdf`, `구분-1.pdf` ~ `구분-8.pdf`
- `구분.png`
- `_Select/Base.pdf`
- `출제하기 화면/가로 1318 기준.pdf`
- `메뉴 구조.png`
- `관리자 추가 버튼들 - 미완료.pdf`

## 라우트 초안

```text
app/
  (auth)/
    login/page.tsx
    signup/page.tsx
    find-id/page.tsx
    reset-password/page.tsx
  (common)/
    my/page.tsx
    my/security/page.tsx
    support/inquiries/page.tsx
  (student)/
    student/dashboard/page.tsx
    student/exams/registration/page.tsx
    student/exams/start/page.tsx
    student/exams/results/page.tsx
    student/certificates/page.tsx
    student/payments/page.tsx
  (author)/
    author/dashboard/page.tsx
    author/questions/page.tsx
    author/questions/[id]/page.tsx
    author/exams/assigned/page.tsx
    author/resources/page.tsx
  (grader)/
    grader/dashboard/page.tsx
    grader/assignments/page.tsx
    grader/scoring/[id]/page.tsx
    grader/history/page.tsx
    grader/resources/page.tsx
  (admin)/
    admin/dashboard/page.tsx
    admin/members/page.tsx
    admin/members/[id]/page.tsx
    admin/admins/page.tsx
    admin/groups/page.tsx
    admin/exams/page.tsx
    admin/exams/new/page.tsx
    admin/questions/page.tsx
    admin/scoring/page.tsx
    admin/results/page.tsx
    admin/certificates/page.tsx
    admin/payments/page.tsx
    admin/settlements/page.tsx
    admin/support/page.tsx
    admin/faqs/page.tsx
    admin/statistics/page.tsx
    admin/system/site/page.tsx
    admin/system/categories/page.tsx
    admin/system/notices/page.tsx
```

## 공통 컴포넌트 산출물

- `AdminShell`
- `UserShell`
- `PageHeader`
- `SearchFilter`
- `DataTable`
- `StatusBadge`
- `Pagination`
- `DetailSection`
- `FormField`
- `FileAttachment`
- `ConfirmModal`
- `ActionButtonGroup`

## 2024 완료 기준

- [ ] 권한별 라우트가 정의되어 있다.
- [ ] Next.js App Router 기준 `app` 디렉터리 구조가 정의되어 있다.
- [ ] 권한/라우트/상태/컴포넌트 테스트가 먼저 작성되어 있다.
- [ ] 관리자 목록/상세/등록 화면 패턴이 공통화되어 있다.
- [ ] 수험생 시험접수/응시/결과 플로우가 연결되어 있다.
- [ ] 출제/채점 상세 화면이 공통 상세 패턴으로 정리되어 있다.
- [ ] 결제/정산/고객지원 화면의 테이블과 상태값이 정리되어 있다.
- [ ] 전체 PDF 대응 범위의 화면군이 우선순위와 라우트에 매핑되어 있다.
- [ ] 대표 화면별로 2024 Figma PDF/이미지와 구현 화면 비교 기록이 있다.
- [ ] 2025 확장을 위한 공통 토큰과 컴포넌트 variant 기준이 문서화되어 있다.
