# 테이블 선택 Drawer 상세패널 기준

기준 파일: `table_design/관리자패널_전체회원.html`, `table_design/table-design.css`, `table_design/table-design.js`

이 문서는 관리자 테이블에서 행을 선택했을 때 우측에 열리는 상세 Drawer UI를 만들 때 적용한다. 단순 정보 보기 Drawer가 아니라, 선택된 행의 핵심 정보 확인, 상태 판단, 상담/시험/결제/정산 처리, 운영 메모 저장까지 한 화면에서 수행하는 작업 패널 기준이다.

## 적용 범위

- 대량 테이블에서 행을 클릭하거나 Enter/Space로 선택했을 때 열리는 우측 상세 영역
- `table-workspace` 안에서 테이블 오른쪽 컬럼으로 붙는 inline Drawer
- 회원, 결제, 매칭, 시험, 문의 등 운영자가 행 단위로 상세 처리하는 BO 화면
- 회원 상세처럼 좌측 마스터 정보와 우측 업무 패널이 동시에 필요한 화면

## 기본 동작

- 테이블 행은 `role="button"`, `tabIndex="0"`, `aria-controls="table-detail-drawer"`를 가진다.
- 행 클릭, Enter, Space로 Drawer를 연다.
- Drawer가 열리면 `table-workspace.is-drawer-open`을 적용하고, 선택 행에는 `tr.is-open`을 적용한다.
- 기본 열림 상태의 `.table-detail-drawer`는 작업영역 기준 50% 이상을 사용한다. 상세 작업 패널은 단순 보기 영역이 아니라 상태 변경, 상담/메모 입력, 이력 확인을 수행하므로 좁은 보조 패널로 만들지 않는다.
- Drawer는 `role="dialog"`, `aria-modal="false"`로 둔다. Overlay modal이 아니라 테이블과 같은 작업 맥락 안에 붙는 패널이다.
- 닫기 버튼과 Escape로 닫는다.
- 닫을 때 `is-drawer-open`, `is-drawer-wide`, `tr.is-open`을 제거하고 포커스를 선택했던 행으로 돌린다.
- `넓게보기`를 누르면 `table-workspace.is-drawer-wide`를 적용해 테이블을 숨기고 Drawer를 전체 작업폭으로 확장한다.

## Drawer 전체 구조

```text
table-detail-drawer
  table-detail-panel
    table-detail-head
      drawer-kicker
      table-detail-title
      detail-summary
      넓게보기 / 닫기
    table-detail-body
      drawer-section-stack
        member-master-detail 또는 일반 detail section
      운영 메모
    table-detail-actions
      닫기 / 저장
```

회원 테이블처럼 `이름`과 `이메일`이 있는 행은 일반 field 묶음이 아니라 `member-master-detail`을 사용한다.

## 회원 상세 Drawer 패널 구성

실제 HTML 구조는 `table_design/관리자패널_전체회원.html`의 상세 Drawer 영역을 최우선으로 참고한다. 특히 `member-master-detail`, `member-master-titlebar`, `member-master-grid`, `member-profile-panel`, `member-work-panel` 구조를 따른다. 기본 Drawer는 좌측 마스터 정보와 우측 작업 패널의 2열 구조를 유지하고, 넓게보기에서는 우측 작업 패널 내부 모듈을 4단 grid로 확장한다.


회원 상세는 `회원기본정보 마스터`와 `회원 작업 패널`의 2열 구조를 기본으로 한다.

```text
member-master-detail
  member-master-titlebar
  member-master-grid
    member-profile-panel
    member-work-panel
```

### 좌측: 회원기본정보 마스터

좌측 패널은 선택된 회원을 식별하고, 다른 업무 패널을 해석하는 기준값을 제공한다.

- 성명 / 영문
- 아이디
- 관리번호
- 이메일
- 휴대폰
- 거주지 / 국가
- 회원유형 / 구독상태
- 가입일 / 채널
- 전문가 레벨 / 평점
- 내국인/외국인 선택
- 회원 사용 목적
- 출제/번역, 수강등록, 시험접수, 전문가매칭 같은 사용 목적 체크

