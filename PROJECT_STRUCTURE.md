# 신봄 업무산출물 — 폴더 구조 분석

> 기준일: 2026-06-21
> 저장소: https://github.com/hu-tec/work-deliverables
> 로컬 경로: `Desktop/신봄_업무산출물(0605)/`

---

## 전체 구조 개요

```
신봄_업무산출물(0605)/
├── [루트 파일들]               ← 인덱스 · 가이드 · 인수인계서
├── ITT_홈페이지 분석안/         ← ITT 시험 홈페이지 분석
├── UI템플릿_생성기/             ← HTML/CSS/JS UI 템플릿 생성 도구
├── codex_매뉴얼/               ← Codex 사용 매뉴얼
├── codex_문서작성방안/          ← Codex 문서 구조 방법론
├── codex_자동승인모드_방법/     ← Codex 자동승인 설정 가이드
├── downloads/                  ← 카테고리별 산출물 ZIP 패키지
├── hutechC Rules-Layout/       ← HutechC 레이아웃 규칙 데모
├── 거래처아웃콜/               ← 거래처 아웃콜 BO 개선안
├── 내부 관리망분석/             ← 내부 업무 플랫폼 분석
├── 디자인시스템/               ← 관리자/사용자 통합 디자인 시스템
├── 랜딩페이지/                 ← 협회·교육·시험 3종 랜딩페이지
├── 마크다운에디터_내부용/       ← 내부용 마크다운 에디터 웹앱
├── 보유 스킬 및 상세 체크리스트_고도화/  ← 스킬 체크리스트 고도화
├── 업무_추적_댓글_웹프로그램/   ← 업무 추적·댓글 웹 애플리케이션
├── 타임즈_테솔_분석자료/        ← 타임즈·테솔 사이트 분석
├── 테솔_ITT_FAQ분석/            ← TESOL / ITT FAQ 분석
├── 협업연동_커뮤니케이션_업무툴_테스트/  ← 협업 커뮤니케이션 도구 테스트
└── 휴텍씨_시험_평가_사이트/    ← 휴텍씨 시험 평가 플랫폼 전체
```

---

## 루트 공통 파일

| 파일 | 설명 |
|------|------|
| `index.html` | 전체 산출물 목록 인덱스 페이지 |
| `analyze.html` | 분석용 HTML |
| `sites.md` | 사이트 목록 정리 |
| `PUSH_WORKFLOW.md` | Git push 워크플로우 가이드 |
| `다른페이지_제작_자료전달_가이드.md` | 페이지 제작 시 자료 전달 방법 |
| `휴텍씨 업무 인수인계서.md` / `.html` | 업무 인수인계 문서 |
| `.github/workflows/static.yml` | GitHub Pages 자동 배포 워크플로우 |

---

## 1. ITT_홈페이지 분석안

ITT 시험 홈페이지 및 아이엠(IAM) 분석 산출물.

```
ITT_홈페이지 분석안/
├── html_sample/
│   ├── association-home.html   ← 협회 메인 샘플
│   ├── exam-home.html          ← 시험 홈 샘플
│   ├── exam-detail-ai.html     ← AI 시험 상세 샘플
│   └── styles.css
├── itt-ai-시험홈페이지-신규분석자료.md
├── mandara.md
├── 시험홈피,아이엠분석.docx
└── 인공지능 언어전문가 및 기술전문가 관리운영규정_20260521.docx
```

HTML 프로토타입 + 분석 MD + 원본 DOCX 3종 세트 구조.

---

## 2. UI템플릿_생성기

프롬프트 기반 UI 템플릿 자동 생성 도구.

```
UI템플릿_생성기/
├── index.html      ← 메인 생성기 UI
├── css/style.css
├── js/main.js
└── PROMPT.md       ← 생성에 사용된 프롬프트 문서
```

---

## 3. codex_매뉴얼

Windows + WSL 환경에서 Codex 사용하는 방법.

```
codex_매뉴얼/
├── index.html                    ← 렌더링된 매뉴얼 뷰어
└── windows_wsl_codex_manual.md   ← 설치·설정 절차 문서
```

---

## 4. codex_문서작성방안

Codex가 문서를 작성할 때의 구조·규칙·컨텍스트 방법론.

