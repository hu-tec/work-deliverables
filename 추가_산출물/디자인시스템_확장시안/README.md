# 휴텍씨 디자인 시스템 작업물

이 저장소는 휴텍씨 디자인 시스템 문서와 별도 검증용 화면을 보관합니다.

## 주요 파일

| 파일 | 설명 |
|---|---|
| `index.html` | dense Drawer와 밀도 강화 기준이 반영된 현재 기준 디자인 시스템 |
| `design-system-ver2-dense-drawer.html` | ver2 문서 구조에 dense Drawer 규칙을 적용한 별도 확인용 화면 |
| `layout.css` | 기존 공통 토큰과 컴포넌트 스타일 |
| `common.js` | 기존 디자인 시스템 상호작용 |
| `design-system-v3-dense-drawer.html` | 새로 분리한 ver3 밀도 강화 및 회원 Drawer 테스트 화면 |
| `dense-drawer.css` | 현재 `index.html`과 별도 샘플에서 쓰는 밀도 강화/Drawer 스타일 |
| `dense-drawer.js` | 현재 `index.html`과 별도 샘플에서 쓰는 검색 필터와 회원 Drawer 상호작용 |
| `table_design/관리자패널_전체회원.html` | DB v2 기준 회원목록 + inline 우측 Dense Drawer 적용 페이지 |
| `table_design/신규테이블관리.html` | 신규 DB 테이블 전환/비교용 BO 테이블 페이지 |
| `table_design/결제관리.html` | 결제/환불/정산 BO 테이블 페이지 |
| `table_design/table-design.css` | `table_design` 페이지 공통 BO 테이블, 고밀도 검색조건, inline Drawer 스타일 |
| `table_design/table-design.js` | `table_design` 페이지 공통 탭, 검색조건, 행 클릭 inline Drawer 상호작용 |
| `docs/디자인시스템_밀도강화_Drawer_프롬프트.md` | 밀도 강화/Drawer 설계·구현용 프롬프트 |
| `docs/DB_v2_신규테이블_페이지_프롬프트.md` | DB v2 기반 신규 테이블/검색조건/inline Drawer 제작 프롬프트 |
| `docs/회원상세내용_이미지분석_프롬프트.md` | `회원_상세내용.png` 분석 기반 회원 상세 작업영역 구현 프롬프트 |

## 이번에 추가된 내용

