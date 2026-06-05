# BO 거래처 아웃콜 index 개선 프롬프트

## 목적

현재 폴더의 거래처 아웃콜 화면을 `design_system_major`의 BO 관련 문서와 샘플을 참고해 고밀도 관리자 화면 스타일로 개선한다.

기능과 데이터 구조는 유지하면서, 반복 업무자가 검색, 필터, 목록 확인, 상태 변경, 메모 확인, 상세 편집을 빠르게 처리할 수 있는 운영 도구 화면으로 정리하는 것이 목표다.

## 참고 우선순위

### 1순위. 재사용 디자인 프롬프트 관리자 기준

가장 먼저 아래 관리자 재사용 디자인 프롬프트를 읽고 적용한다. `design_system_bo참고.png`보다 이 문서 묶음을 우선한다.

- `../design_system_major/docs/재사용_디자인_프롬프트/관리자/00_문서목록.md`
- `../design_system_major/docs/재사용_디자인_프롬프트/관리자/03_BO_관리자화면_기준.md`
- `../design_system_major/docs/재사용_디자인_프롬프트/관리자/02_BO_테이블레이아웃_기준.md`
- `../design_system_major/docs/재사용_디자인_프롬프트/관리자/04_BO_관리자용_레이아웃_기준.md`

### 2순위. BO 테이블과 Drawer 컴포넌트 기준

거래처 아웃콜은 대량 목록, 행 선택, 메모/상태 상세 편집이 핵심이므로 BO 테이블과 Drawer 기준을 반드시 함께 적용한다.

- `../design_system_major/docs/재사용_디자인_프롬프트/관리자/components/검색필터_기준.md`
- `../design_system_major/docs/재사용_디자인_프롬프트/관리자/components/상태_유형_칩_기준.md`
- `../design_system_major/docs/재사용_디자인_프롬프트/관리자/components/인라인_Drawer_기준.md`
- `../design_system_major/docs/재사용_디자인_프롬프트/관리자/components/테이블선택_Drawer_상세패널_기준.md`

### 3순위. 실물 BO 테이블 구현 샘플

문서 기준을 실제 코드와 화면 밀도로 확인할 때 아래 파일을 참고한다.

- `../design_system_major/table_design/관리자패널_전체회원.html`
- `../design_system_major/table_design/신규테이블관리.html`
- `../design_system_major/table_design/결제관리.html`
- `../design_system_major/table_design/table-design.css`
- `../design_system_major/table_design/table-design.js`
- `../design_system_major/dense-drawer.css`
- `../design_system_major/dense-drawer.js`

### 4순위. 보조 참고 이미지와 기존 BO 문서

- `../design_system_major/docs/BO_영역참고_디자인시스템_index_고도화_프롬프트.md`
- `../design_system_major/docs/BO_사이드바_분류_정리계획.md`
- `../design_system_major/bo-index-sample.html`
- `../design_system_major/bo_sidebar_classification_sample.html`
- `../design_system_major/resource/design_system_bo참고.png`

`design_system_bo참고.png`는 화면 분위기와 영역 밀도 참고용이다. 구체적인 테이블, Drawer, 필터, 상태 chip, 레이아웃 기준은 `재사용_디자인_프롬프트/관리자` 문서를 우선한다.

## 대상 파일

- 현재 폴더에 `index.html`이 있으면 `index.html`을 수정한다.
- `index.html`이 없으면 `HutechC 사내 Studio.html`을 현재 화면 원본으로 보고 개선한다.
- 필요하면 개선본을 `index.html`로 생성한다.

## 실행 프롬프트

