# 협업연동 커뮤니케이션 업무툴 테스트

현업 업무를 생성, 검색, 상세 확인, 댓글 기록, 활동 히스토리 확인까지 할 수 있는 BO 관리자형 업무 커뮤니케이션 프로토타입 모음입니다.

## 바로 볼 수 있는 HTML 시안

브라우저에서 아래 파일을 직접 열 수 있습니다.

| 파일 | 용도 |
| --- | --- |
| `index.html` | 초기 테스트 화면 |
| `index2.html` | 업무 목록/생성 흐름 참고 화면 |
| `index_detail_panel.html` | 상세 패널 구조 참고 화면 |

## 저장 기능이 있는 앱 실행

실제 데이터 저장, 댓글, 활동 히스토리까지 확인하려면 Node 앱을 실행합니다.

### Windows에서 바로 실행

`바로실행.bat` 파일을 더블클릭합니다.

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:4173
```

### 터미널에서 실행

```bash
cd apps/work-communication-tool
npm start
```

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:4173
```

## 실행 조건

- Node.js 24 이상
- 별도 npm 패키지 설치 없음
- SQLite DB는 Node.js 내장 `node:sqlite`를 사용합니다.

## 저장 위치

앱 실행 시 SQLite DB가 자동 생성됩니다.

```text
apps/work-communication-tool/data/work_communication.db
```

## 주요 기능

- 고밀도 BO 업무 테이블
- 통합 검색, 대분류, 상태, 우선순위 필터
- Summary Strip
- 행 선택 기반 우측 Inline Drawer 상세패널
- 신규 업무 생성 및 저장
- 상세 정보 저장
- 댓글/대댓글 저장
- 활동 히스토리 저장
- 공유자료명 메타 저장 및 미리보기 모달