좌측 마스터 정보는 한 줄 라벨 + 입력 필드 구조를 유지한다. 라벨은 좁게, 값은 편집 가능한 field로 표시한다.

### 우측: 회원 작업 패널

우측 패널은 실제 운영 처리를 수행하는 영역이다.

- `member-dark-strip`: 현재 상담/업무 제목, 저장, 상담이력, 전환, 실패 상태
- `member-status-line`: 완료 상담일시, 최근 상담일시, 누적 이력 수
- `member-control-row`: 상담종목, 교육, 수강정보 같은 업무 선택값
- `member-case-box`: 상담결과 선택과 상담 메모
- `member-log-list`: 상담이력 피드 로그
- `member-lt-row`: LT 인터뷰 결과
- `member-data-table`: 시험/납부/증명서/결제/평가 상태 테이블
- `member-settlement-box`: 환급, 수수료, 정산 요약
- `member-memo-box`: 상담, 결제, 시험, 정산 이슈를 함께 기록하는 운영 메모

## 패널별 상태 UI

| 영역 | 상태 UI | 표시 기준 |
|---|---|---|
| Drawer 헤더 | `drawer-kicker`, `table-detail-title`, `detail-summary` | 현재 테이블 섹션명, 선택 행의 대표명, 관리번호를 표시 |
| 선택 행 | `tr.is-open` | 현재 Drawer에 연결된 행을 연한 배경과 좌측 인디케이터로 표시 |
| 제목 바 | `member-master-titlebar` | 회원명과 관리번호, 작업 목적을 어두운 헤더로 고정 표시 |
| 상단 상태 | `member-master-status` 안의 `status` | 상담상태, 매칭상태, 결제상태를 chip으로 표시 |
| 업무 액션 바 | `member-dark-strip` | 저장, 상담이력, 전환 같은 즉시 액션과 실패/위험 상태를 표시 |
| 상담 상태 선택 | `member-counsel-tabs button.active` | 현재 상담 결과를 선택 상태로 표시 |
| 상담 이력 | `member-log-list article` | 시간과 메모를 분리해 누적 로그로 표시 |
| LT 결과 | `member-lt-row` radio | P/F/미 등 단일 선택 상태로 표시 |
| 납부/시험 테이블 | `member-data-table` | 각 행의 시험, 결제, 평가, 수수료, 처리메모를 고밀도 표로 표시 |
| 정산 요약 | `member-settlement-box` | 환급/수수료/정산 금액을 강조하고 상세 메모를 붙임 |
| 운영 메모 | `member-memo-box` | 여러 패널에서 발생한 이슈를 최종 처리 메모로 통합 |

## 상태 chip 기준

상태값은 텍스트 색상만으로 처리하지 않는다. 반드시 `status` chip을 사용한다.

| 클래스 | 용도 | 예시 |
|---|---|---|
| `status ok` | 완료, 정상, 상담중, 처리 가능 | `상담중`, `완료`, `정상` |
| `status wait` | 대기, 미결제, 보류, 추가 확인 | `대기`, `미결제`, `정산대기` |
| `status fail` | 실패, 취소, 환불, 위험 | `FAIL`, `취소`, `환불` |
| `status info` | 일반 정보, 기본 상태, 정상 흐름 | `정상`, `검토중` |
| `status` 기본 | 외부 데이터에서 상태 성격을 아직 분류하지 못한 값 | 매칭상태 또는 결제상태 원문 |

상태가 업무 판단에 직접 영향을 주면 상단 상태 영역과 해당 패널 내부에 중복 노출해도 된다. 예를 들어 결제상태는 `member-master-status`에 요약으로 표시하고, 납부 상세 테이블에는 행별 상태로 다시 표시한다.

## 고정되는 정보

고정 정보는 선택 행이 바뀌어도 UI 위치와 의미가 유지되는 값이다. Drawer 안에서 항상 같은 영역에 둔다.

### Drawer 컨텍스트 고정 정보