```
codex_문서작성방안/
├── index.md / index.html
├── agent.md / context.md / error.md
├── handoff.md / prompt.md / rules.md
├── skills.md / todo.md
├── docs/
│   ├── decision.md / design.md / glossary.md
├── packages/
│   ├── api/   ← API 패키지 문서 (design, index, rules)
│   └── ui/    ← UI 패키지 문서 (design, index, rules)
└── sites/
    └── brand-a/   ← 브랜드-A 사이트 문서 세트
```

---

## 5. codex_자동승인모드_방법

Codex를 현재 폴더로 제한하여 자동 승인 모드로 운영하는 방법.

```
codex_자동승인모드_방법/
├── codex_자동승인_현재폴더_제한_설정.md
└── index.html
```

---

## 6. downloads

전체 산출물을 카테고리별로 묶은 ZIP 다운로드 패키지.

```
downloads/
├── 00_그룹별_다운로드_목록.md   ← 패키지 목록 설명
├── 개발_운영_매뉴얼.zip
├── 관리자_BO_업무화면.zip
├── 교육_시험_콘텐츠_자료.zip
├── 기획_전략_자료.zip
├── 내부_업무도구_자동화.zip
├── 디자인시스템_재사용_UI.zip
├── 보관_원본_자료.zip
├── 분석.zip
└── 사용자_랜딩_신청_화면.zip
```

---

## 7. hutechC Rules-Layout · 용도별 축

HutechC 레이아웃 규칙 시연 페이지.

```
hutechC Rules-Layout · 용도별 축/
└── rules-layout-demo.html
```

---

## 8. 거래처아웃콜

거래처 아웃콜 BO 화면 개선 프로토타입.

```
거래처아웃콜/
├── index.html
├── BO_거래처아웃콜_index_개선_프롬프트.md
├── HutechC 사내 Studio.html
└── HutechC 사내 Studio_files/
```

---

## 9. 내부 관리망분석

내부 업무 플랫폼(HutechC Studio, 타임즈 인트라넷, 업무 스튜디오) 분석.

```
내부 관리망분석/
├── 사이드바_개선안/
│   ├── 01-사이드바-메뉴-단순화-가이드.md
│   ├── 02-디자인-개선안(border-radius).md
│   └── before-after.html          ← 비포/애프터 시각 비교
└── 업무플랫폼 분석/
    ├── 01-hutechc-internal-studio-analysis.md
    ├── 02-timesmedia-intranet-analysis.md
    ├── 03-work-studio-analysis.md
    └── 04-integrated-platform-strategy.md
```

---

## 10. 디자인시스템

관리자(BO) · 사용자 화면 통합 디자인 시스템. 별도 git 저장소 포함.

```
디자인시스템/
├── index.html / common.js / layout.css
├── dense-drawer.css / dense-drawer.js
├── accessibility_check.html
├── bo-index-sample.html / bo_sidebar_classification_sample.html
├── sidebar_depth_sample.html
├── generate-docs-rendered.js
│
├── docs/
│   ├── DB_정리/
│   │   ├── 00_문서목록_및_읽는법.md
│   │   ├── 01_분류체계/ / 02_시험운영/ / 03_교육자료/
│   │   ├── 04_문제은행/ / 05_서비스기획/
│   │   ├── 99_생성검증결과.md
│   │   └── _생성도구/
│   ├── old/                  ← 이전 버전 프롬프트
│   ├── 시험사이트_분석/      ← Figma 사이트맵 2024·2025
│   └── 재사용_디자인_프롬프트/
│       ├── 00_문서목록.md
│       ├── 관리자/
│       └── 사용자/
│
├── docs_rendered/            ← MD → HTML 렌더링 결과 (15개 파일)
│   ├── design-system.html
│   ├── db-doc-index.html / db-generation-check.html
│   ├── reusable-admin-index.html
│   ├── reusable-bo-admin-layout.html / reusable-bo-admin-screen.html
│   ├── reusable-bo-table-layout.html
│   ├── reusable-inline-drawer.html / reusable-search-filter.html
│   ├── reusable-status-chip.html
│   ├── reusable-table-selection-drawer.html
│   ├── reusable-user-design-system.html / reusable-user-index.html
│   ├── figma-2024-sitemap.html / figma-2025-sitemap.html
│   ├── vibecoding-screen-analysis.html
│   └── service-planning-source.html
│
├── form/
│   ├── 신청서/               ← 신청 폼 샘플 + iframe 임베드 데모
│   └── 증명서_재발급_신청/
│
├── notation_tools/
├── resource/
│   ├── DB_v2_HTML/           ← 관리자 패널 HTML (10개 화면)
│   │   ├── DB페이지_v2(이거사용).html
│   │   ├── 결제관리.html / 관리자패널_전체회원.html
│   │   ├── 대중소_DB.html / 대중소관리.html
│   │   ├── 매칭관리.html / 문의.html
│   │   ├── 스케쥴관리.html / 시험관리.html
│   │   └── 통계.html / 활동관리.html
│   ├── DB_정리/              ← docs/DB_정리 사본
│   └── 시험사이트_분석/
│
├── table_design/             ← 테이블 디자인 CSS/JS + 샘플 HTML
└── 디자인MD/                 ← 디자인시스템 ZIP 해제본
```