- 기존 디자인 시스템 오염을 막기 위해 ver3 화면을 `design-system-v3-dense-drawer.html`로 별도 분리했습니다.
- 검색/필터/체크박스 옵션이 적을 때 양끝으로 벌어지지 않는 `dense flow` 레이아웃을 추가했습니다.
- 검색바에 회원유형, 권한, 상태, 등급, 가입경로, 수신동의, 인증상태, 담당자, 정렬 등 다수 옵션 테스트 케이스를 넣었습니다.
- 활성 필터 태그와 `필터 전체 해제` 버튼이 오른쪽 끝으로 밀리지 않고 좌측 flow 안에서 자연스럽게 배치되도록 구성했습니다.
- 회원목록 상세 편집을 하단 아코디언이 아닌 우측 Drawer 패턴으로 별도 구현했습니다.
- Drawer는 목록 오른쪽 inline 컬럼으로 열리며, 열기/닫기, ESC 닫기, focus 복귀, 저장/삭제 토스트 예시를 포함합니다.
- Drawer 폭을 넓히고 기본 정보, 요약 카드, 권한 매트릭스, 타임라인, 태그, 체크리스트가 함께 차는 상세 패턴으로 확장했습니다.
- 본문에 카드, 메트릭, 미니 테이블, 태그 클라우드, 체크박스 flow 등 다양한 꽉 찬 레이아웃 케이스를 추가했습니다.
- Drawer 안에 회원정보가 적은 sparse 케이스와 회원속성이 아주 많은 attribute overflow 케이스를 추가했습니다.
- 최근 활동 타임라인은 항목 내부는 한 줄로 유지하되, 목록 전체는 2~4단 초밀도 로그 그리드로 펼치도록 변경했습니다.
- Drawer 기본 정보는 라벨과 입력필드를 별도 열로 나누지 않고 한 줄 row로 배치하는 규칙을 적용했습니다.
- ver2 문서 구조에 dense Drawer를 적용한 `design-system-ver2-dense-drawer.html` 확인용 버전을 추가했습니다.
- `design-system-ver2-dense-drawer.html`의 예시자료에도 ver3 밀도 강화 원칙, 전체 검색 옵션, 카드/목록 케이스, 체크박스 flow, 2~4단 로그 케이스, 회원 상세 Drawer 샘플을 이식했습니다.
- 위 적용본을 `index.html`에도 반영해 현재 기준 디자인 시스템으로 업데이트했습니다.
- 버튼/링크 컴포넌트 예시는 한 줄 반복 나열을 줄이고 매트릭스/역할별 조밀 목록으로 정리했습니다.
- `index.html` 좌측 사이드바에 `BO/DB` 분류를 추가하고, `table_design` 페이지와 `resource/DB_v2_HTML` 원본 참고 화면을 iframe 미리보기/새 탭 링크로 확인할 수 있게 했습니다.
- `table_design/관리자패널_전체회원.html`은 50명 회원 데이터, DB페이지 v2 기준 검색조건 전체, 행 클릭 inline 우측 Dense Drawer를 포함합니다.
- BO 회원 검색조건 CSS는 `dense-filter-flow` flex, `dense-filter-role-group` display contents, `dense-filter-group` flex, `legend 58px + dense-filter-options flex` 기준으로 정리했습니다.
- `table_design`의 회원 상세 Drawer는 테이블의 묶음 컬럼을 상세 화면에서 `이름`, `나이`, `성별`, `이메일`, `휴대폰`, `주소`, `국가`처럼 편집 가능한 단위로 다시 분리합니다.
- `회원_상세내용.png`를 기준으로 회원 상세 Drawer에 좌측 회원기본정보 마스터, 우측 상담/시험/결제/정산 작업영역을 추가했습니다.
- 선택된 회원 row는 배경색과 좌측 primary 인디케이터로 표시합니다.

## 확인 방법

브라우저에서 아래 파일을 직접 열어 확인합니다.

```text
design-system-v3-dense-drawer.html
```

현재 기준 디자인 시스템은 `index.html`에서 확인합니다.
BO/DB 관리자 테이블 페이지는 `index.html`의 `BO/DB` 사이드바 항목에서 확인하거나 아래 파일을 직접 엽니다.

```text
table_design/관리자패널_전체회원.html
table_design/신규테이블관리.html
table_design/결제관리.html
```

ver2 dense 적용 확인본은 아래 파일에도 남겨둡니다.

```text
design-system-ver2-dense-drawer.html
```

## 격리 원칙

- `index.html`은 dense Drawer와 밀도 강화 예시를 반영한 현재 기준 문서입니다.
- `index.html`의 `BO/DB` 섹션은 관리자 테이블 페이지 링크 허브입니다. 신규 BO 페이지를 만들면 이 섹션에 미리보기 링크를 추가합니다.
- `table_design` 페이지는 기존 `index.html`의 검색필터와 "회원목록 + 우측 Dense Drawer" 패턴을 BO 운영 화면에 적용한 별도 실물 페이지입니다.
- dense Drawer 샘플은 `index.html`, `design-system-v3-dense-drawer.html`, `design-system-ver2-dense-drawer.html`에서 확인합니다.
- ver2 적용 확인본은 `design-system-ver2-dense-drawer.html`로 별도 분리합니다.
- 공통 토큰은 `layout.css`를 링크해서 재사용하고, 밀도 강화/Drawer 전용 스타일은 `dense-drawer.css`에 작성합니다.
