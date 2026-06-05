# BO 영역 참고 기반 디자인 시스템 index 고도화 프롬프트

## 목적

`resource/design_system_bo참고.png`와 `resource/영역참고.png`를 기준으로 `index.html`을 고도화한다.  
목표는 현재 디자인 시스템 문서를 유지하면서, BO 관리자 화면에서 실제로 필요한 정보 밀도, 영역 구조, 컴포넌트 상태, 업무 패턴을 더 명확히 문서화하는 것이다.

## 참고 이미지 해석

### `resource/design_system_bo참고.png`

- BO 화면은 좌측 메뉴, 상단 업무 바, 본문 작업 영역, 우측/하단 보조 정보 영역이 동시에 보이는 고밀도 구조다.
- 테이블, 필터, 검색, 상태 선택, 업무 메모, 금액/정산 정보, 스크롤 영역이 한 화면에 공존한다.
- 장식보다 반복 업무 효율이 중요하다.
- 색상은 흰색, 회색, 옅은 파랑, 상태 색상 위주로 제한한다.
- 컴포넌트는 작고 조밀해야 하며, border, divider, table line, status badge가 주요 시각 구분 수단이다.

### `resource/영역참고.png`

- 디자인 시스템 문서는 단일 컴포넌트 나열이 아니라 영역별 기준을 제공해야 한다.
- 주요 영역은 공통 개념 DB, 실제 서비스 화면 입력 폼, 운영 관리 통계/상태, 권한/보안 정책, 감사 로그/운영 이력, 사이트 미리보기 등으로 나뉜다.
- BO 설계 시 화면을 Header, Sidebar, Content, Toolbar, Filter, Table, Detail Drawer, Status Panel, Log Panel, Preview 영역으로 구분해야 한다.
- 각 영역별로 목적, 포함 컴포넌트, 상태값, 접근성, 반응형 처리 기준을 문서화해야 한다.

## 기준 프롬프트

