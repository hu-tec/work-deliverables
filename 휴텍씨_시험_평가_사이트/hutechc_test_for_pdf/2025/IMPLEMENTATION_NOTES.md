# 2025 구현 기록

## 1차 구현

- 기준 계획: `plan.md`
- 구현 방식: 독립 Next.js App Router 앱 스캐폴딩
- 신규 라우트:
  - `/admin/dashboard`
  - `/admin/forms`
  - `/admin/forms/new`
  - `/admin/forms/[id]`
  - `/admin/forms/prompts`
  - `/admin/templates`
  - `/admin/templates/[id]`
  - `/workspace`
  - `/workspace/meta-translation`
  - `/workspace/cart`
  - `/workspace/checkout`
  - `/workspace/files`
  - `/upload-classification/upload`
  - `/upload-classification/review`

## 기준 자료

- `../../figma_pdf/2025/창작작업실01.png`
- `../../figma_pdf/2025/메타번역.png`
- `../../figma_pdf/2025/기본화면_파일업로드.jpg`
- `../../figma_pdf/2025/장바구니.png`
- `../../figma_pdf/2025/결제.png`
- `../../figma_pdf/2025/양식관리.pdf`
- `../../figma_pdf/2025/템플릿 양식 관리자.pdf`

## 2024 대비

- 기존 구현 코드가 없어 2024 재사용은 구조 계획만 반영했다.
- 관리자 레일, 검색 헤더, 필터/테이블 밀도는 2024 계획의 공통 관리자 패턴을 2025 신규 화면에 맞춰 구현했다.
- 창작작업실, 메타번역, 장바구니, 결제는 2025 PNG 기준으로 1차 UI를 직접 재현했다.