```text
너는 시니어 프론트엔드 엔지니어이자 BO 관리자 화면 디자인 시스템 전문가다.

현재 작업 폴더의 HTML 파일을 `design_system_major`의 BO 관련 문서를 참고해 고밀도 BO 화면 스타일로 개선해라.

참고 우선순위:
1. 가장 먼저 `재사용_디자인_프롬프트/관리자` 문서를 적용한다.
2. 그다음 BO 테이블, 검색필터, 상태 chip, inline Drawer, 테이블 선택 Drawer 상세패널 기준을 적용한다.
3. 그다음 `table_design` 실물 BO 테이블 페이지와 `dense-drawer` 구현을 참고한다.
4. `design_system_bo참고.png`는 분위기와 영역 배치 보조 참고로만 사용한다.

반드시 먼저 읽을 파일:
- ../design_system_major/docs/재사용_디자인_프롬프트/관리자/00_문서목록.md
- ../design_system_major/docs/재사용_디자인_프롬프트/관리자/03_BO_관리자화면_기준.md
- ../design_system_major/docs/재사용_디자인_프롬프트/관리자/02_BO_테이블레이아웃_기준.md
- ../design_system_major/docs/재사용_디자인_프롬프트/관리자/04_BO_관리자용_레이아웃_기준.md
- ../design_system_major/docs/재사용_디자인_프롬프트/관리자/components/검색필터_기준.md
- ../design_system_major/docs/재사용_디자인_프롬프트/관리자/components/상태_유형_칩_기준.md
- ../design_system_major/docs/재사용_디자인_프롬프트/관리자/components/인라인_Drawer_기준.md
- ../design_system_major/docs/재사용_디자인_프롬프트/관리자/components/테이블선택_Drawer_상세패널_기준.md

실물 구현 참고 파일:
- ../design_system_major/table_design/관리자패널_전체회원.html
- ../design_system_major/table_design/신규테이블관리.html
- ../design_system_major/table_design/결제관리.html
- ../design_system_major/table_design/table-design.css
- ../design_system_major/table_design/table-design.js
- ../design_system_major/dense-drawer.css
- ../design_system_major/dense-drawer.js

보조 참고 파일:
- ../design_system_major/docs/BO_영역참고_디자인시스템_index_고도화_프롬프트.md
- ../design_system_major/docs/BO_사이드바_분류_정리계획.md
- ../design_system_major/bo-index-sample.html
- ../design_system_major/bo_sidebar_classification_sample.html
- ../design_system_major/resource/design_system_bo참고.png

대상:
- 현재 폴더에 `index.html`이 있으면 그것을 수정한다.
- `index.html`이 없으면 `HutechC 사내 Studio.html`을 현재 화면 원본으로 보고, 필요한 경우 `index.html`로 생성/정리한다.

목표:
- 현재 거래처 아웃콜 화면의 기능과 데이터 구조는 유지한다.
- BO 관리자 화면답게 정보 밀도, 표 가독성, 필터/검색/상태/메모/상세 영역을 더 명확히 만든다.
- 장식적 랜딩 페이지처럼 만들지 말고, 반복 업무자가 오래 쓰는 운영 도구처럼 정리한다.
- 기존 React 빌드 산출물 구조를 무리하게 해체하지 말고, HTML/CSS 레벨에서 적용 가능한 개선을 우선한다.
- `design_system_bo참고.png`의 시각 분위기보다 `재사용_디자인_프롬프트/관리자`의 구조, 밀도, 컴포넌트 기준을 우선한다.

디자인 기준:
- border-radius는 기본 0 또는 매우 작게 유지한다.
- 그림자보다 1px border, divider, table line으로 구획한다.
- 색상은 흰색, 회색, 옅은 파랑, 상태 색상 중심으로 제한한다.
- 큰 카드, 넓은 여백, 히어로 스타일, 과한 그라데이션은 사용하지 않는다.
- 폰트 크기와 행 높이는 BO 화면에 맞게 compact하게 유지하되 읽을 수 있어야 한다.
- 버튼, 입력창, 필터, 배지, 테이블 행, 툴바는 조밀하고 정렬감 있게 만든다.

반영할 BO 구조:
- 좌측 Sidebar: 1depth/2depth 기준, active 상태 명확화
- 상단 Header/Toolbar: 현재 업무명, 검색, 필터, 저장/추가/내보내기 액션
- Content: 거래처 아웃콜 목록 중심
- Dense Filter: `검색필터_기준.md`의 고밀도 필터 구조를 적용한다.
- BO Data Table: `02_BO_테이블레이아웃_기준.md`와 `table_design` 실물 페이지의 밀도를 따른다.
- Inline Drawer: `인라인_Drawer_기준.md`와 `테이블선택_Drawer_상세패널_기준.md`를 따른다.
- Status Panel: 대기/진행/완료/보류 등 처리 현황 요약
- Log/Memo Panel: 변경 이력, 업무 메모, 후속 조치 기록

거래처 아웃콜 화면에 맞춘 개선 포인트:
- 테이블 컬럼은 날짜, 분야, 거래처/회사명, 담당자, 연락처, 상태, 메모, 액션이 한눈에 보이게 정리한다.
- BO 테이블 컬럼은 무작정 쪼개지 말고 `02_BO_테이블레이아웃_기준.md`의 컬럼 묶음 원칙을 따른다.
- 거래처/담당자/연락처/분야/상태/최근메모처럼 비교 빈도가 높은 값은 우선 노출하고, 긴 메모와 이력은 Drawer로 보낸다.
- 상태값은 색상만으로 구분하지 말고 텍스트와 함께 표시한다.
- 긴 메모는 truncate 처리하되 title 또는 상세 패널에서 전체 확인 가능하게 한다.
- 행 hover, 선택 상태, 편집/삭제 버튼 상태가 명확해야 한다.
- 필터 선택 chip과 초기화 액션을 제공한다.
- 모바일에서는 핵심 컬럼만 우선 보이고, 테이블은 가로 스크롤 기준으로 깨지지 않게 한다.

BO 테이블 필수 기준:
- Major Tabs와 Sub Tabs가 필요한 경우 카운트를 라벨 안에 포함한다.
- Dense Filter는 조건명 폭, 옵션 wrap, 선택 조건 tag를 정렬감 있게 유지한다.
- Summary Strip은 큰 카드 대신 한 줄 요약으로 구성한다.
- Table Card는 headbar, table-wrap, table-section 구조를 참고한다.
- 행 전체를 클릭 대상으로 만들고, 선택 행은 primary 배경/좌측 indicator로 구분한다.
- 선택 건수, 상태변경, 엑셀 내보내기 등 bulk action bar를 하단에 둔다.

Inline Drawer 필수 기준:
- 행 클릭 시 우측 inline Drawer 또는 테이블 선택 상세 패널을 연다.
- Overlay modal보다 목록 오른쪽에 붙는 inline Drawer를 우선한다.
- Drawer에는 기본정보, 연락/상담 메모, 상태 변경, 후속 액션, 변경 이력을 포함한다.
- Drawer가 열려도 목록 맥락이 유지되어야 한다.
- 닫기, 저장, 삭제/위험 액션, ESC 닫기, focus 복귀를 고려한다.

접근성 기준:
- 모든 버튼과 입력 요소는 focus-visible 상태가 보여야 한다.
- 아이콘 버튼에는 title 또는 aria-label을 유지한다.
- 상태 배지는 텍스트를 포함한다.
- Drawer/Panel을 추가하면 닫기 버튼과 키보드 접근을 고려한다.
- 텍스트가 버튼이나 셀 밖으로 넘치지 않게 한다.

구현 기준:
- 기존 내용을 임의로 삭제하지 않는다.
- 외부 라이브러리나 빌드 도구를 새로 추가하지 않는다.
- 가능한 한 현재 HTML과 연결된 CSS 구조를 유지한다.
- 필요한 CSS는 별도 `<style>` 또는 기존 CSS 파일에 최소 범위로 추가한다.
- 디자인 시스템 문서의 BO 샘플처럼 고밀도 운영 화면을 목표로 한다.

검증:
- 브라우저에서 열었을 때 화면이 깨지지 않아야 한다.
- 데스크톱에서 테이블, 필터, 상태, 메모 영역이 동시에 읽혀야 한다.
- 모바일 폭에서 텍스트 겹침과 버튼 넘침이 없어야 한다.
- 기존 JS 로딩과 화면 렌더링을 방해하지 않아야 한다.

마지막 응답에는 다음을 요약한다:
- 수정/생성한 파일
- 적용한 BO 디자인 시스템 기준
- 개선한 화면 영역
- 검증 결과
- 남은 후속 작업
```

## BO 개선 체크리스트

- [ ] `index.html` 또는 `HutechC 사내 Studio.html` 대상 확인
- [ ] 기존 화면 기능과 데이터 구조 보존
- [ ] 좌측 Sidebar active/분류 구조 점검
- [ ] 상단 Toolbar와 검색/필터 영역 정리
- [ ] 거래처 아웃콜 테이블 dense 스타일 개선
- [ ] 상태 배지와 row action 명확화
- [ ] 상세 Drawer 또는 상세 Panel 기준 반영
- [ ] 메모/로그/상태 요약 영역 보강
- [ ] 모바일 가로 스크롤과 텍스트 넘침 확인
- [ ] 기존 JS 렌더링 영향 확인