```text
너는 시니어 프론트엔드 엔지니어이자 디자인 시스템 아키텍트다.

현재 레포지토리의 `design_system_major/index.html`을 고도화해라.
작업 기준은 `resource/design_system_bo참고.png`와 `resource/영역참고.png`다.

목표:
- 기존 `index.html`의 섹션, 컴포넌트 예시, 문서 톤을 보존한다.
- BO 관리자 화면에서 바로 재사용할 수 있는 영역별 디자인 시스템 기준을 추가한다.
- 단순 UI 샘플이 아니라 실제 운영 화면을 만들 때 필요한 레이아웃, 상태, 컴포넌트 조합, 접근성 기준까지 문서화한다.
- `layout.css`, `dense-drawer.css`, `dense-drawer.js`, `common.js`의 기존 패턴을 먼저 확인하고, 새 스타일은 기존 토큰과 클래스 체계에 맞춘다.

반드시 먼저 확인할 파일:
- `index.html`
- `layout.css`
- `dense-drawer.css`
- `dense-drawer.js`
- `common.js`
- `docs/사이드바_기준_프롬프트.md`
- `docs/BO_사이드바_분류_정리계획.md`
- `resource/design_system_bo참고.png`
- `resource/영역참고.png`

고도화 방향:
1. `index.html`의 현재 내비게이션 구조를 유지하되, BO 화면 기준을 찾기 쉽게 보강한다.
   - Foundation, Components, Pages, 고도화 탭 중 어디에 넣을지 판단한다.
   - 필요하면 `Pages` 또는 `고도화` 영역에 BO 화면 영역 가이드 섹션을 추가한다.
   - 현재 기준에서는 좌측 사이드바에 `BO/DB` 분류를 별도로 두고, 관리자 테이블 실물 페이지와 DB v2 원본 참고 화면을 iframe 미리보기/새 탭 링크로 제공한다.
   - 새 BO 페이지를 추가하면 `index.html`의 `BO/DB 페이지 보기` 목록에 `data-page-src`, `data-page-title` 버튼을 추가한다.
   - 섹션 탭과 앵커 링크가 깨지지 않게 한다.

2. BO 레이아웃 영역 기준을 추가한다.
   - Header: 상단 업무 바, 현재 업무명, 저장/닫기/상태 액션
   - Sidebar: 1depth/2depth 메뉴, active, collapsed, 권한 메뉴 분리
   - Content: 본문 업무 영역, 제목, 보조 설명, 작업 단위 구획
   - Toolbar: 검색, 필터, 보기 전환, 엑셀, 일괄 처리
   - Filter Panel: 기본 검색, 고급 검색, 날짜 범위, 상태, 담당자, 분류
   - Data Table: 조밀한 행 높이, 고정 헤더, 상태 컬럼, 금액/날짜/담당자, row action
   - Detail Drawer: 목록을 유지한 채 상세 확인/수정. 회원목록은 `index.html`의 "회원목록 + 우측 Dense Drawer"처럼 오버레이가 아닌 inline 우측 컬럼으로 열리는 패턴을 우선한다.
   - Status Panel: 처리 현황, 접수/결제/채점/발급 상태
   - Log Panel: 변경 이력, 감사 로그, 처리 메모
   - Preview Area: 사이트/신청서/문서 미리보기

3. BO 컴포넌트 기준을 보강한다.
   - Button: primary, secondary, ghost, danger, icon, compact, disabled, loading
   - Input/Search: compact input, search with button, date range, select, textarea
   - Filter Chip: 선택된 조건, 삭제, 전체 초기화
   - Status Badge: 접수, 진행, 완료, 보류, 실패, 취소, 위험
   - Data Table: dense, selectable, sortable, sticky column, horizontal scroll, empty state
   - Pagination: compact page 이동, page size 선택
   - Bulk Action Toolbar: 선택 개수, 일괄 상태 변경, 엑셀 다운로드
   - Drawer: 상세 요약, 탭, 메모, 이력, 저장/닫기 액션
   - Modal/Toast: 확인, 경고, 저장 완료, 실패 알림
   - KPI/Stats: 처리 건수, 결제 금액, 미처리, 오류, 완료율

4. 시각 기준은 BO 고밀도 화면에 맞춘다.
   - border-radius는 기본 0으로 유지한다.
   - 과한 카드형 UI, 넓은 여백, 큰 히어로 타이포그래피를 사용하지 않는다.
   - 표, 리스트, 구획선, 탭, 패널 중심으로 조밀하게 정리한다.
   - 한 화면에서 검색, 목록, 상세, 상태, 로그가 동시에 보일 수 있는 구조를 우선한다.
   - 브랜드 색상은 active, primary action, 정보 강조에만 제한적으로 사용한다.
   - 상태 색상은 success, warning, danger, info 의미가 일관되게 보이도록 한다.

5. 영역별 문서화 방식을 추가한다.
   각 BO 영역은 아래 형식으로 정리한다.
   - 영역명
   - 목적
   - 포함 컴포넌트
   - 주요 상태
   - 사용하면 좋은 화면
   - 피해야 할 사용
   - 접근성 체크
   - 반응형 처리

6. 실제 화면 예시를 추가한다.
   `resource/design_system_bo참고.png`처럼 하나의 BO 운영 화면 예시를 `index.html` 안에 추가한다.
   예시는 아래 영역을 포함해야 한다.
   - 좌측 Sidebar
   - 상단 Toolbar
   - 검색/필터 패널
   - 데이터 테이블
   - 우측 또는 오버레이 Detail Drawer
   - 상태 요약 패널
   - 변경 이력/메모 패널

7. `resource/영역참고.png`의 영역 구성을 반영한 문서 섹션을 추가한다.
   예시 영역:
   - 공통 개념/DB 기준
   - 실제 서비스 화면 입력 폼
   - 운영 관리 통계/상태
   - 권한/보안 정책
   - 감사 로그/운영 이력
   - 사이트 미리보기
   각 영역은 단순 이미지 설명이 아니라, 디자인 시스템에서 어떤 컴포넌트와 패턴으로 구현해야 하는지 연결해라.

8. 접근성과 반응형 기준을 함께 보강한다.
   - 모든 인터랙션 요소는 키보드 접근이 가능해야 한다.
   - focus 상태는 보이게 유지한다.
   - Drawer와 Modal은 열림/닫힘, focus 이동, ESC 닫기, 닫은 뒤 focus 복귀를 고려한다.
   - 테이블은 모바일에서 무리하게 카드로 바꾸기보다, 핵심 컬럼 축약과 가로 스크롤 기준을 명시한다.
   - 상태 색상은 텍스트나 아이콘 없이 색상만으로 의미를 전달하지 않는다.

구현 기준:
- 기존 내용은 삭제하지 않는다.
- 중복 스타일이 생기면 `layout.css` 또는 `dense-drawer.css`의 기존 패턴에 맞춰 정리한다.
- `index.html` 내부 `<style>`에 임시 스타일을 추가할 수 있지만, 반복 사용 가치가 있으면 공통 CSS로 이동한다.
- 새 JS가 필요하면 `common.js` 또는 `dense-drawer.js`의 기존 이벤트 패턴을 따른다.
- 클래스명은 의미 기반으로 작성하고, 기존 `ds`, `bo`, `drawer`, `table`, `filter`, `status` 계열 네이밍과 충돌하지 않게 한다.
- 불필요한 프레임워크, 빌드 도구, 외부 라이브러리를 추가하지 않는다.

산출물:
1. `index.html` 고도화 반영
2. 필요한 경우 `layout.css`, `dense-drawer.css`, `common.js` 최소 수정
3. BO 영역별 디자인 시스템 가이드 섹션
4. BO 운영 화면 조합 예시
5. 컴포넌트 상태/variant 보강
6. 접근성/반응형 체크리스트

검증:
- 브라우저에서 `index.html`을 열었을 때 기존 섹션 이동과 탭 전환이 정상 동작해야 한다.
- 새로 추가한 앵커와 내비게이션이 연결되어야 한다.
- 데스크톱에서 BO 예시 화면이 조밀하지만 읽을 수 있어야 한다.
- 모바일에서 텍스트 겹침, 버튼 넘침, 테이블 영역 깨짐이 없어야 한다.
- Drawer, Modal, Toast 등 기존 상호작용이 망가지지 않아야 한다.

마지막 응답에는 아래 항목을 요약해라.
- 수정한 파일
- 추가한 BO 영역 기준
- 추가/보강한 컴포넌트
- 검증 결과
- 남은 후속 작업
```