- 현재 섹션명: `drawer-kicker`
- 선택 대상 제목: `table-detail-title`
- 선택 대상 식별 요약: `detail-summary`
- 닫기, 넓게보기, 저장 액션 위치

### 회원 마스터 고정 정보

- 관리번호
- 이름/성명
- 아이디
- 이메일
- 휴대폰
- 거주지/국가
- 회원유형/구독상태
- 가입일/가입채널

### 작업 패널 고정 정보

- 상담내용 제목 바
- 완료 상담일시
- 최근 상담일시
- 누적 상담 이력 수
- 상담종목/교육/수강정보 선택 컨트롤
- 운영 메모 위치

고정 정보는 Drawer 상단 또는 좌측 마스터에 배치한다. 화면을 스크롤해도 운영자가 "누구의 어떤 업무를 처리 중인지" 잃지 않게 해야 한다.

## 변동되는 정보

변동 정보는 선택된 행, 업무 상태, 처리 단계, 이력에 따라 계속 바뀌는 값이다. 같은 패널 안에서도 상태 변경과 입력이 가능해야 한다.

### 상태 변동 정보

- 상담상태: 상담중, 미상담, 완료, 다음등록, 부재, 기타
- 매칭상태: 완료, 대기, 취소, 검토중
- 결제상태: 정상, 미납, 환불, 정산대기
- 평가상태: 완료, 미결제, 대기
- 실패/위험 플래그: FAIL, 취소, 환불

### 업무 입력 변동 정보

- 상담 메모
- 상담 결과 선택
- 시험/납부 상세 테이블의 처리메모
- 환급/정산 메모
- 운영 메모
- 체크박스 사용 목적
- LT 인터뷰 결과

### 이력 변동 정보

- 상담이력 로그
- 최근 상담일시
- 총 이력 수
- 결제/환불/정산 테이블 행
- 시험 응시/평가 상태

변동 정보는 우측 작업 패널에 배치한다. 고정 식별 정보와 섞지 않고, 저장 전후로 어떤 값이 바뀌었는지 추적 가능하게 한다.

## 일반 테이블 Drawer fallback

회원 상세 조건이 아니면 `groupDrawerDetails()` 기준으로 값을 그룹화한다.

| 그룹 | 포함 값 |
|---|---|
| 기본 정보 | 관리번호, 이름, 나이, 성별, 등급 |
| 연락처 | 이메일, 휴대폰, 연락처, 주소, 국가 |
| 이용 상태 | 회원유형, 구독상태, 가입일, 가입채널, 최근 로그인, 체류시간, 전문가 레벨, 평점, 매칭상태, 결제상태 |
| 운영 정보 | 위 그룹에 속하지 않는 기타 값 |

일반 Drawer도 모든 값을 한 화면에 펼치지 말고, 업무 의미별 section으로 나누고 각 값은 라벨 + field 구조로 표시한다.

## 금지

- 선택 행 상세를 overlay modal로 띄우지 않는다.
- Drawer 안에서 회원 식별 정보와 상담/결제/정산 입력 정보를 한 카드에 섞지 않는다.
- 상태값을 텍스트 색상만 바꾸어 표시하지 않는다.
- 고정 정보 위치를 선택 행마다 바꾸지 않는다.
- 상담이력, 결제이력, 시험이력처럼 누적되는 정보는 단일 textarea에 합치지 않는다.
- Drawer를 열었을 때 선택 행 표시를 생략하지 않는다.
- 넓게보기 상태에서 닫을 때 기본보기 상태 복구를 누락하지 않는다.

## 산출물

- 행 클릭/키보드 선택으로 열리는 inline Drawer
- 선택 행 `is-open` 표시
- Drawer 헤더, 닫기, 넓게보기, 저장 액션
- 좌측 회원기본정보 마스터
- 우측 상담/시험/결제/정산 작업 패널
- 패널별 상태 chip과 active 상태
- 고정 정보 섹션과 변동 정보 섹션
- 운영 메모와 누적 이력 로그
