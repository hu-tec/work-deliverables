# 현업연동 커뮤니케이션 업무툴

로컬 SQLite에 저장되는 BO 관리자형 업무 커뮤니케이션 프로토타입입니다.

## 실행

```bash
npm start
```

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:4173
```

## 저장 위치

SQLite DB는 앱 실행 시 자동 생성됩니다.

```text
apps/work-communication-tool/data/work_communication.db
```

## 구현 범위

- 고밀도 BO 업무 테이블
- 통합 검색, 대분류, 상태, 우선순위 필터
- Summary Strip
- 행 선택 기반 우측 Inline Drawer 상세패널
- 선택 행 `is-open` 표시
- `Enter` / `Space` 행 선택
- `Escape` Drawer 닫기
- Drawer 넓게보기
- 신규 업무 생성 후 SQLite 저장
- 상세 정보 저장
- 댓글/대댓글 저장
- 활동 히스토리 저장
- 공유자료명 메타 저장 및 미리보기 모달

## 참고 기준

- `../../index2.html`
- `../../index.html`
- `../../../notations_tools/public/index.html`
- `../../../design_system_major/docs/재사용_디자인_프롬프트/관리자/02_BO_테이블레이아웃_기준.md`
- `../../../design_system_major/docs/재사용_디자인_프롬프트/관리자/components/테이블선택_Drawer_상세패널_기준.md`
