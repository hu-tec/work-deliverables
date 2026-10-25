# vibecoding 화면 매핑 기록

## 기준 자료

| 디자인 파일 | 구현 라우트 | 구현 상태 |
| --- | --- | --- |
| `기본화면_파일업로드.jpg` | `/upload-classification/upload` | 구현 |
| `구분.pdf` | `/upload-classification/rules` | 구현 초안 |
| `구분-1.pdf` ~ `구분-14.pdf` | `/upload-classification/review`, `/upload-classification/results` | 상태/단계 초안 |
| `제목 없음.pdf` | `/upload-classification/history` | 이력 화면 후보 |

## PDF 상태/단계 매핑 초안

현재 환경에서 PDF 렌더링 도구가 없어 `구분` PDF 15개는 파일명 기준의 1차 매핑으로 남긴다. 구현은 업로드 기본화면 JPG에서 확인된 관리자 레이아웃, 필터 패널, 체크박스 밀도, 결과 테이블 구조를 우선 반영했다.

| 단계 | 상태 | 라우트 | 테스트 |
| --- | --- | --- | --- |
| 파일 업로드 | `idle`, `uploading`, `uploaded`, `failed` | `/upload-classification/upload` | `test/classification-state.test.ts` |
| 파일 검증 | `pending`, `validating`, `valid`, `invalid` | `/upload-classification/upload` | `test/components.test.tsx` |
| 구분 기준 선택 | 선택 조건, 검색 조건 | `/upload-classification/rules` | `test/classification-state.test.ts` |
| 구분 처리 | `pending`, `running`, `complete`, `failed` | `/upload-classification/review` | `test/classification-state.test.ts` |
| 결과 검수 | `not-started`, `in-review`, `needs-changes`, `complete` | `/upload-classification/review` | `test/components.test.tsx` |
| 저장/반영 | `waiting`, `saved`, `applied`, `failed` | `/upload-classification/results` | `test/classification-state.test.ts` |
| 처리 이력 | 작업번호, 파일명, 상태, 최근 처리일 | `/upload-classification/history` | 화면 구현 |

## 2025 파일업로드 화면과의 비교

공통점:

- 좌측 아이콘 레일, 상단 검색, 우측 관리자/로그아웃 영역을 유지했다.
- `홈 > 회원관리` breadcrumb와 `회원관리` 제목 구조를 유지했다.
- 상단 탭, 선택 조건 패널, 대량 체크박스, 넓은 결과 테이블을 같은 작업면에 배치했다.
- 하단 일괄 액션과 파일 다운로드/저장 계열 버튼을 테이블 주변에 배치했다.

차이:

- vibecoding은 전체 회원관리 화면이 아니라 업로드-구분 모듈이므로 탭을 `파일업로드`, `구분기준`, `검수`, `결과`, `이력`으로 좁혔다.
- PDF 확정 전 단계라 결과 테이블 컬럼은 업로드/구분 처리에 필요한 최소 대표 컬럼으로 구성했다.
- 실제 파일 첨부 대신 테스트 가능한 파일명/크기 입력 컨트롤로 업로드 검증 상태를 재현했다.

## 의도적 미확정 항목

- `구분-1.pdf` ~ `구분-14.pdf`가 단일 화면 상태 변화인지 단계별 플로우인지는 PDF 렌더링 확인 후 확정한다.
- 실제 업로드 파일 형식, 최대 크기, 관리자 도메인 반영 대상은 현재 테스트 모델에서 `csv/xls/xlsx`, `20MB`로 가정했다.
- CheckBox PNG는 CSS 기본 체크박스로 대체했다. 픽셀 비교 단계에서 필요하면 이미지 에셋으로 교체한다.