---

## 11. 랜딩페이지

협회·교육·시험 3종 랜딩페이지. 각각 독립 git 저장소.

```
랜딩페이지/
├── docs/
│   ├── site-layout-analysis.md
│   └── source-site-redesign-guideline.md
│
├── 기초_레이아웃/   [git]         ← 공통 레이아웃 기반
│   ├── index.html / styles.css / data.js / site.js
│   ├── about.html / apply.html / courses.html
│   ├── cert-intro.html / community.html / contact.html
│   ├── course-detail.html / course-apply-detail.html
│   ├── exam-guide.html / mypage.html
│   ├── notice-detail.html / qna-detail.html
│   ├── apply-form-example.html
│   └── times-assets/            ← 파트너 기관 로고 이미지 16종
│
└── 랜딩페이지3종/
    ├── 교육/    [git]            ← 교육 특화 (apply-benefits, apply-refund 등 추가)
    ├── 시험/    [git]            ← 시험 특화
    └── 협회/    [git]            ← 협회 특화
        ├── association.html / history.html / organization.html
        ├── ai-ethics.html / aite-prompt.html / aite-translation.html
        ├── board.html / community.html / contact.html
        └── itt.html / support.html
```

---

## 12. 마크다운에디터_내부용

팀 내부용 마크다운 에디터 — Node.js 백엔드 + 브라우저 프런트엔드.

```
마크다운에디터_내부용/
├── server.js            ← Express 서버 (인증·파일 관리 API)
├── package.json
├── 바로실행.bat         ← 윈도우 원클릭 실행 스크립트
├── markdown-to-word.html
├── public/
│   ├── index.html / login.html / signup.html
│   ├── app.js / auth.js / styles.css
├── data/
│   └── app-db.json
├── docs/
│   └── markdown-editor-enhancement.prompt.md
└── uploads/
    └── attachments/
```

기술 스택: Node.js + Express, 브라우저 기반 마크다운 에디터

---

## 13. 보유 스킬 및 상세 체크리스트_고도화

```
보유 스킬 및 상세 체크리스트_고도화/
├── interview.html / interview_ui.html
├── skill-checklist-restructure_ver_2.md
├── 스킬체크리스트_ver2.docx
└── origin/
    └── skill-checklist-restructure.md
```

---

## 14. 업무_추적_댓글_웹프로그램

업무 항목별 댓글·추적 기능을 가진 내부 웹 프로그램.

```
업무_추적_댓글_웹프로그램/
├── src/server.js        ← Express + SQLite
├── package.json
├── public/
│   ├── index.html / app.js / styles.css
├── data/
│   └── tracker.db       ← SQLite 데이터베이스
├── docs/
│   ├── convention.md
│   ├── 01-plan/features/
│   └── 02-design/features/
├── test/
│   └── server.test.js
└── uploads/
```

기술 스택: Node.js + Express, SQLite (better-sqlite3)

---

## 15. 타임즈_테솔_분석자료

```
타임즈_테솔_분석자료/
├── site-analysis-imweb.md
├── site-analysis-tesol-v3.md
├── site-analysis-timestesol-com.md
└── integration-direction.md
```

---

## 16. 테솔_ITT_FAQ분석

```
테솔_ITT_FAQ분석/
├── times-tesol-faq.md
├── times-translation-faq.md
├── itt-faq.md
└── itt-ai-expected-faq.md
```

---

## 17. 협업연동_커뮤니케이션_업무툴_테스트

```
협업연동_커뮤니케이션_업무툴_테스트/
├── index.html / index2.html / index_detail_panel.html
├── 바로실행.bat
├── 현업연동_커뮤니케이션_업무툴_구현프롬프트.md
├── README.md
└── apps/
    └── work-communication-tool/
        ├── package.json
        ├── public/ / src/ / data/
```

