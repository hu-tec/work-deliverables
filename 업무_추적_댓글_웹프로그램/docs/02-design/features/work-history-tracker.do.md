# work-history-tracker - Implementation Record

> Date: 2026-05-26 | Phase: Do | Design: `work-history-tracker.design.md`

## Implementation Decision

프로젝트가 문서만 존재하는 빈 Starter 작업공간이고 Node.js 24가 제공되므로, 설치 의존성이 필요한 Next.js/PostgreSQL 배포 구성 대신 즉시 실행 및 검증 가능한 MVP를 Node.js 기본 HTTP 서버와 내장 SQLite로 구현한다. 도메인 모델, 권한 경계, 감사 이력, 비공개 첨부파일 정책 및 조밀한 화면 구성은 설계와 동일하게 유지한다.

## Implemented Items

| Area | Implementation |
|------|----------------|
| Runtime | `src/server.js`: 정적 화면 제공 및 JSON API 서버 |
| Persistence | SQLite: 사용자, 부서, 프로젝트, 업무, 댓글, 첨부, 활동 이벤트, 세션 테이블 및 인덱스 |
| Authentication | 데모 사용자 이메일/비밀번호 로그인, HttpOnly/SameSite 세션 쿠키 |
| Authorization | 비공개 부서 조회, 업무 수정, 댓글 및 첨부 다운로드/삭제 권한 검사 |
| Timeline | 업무 생성/변경, 상태, 댓글, 첨부 활동 이벤트 저장 및 조회 |
| Files | `uploads/` 비공개 저장, 크기/확장자 검증, 권한 확인 다운로드 |
| UI | `public/`: 컴팩트 목록, 업무 상세, 활동 필터, 댓글/대댓글, 첨부 화면 |
| Validation | 서버 입력 검사, 댓글 최대 1단계 깊이, 소프트 삭제 기반 코드 경로 |
| Verification | `test/server.test.js`: 주요 workflow 및 private attachment 접근 검사 |

## Runtime Notes

- 실행: `npm start`, 접속 주소 기본값 `http://localhost:3000`
- 검증: `npm run check`
- 데모 계정: `admin@demo.local`, `manager@demo.local`, `member@demo.local`, 비밀번호 `demo1234`
- 비소속 권한 검증 계정: `outside@demo.local`, 비밀번호 `demo1234`
- 데이터베이스와 업로드 원본은 각각 `data/`, `uploads/`에 저장되며 소스 관리에서 제외된다.

## Deferred Production Work

- PostgreSQL/Prisma와 S3 호환 저장소 어댑터로 이전
- 운영 로그인 또는 사내 SSO 연결, 초기 데모 계정 제거
- 파일 악성코드 검역 연동 및 CSRF 보호 강화
- 댓글 수정/삭제 및 첨부 삭제를 노출하는 UI 제어
- 타임라인 추가 페이지 로드 UI 및 댓글별 파일 첨부 API
