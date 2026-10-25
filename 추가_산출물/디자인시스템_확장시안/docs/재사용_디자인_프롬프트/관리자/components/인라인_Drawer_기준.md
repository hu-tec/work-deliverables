# 인라인 Drawer 기준

기준 파일: `dense-drawer.css`, `dense-drawer.js`, `table_design/table-design.css`, `table_design/table-design.js`

이 문서는 회원 상세, 결제 상세, 매칭 상세처럼 목록 행에서 상세 작업영역을 열 때 적용한다.

## 원칙

- Drawer는 기본적으로 overlay modal이 아니라 작업영역 오른쪽에 붙는 inline panel이다.
- 기본 열림 상태의 `.table-detail-drawer`는 작업영역 기준 50% 이상을 사용한다. 테이블 맥락을 유지하되 상세 입력, 메모, 이력 패널이 좁아지지 않게 `clamp(560px, 52vw, 820px)`처럼 최소 폭과 비율 폭을 함께 둔다.
- 사용자가 목록과 상세를 동시에 비교할 수 있어야 한다.
- 선택된 행은 table row에서 시각적으로 강조한다.
- Drawer는 닫기, ESC 닫기, 저장, focus 복귀를 포함한다.
- 넓게보기 상태에서는 목록을 접고 상세 작업영역이 전체 폭을 사용할 수 있다.

## 레이아웃 구조

```html
<div class="table-workspace" data-table-workspace>
  <section class="table-card">...</section>
  <aside class="table-detail-drawer" role="dialog" aria-modal="false">
    <form class="table-detail-panel">
      <header class="table-detail-head">...</header>
      <div class="table-detail-body">...</div>
      <footer class="table-detail-actions">...</footer>
    </form>
  </aside>
</div>
```

## 열림 상태

- `table-workspace.is-drawer-open`을 추가한다.
- 선택 행에는 `tr.is-open`을 추가한다.
- wide 상태는 `table-workspace.is-drawer-wide`를 추가한다.
- Drawer가 닫히면 선택 행 강조와 wide 상태를 제거한다.

## 상세 정보 재구성

목록에서는 묶음 컬럼을 유지하되, Drawer에서는 편집 가능한 단위로 분리한다.

목록 셀:
- 이름 / 나이·성별
- 이메일 / 휴대폰
- 주소 / 국가
- 회원유형 / 구독상태
- 매칭 / 상태
- 결제 / 상태

Drawer 필드:
- 이름
- 나이
- 성별
- 이메일
- 휴대폰
- 주소
- 국가
- 회원유형
- 구독상태
- 매칭상태
- 결제상태
- 운영 메모

## Drawer 내부 구성

필수:
- 제목, 요약, 닫기 버튼
- 기본 정보 섹션
- 이용 상태 섹션
- 운영 메모
- 닫기/저장 액션

선택:
- 좌측 회원기본정보 마스터
- 상담/시험/결제/정산 작업영역
- 타임라인
- 태그
- 체크리스트
- 권한 매트릭스

## 접근성

- `role="dialog"`를 사용한다.
- inline Drawer는 `aria-modal="false"`를 사용한다.
- 제목은 `aria-labelledby`로 연결한다.
- 닫기 버튼은 `aria-label`을 제공한다.
- ESC로 닫는다.
- 닫은 뒤에는 열었던 행 또는 버튼으로 focus를 복귀한다.

## 금지

- 행 아래에 아코디언처럼 상세 row를 길게 펼치지 않는다.
- 상세 버튼 전용 컬럼을 반드시 만들려고 하지 않는다. 행 전체 클릭을 우선한다.
- Drawer를 열었을 때 어떤 행이 선택되었는지 표시하지 않는 상태를 만들지 않는다.
- sparse 데이터에서 빈 영역을 크게 남기지 않는다. 운영 메모와 상태 변경 action을 붙인다.