---

## 18. 휴텍씨_시험_평가_사이트

가장 규모가 큰 폴더. 시험 평가 플랫폼 전 버전 및 분석 자료 포함.

```
휴텍씨_시험_평가_사이트/
│
├── hutechc_app-main (휴텍씨_기존홈페이지_클론)/
│   └── hutechc_app-main/    ← Next.js 14 (TypeScript + Tailwind)
│       ├── app/ / components/ / lib/ / docs/
│
├── hutechc_design_resource/  [git]   ← 시험 플랫폼 이미지 리소스
│   ├── 2024/
│   │   ├── 결제 / 관리자 / 관리자_알림창관리 / 관리자_추가버튼
│   │   ├── 그외_메뉴 / 로그인_로그아웃
│   │   ├── 마이페이지_응시생 / 마이페이지_전문가
│   │   ├── 신규_응시자_관리 / 응시생 / 채점 / 출제
│   │   └── 회원가입_전문가가입
│   ├── 2025/
│   │   ├── 공통_에디터 / 관리자 / 마이페이지
│   │   ├── 응시생 / 전문가 / 전문가_프로필_상세_입력
│   │   └── 채점 / 출제 / 출제내역 / 토스트 / 팝업
│   └── 바이브/
│       ├── AI분석 / 가격설정 / 검증_기준표_가이드라인
│       ├── 검증_응시자_평가표 / 관리자_회원관리
│       └── 설정관리 / 시험_내용 / 시험관리 / 시험페이지
│
├── hutechc_test_for_pdf/    ← PDF 출력 테스트용 (3버전 Next.js)
│   ├── 2024/  [git]
│   ├── 2025/  [git]
│   └── vibecoding/
│
├── 시험_홈페이지_분석/
│   ├── 2024_figma_사이트맵_기능정의.md
│   ├── 2024_figma_vs_ai_docs_비교분석.md
│   ├── figma_pdf_2025_사이트맵_기능정의.md
│   ├── figma_pdf_2024_2025_vibecoding_비교분석.md
│   ├── figma_pdf_2025_ai_docs_비교분석.md
│   ├── vibecoding_pdf_ai_docs_비교분석.md
│   ├── vibecoding_화면분석_쉬운설명.md
│   ├── 시험플랫폼_관점_2024_2025_vibecoding_해석.md
│   ├── 일반인용_문서읽기_가이드.md
│   ├── 시험플랫폼_레이아웃_통합도.html
│   ├── 시험플랫폼_레이아웃_프리뷰.html
│   ├── ai_docs/ / figma_pdf/ / word_docx/
│
└── 예전작업/
    ├── 시험_사이트_1차생성/  [git]  ← Next.js 1차
    ├── 시험_사이트_2차생성/
    ├── 시험_사이트_3차생성/         ← Next.js 3차
    ├── 시험_사이트_4차생성/         ← HTML 단독 버전
    └── 시험홈페이지_통합_구현/ [git] ← Next.js 통합 최종본
```

---

## 기술 스택 요약

| 영역 | 기술 |
|------|------|
| 정적 웹 | HTML + CSS + Vanilla JS |
| 프레임워크 | Next.js 14 (TypeScript + Tailwind CSS) |
| 백엔드 도구 | Node.js + Express |
| 데이터 저장 | SQLite (업무 추적), JSON (마크다운 에디터) |
| 배포 | GitHub Pages (static.yml) |
| 문서 형식 | Markdown (.md), Word (.docx), HTML 렌더링 |
| AI 도구 | Codex, Claude Code, Vibe Coding |

---

## 폴더별 활용 팁

| 목적 | 참고 위치 |
|------|-----------|
| 관리자·사용자 화면 신규 제작 | `디자인시스템/docs_rendered/` |
| 새 랜딩페이지 기반 | `랜딩페이지/기초_레이아웃/` |
| 최신 시험 플랫폼 개발 | `휴텍씨_시험_평가_사이트/hutechc_test_for_pdf/2025/` |
| Codex 작업 지시 시 문서 구조 | `codex_문서작성방안/` |
| 전체 산출물 ZIP 다운로드 | `downloads/00_그룹별_다운로드_목록.md` |
| 마크다운 에디터 로컬 실행 | `마크다운에디터_내부용/바로실행.bat` |
| 업무 추적 시스템 | `업무_추적_댓글_웹프로그램/` (SQLite DB 포함) |