## 축약 실행 프롬프트

```text
`resource/design_system_bo참고.png`와 `resource/영역참고.png`를 기준으로 `design_system_major/index.html`을 고도화해라.
기존 디자인 시스템 문서와 컴포넌트 예시는 삭제하지 말고, BO 관리자 화면용 영역 가이드와 고밀도 운영 화면 예시를 추가한다.

추가할 핵심:
- Header, Sidebar, Content, Toolbar, Filter, Data Table, Detail Drawer, Status Panel, Log Panel, Preview Area 영역 기준
- 각 영역의 목적, 포함 컴포넌트, 상태, 접근성, 반응형 기준
- BO용 compact button/input/select/filter chip/status badge/data table/pagination/bulk action/drawer/modal/toast/KPI 컴포넌트 기준
- `design_system_bo참고.png`처럼 검색, 필터, 목록, 상세, 상태, 로그가 한 화면에 공존하는 BO 운영 화면 예시
- `영역참고.png`처럼 공통 개념 DB, 실제 서비스 입력 폼, 운영 통계/상태, 권한/보안, 감사 로그, 사이트 미리보기 영역을 문서화

시각 원칙:
- border-radius는 0
- 장식보다 정보 밀도와 반복 업무 효율 우선
- 표, 리스트, 구획선, 탭, 패널 중심
- 색상은 제한적으로 사용하고 상태 의미는 텍스트와 함께 표시
- 모바일에서는 핵심 컬럼 축약과 가로 스크롤 기준을 명시

기존 `layout.css`, `dense-drawer.css`, `dense-drawer.js`, `common.js` 패턴을 우선 사용하고, 불필요한 외부 라이브러리나 대규모 리팩터링은 하지 않는다.
```
