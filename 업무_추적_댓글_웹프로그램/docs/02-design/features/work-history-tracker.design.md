# work-history-tracker - Design Document

> Version: 1.0.0 | Date: 2026-05-26 | Status: Completed
> Level: Starter | Plan: `docs/01-plan/features/work-history-tracker.plan.md`

---

## 1. Overview

### 1.1 Purpose

프로젝트 및 부서별 업무를 등록하고, 업무 상세 한 페이지에서 본문, 담당 정보, 상태 변경, 댓글/대댓글, 파일 첨부 내역을 시간 순으로 추적하는 내부 업무 기록 시스템을 설계한다.

### 1.2 Design Goals

- `WorkItem`을 중심으로 모든 논의 및 변경 기록을 연결한다.
- 읽기와 탐색이 핵심인 화면이므로 밀도 높은 테이블/타임라인 UI를 우선한다.
- 댓글, 첨부, 주요 필드 변경은 감사 가능한 활동 이벤트로 보존한다.
- 부서 범위 접근 제어 및 비공개 파일 다운로드 검증을 서버 경계에서 수행한다.
- 신규 프로젝트에 적합하도록 단일 애플리케이션 구조로 시작하고 이후 확장이 가능한 데이터 모델을 둔다.

## 2. Technical Architecture

### 2.1 Recommended Stack

| Area | Selection | Reason |
|------|-----------|--------|
| Web application | Next.js App Router + TypeScript | 페이지와 서버 API를 단일 코드베이스에서 구현 가능 |
| UI styling | Tailwind CSS | 조밀한 레이아웃과 상태 표시를 빠르게 구성 |
| Persistence | PostgreSQL | 관계형 필터, 댓글 관계, 활동 이력 조회 및 인덱싱에 적합 |
| ORM / migration | Prisma | 명시적 스키마와 마이그레이션 관리 |
| Authentication | 서버 세션 기반 이메일 로그인 | 내부 서비스 MVP에 필요한 사용자/권한 확인 경계 제공 |
| File storage | Private S3-compatible object storage | 원본 파일을 공개 URL로 노출하지 않고 다운로드 권한 검증 가능 |
| Validation | Zod request schema validation | 폼/API 입력값을 동일하게 검증 |

초기 구현은 위 스택을 기준으로 한다. 개발 환경에서는 S3 호환 로컬 저장소 또는 제한된 파일 저장 어댑터를 사용할 수 있지만, 첨부 메타데이터와 권한 검증 API 계약은 동일하게 유지한다.

### 2.2 System Boundary

```text
Browser
  -> Next.js pages and server actions / route handlers
       -> Authentication and authorization policy
       -> Work item, comment, activity services
       -> Attachment service
            -> PostgreSQL metadata
            -> Private object storage binary files
       -> PostgreSQL domain records and audit events
```

### 2.3 Module Responsibilities

| Module | Responsibility |
|--------|----------------|
| `auth` | 로그인 세션, 현재 사용자, 역할 및 부서 소속 확인 |
| `departments` | 부서 조회 및 관리 권한 판단 |
| `projects` | 프로젝트 등록, 부서 연결, 필터 옵션 제공 |
| `work-items` | 업무 CRUD, 상태/담당자/우선순위 변경 |
| `comments` | 댓글 및 대댓글 작성/수정/소프트 삭제 |
| `attachments` | 업로드 메타데이터, 저장, 다운로드 권한 검증 |
| `activities` | 변경 및 행위 이벤트 작성, 시간 순 조회 |

## 3. Authorization And Audit Policy

### 3.1 User Roles

| Role | View Work | Create Work | Update Work | Comment | Manage Attachments | Manage Department |
|------|-----------|-------------|-------------|---------|--------------------|-------------------|
| `MEMBER` | 소속/공개 부서 | 소속 부서 | 본인 작성 또는 담당 업무 | 열람 가능 업무 | 본인 업로드 삭제 | No |
| `MANAGER` | 관리 부서 | 관리 부서 | 관리 부서 전체 | 열람 가능 업무 | 관리 부서 전체 | 프로젝트/업무 범위 관리 |
| `ADMIN` | 전체 | 전체 | 전체 | 전체 | 전체 | 전체 |

### 3.2 Visibility

- `Department.visibility`는 초기 버전에서 `PRIVATE` 또는 `ORGANIZATION` 값을 가진다.
- `PRIVATE` 부서의 업무는 소속 구성원, 해당 부서 관리자, 관리자 계정만 열람한다.
- `ORGANIZATION` 부서의 업무는 로그인 사용자가 열람할 수 있으나 수정은 역할 규칙을 적용한다.
- 모든 조회, 댓글 작성 및 파일 다운로드 API는 서버에서 `canViewWorkItem` 검사를 수행한다.

### 3.3 Comment And Deletion Policy

- 댓글은 1단계 대댓글까지만 지원한다. 대댓글에 대한 추가 답글은 같은 부모 댓글 아래 대댓글로 저장한다.
- 작성자는 자신의 댓글 내용을 수정할 수 있으며, 수정 후 `editedAt`을 노출한다.
- 댓글 삭제는 소프트 삭제로 처리하여 스레드 위치와 이력은 유지하고 본문 대신 `삭제된 댓글입니다`를 표시한다.
- 첨부 삭제는 원본 접근을 차단하고 메타데이터 및 삭제 이벤트는 보존한다.

### 3.4 Audit Events

다음 동작은 `ActivityEvent`로 기록하며 삭제하지 않는다.

| Event Type | Trigger | Snapshot Detail |
|------------|---------|-----------------|
| `WORK_CREATED` | 업무 생성 | 제목, 부서, 프로젝트, 담당자, 상태 |
| `WORK_UPDATED` | 제목/내용/우선순위/담당자 변경 | 변경 필드별 이전값/새값 |
| `STATUS_CHANGED` | 상태 변경 | 이전 상태, 새 상태 |
| `COMMENT_CREATED` | 댓글/대댓글 작성 | 댓글 ID, 부모 댓글 ID |
| `COMMENT_EDITED` | 댓글 수정 | 댓글 ID, 수정 시각 |
| `COMMENT_DELETED` | 댓글 삭제 | 댓글 ID, 삭제 시각 |
| `ATTACHMENT_ADDED` | 파일 첨부 완료 | 첨부 ID, 파일명, 크기 |
| `ATTACHMENT_REMOVED` | 파일 삭제 | 첨부 ID, 파일명 |

## 4. Data Model

### 4.1 Entity Relationship

```text
User --< DepartmentMember >-- Department --< Project
                                  |
                                  +--< WorkItem >-- User (assignee/creator)
                                           |
                                           +--< Comment --< Comment (reply)
                                           +--< Attachment
                                           +--< ActivityEvent
```

### 4.2 Entities

#### `User`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | PK |
| `email` | varchar unique | 로그인 식별자 |
| `name` | varchar | 표시 이름 |
| `passwordHash` | varchar | 서버 저장 해시 |
| `role` | enum | `MEMBER`, `MANAGER`, `ADMIN` |
| `createdAt`, `updatedAt` | timestamp | 생성/변경 시각 |

#### `Department` And `DepartmentMember`

| Entity | Key Fields |
|--------|------------|
| `Department` | `id`, `name`, `visibility`, `createdAt`, `updatedAt` |
| `DepartmentMember` | `departmentId`, `userId`, `isManager`, `joinedAt` |

`DepartmentMember`는 `(departmentId, userId)` 조합을 유일 키로 둔다.

#### `Project`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | PK |
| `departmentId` | UUID | FK to `Department` |
| `name` | varchar | 프로젝트명 |
| `description` | text nullable | 설명 |
| `status` | enum | `ACTIVE`, `ARCHIVED` |
| `createdById` | UUID | 생성자 |
| `createdAt`, `updatedAt` | timestamp | 시각 |

#### `WorkItem`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | PK |
| `departmentId` | UUID | 권한 범위 및 빠른 필터를 위한 FK |
| `projectId` | UUID nullable | 프로젝트 없는 부서 업무 허용 |
| `title` | varchar(200) | 필수 |
| `description` | text | 업무 본문 |
| `status` | enum | `OPEN`, `IN_PROGRESS`, `BLOCKED`, `DONE`, `ARCHIVED` |
| `priority` | enum | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `assigneeId` | UUID nullable | 담당자 |
| `createdById` | UUID | 작성자 |
| `createdAt`, `updatedAt` | timestamp | 시각 |

#### `Comment`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | PK |
| `workItemId` | UUID | FK |
| `parentId` | UUID nullable | null이면 최상위 댓글, 값이 있으면 대댓글 |
| `authorId` | UUID | 작성자 |
| `body` | text | 삭제 전 댓글 내용 |
| `createdAt` | timestamp | 작성 시각 |
| `editedAt` | timestamp nullable | 수정 표시 |
| `deletedAt` | timestamp nullable | 소프트 삭제 |

서버 검증은 `parentId`가 가리키는 댓글의 `parentId`가 null인지 확인하여 최대 깊이를 1로 제한한다.

#### `Attachment`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | PK |
| `workItemId` | UUID | FK |
| `commentId` | UUID nullable | 특정 논의와 연결 시 사용 |
| `uploadedById` | UUID | 업로더 |
| `originalName` | varchar | 화면 표시 파일명 |
| `storageKey` | varchar unique | 비공개 저장소 경로 |
| `contentType` | varchar | MIME type |
| `sizeBytes` | bigint | 제한 검증 및 표시 |
| `sha256` | varchar nullable | 무결성/중복 분석용 |
| `createdAt` | timestamp | 첨부 시각 |
| `deletedAt` | timestamp nullable | 삭제/접근 차단 |

#### `ActivityEvent`

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | PK |
| `workItemId` | UUID | FK |
| `actorId` | UUID | 수행자 |
| `type` | enum | 감사 이벤트 유형 |
| `entityId` | UUID nullable | 댓글/첨부 등 이벤트 대상 |
| `payload` | jsonb | 표시 가능한 변경 요약 또는 이전/새 값 |
| `occurredAt` | timestamp | 이벤트 발생 시각 |

### 4.3 Indexes

| Entity | Index | Purpose |
|--------|-------|---------|
| `WorkItem` | `(departmentId, updatedAt desc)` | 부서별 최신 업무 목록 |
| `WorkItem` | `(projectId, status, updatedAt desc)` | 프로젝트/상태 필터 |
| `WorkItem` | `(assigneeId, status)` | 담당자별 조회 |
| `Comment` | `(workItemId, createdAt)` | 댓글 스레드 조회 |
| `ActivityEvent` | `(workItemId, occurredAt desc)` | 타임라인 점진 로딩 |
| `Attachment` | `(workItemId, createdAt desc)` | 첨부 목록 |

## 5. File Attachment Design

### 5.1 Initial Policy

| Item | Rule |
|------|------|
| Max file size | 파일 1개당 20 MB |
| Allowed types | PDF, office 문서, 이미지(PNG/JPEG/WebP), TXT, CSV, ZIP |
| Object access | 비공개 저장, 직접 공개 URL 제공 금지 |
| File count | 업무당 30개까지, 댓글당 5개까지 |
| Malware control | 운영 배포 전 업로드 스캔 또는 검역 처리 연결 지점 확보 |
| Delete | 소프트 삭제 후 다운로드 차단, 운영 보존기간 만료 후 binary purge 가능 |

### 5.2 Upload Flow

1. 사용자가 업무 또는 댓글 작성 UI에서 파일을 선택한다.
2. 서버는 로그인, 업무 열람/작성 권한, 파일 크기와 MIME/확장자를 검증한다.
3. 서버가 비공개 저장소에 난수 `storageKey`로 파일을 저장한다.
4. 저장 성공 트랜잭션에서 `Attachment`와 `ATTACHMENT_ADDED` 이벤트를 작성한다.
5. 실패 시 메타데이터를 생성하지 않거나 정리 작업 대상으로 표시하고 UI에 재시도를 제공한다.

### 5.3 Download Flow

1. `GET /api/attachments/{id}/download` 요청을 보낸다.
2. 서버가 첨부와 연결 업무를 조회하고 `canViewWorkItem` 및 `deletedAt`을 검사한다.
3. 통과 시 짧은 만료시간의 서명 URL 또는 서버 스트리밍 응답을 반환한다.
4. 권한 없음 또는 삭제 파일은 파일 존재 여부를 과도하게 노출하지 않도록 `404`를 반환한다.

## 6. API Design

### 6.1 Common Rules

- 모든 API는 로그인 세션이 필요하다. 인증 실패는 `401`, 권한 없음은 `403` 또는 첨부 조회의 경우 `404`를 반환한다.
- 요청 본문은 Zod 스키마로 검증하고 오류는 필드 단위 메시지를 포함한 `400`으로 반환한다.
- 변경 API는 업무 변경과 `ActivityEvent` 생성을 동일한 데이터베이스 트랜잭션에서 수행한다.
- 목록 조회는 기본 `limit=30`, 히스토리는 cursor 기반 `limit=30`으로 제공한다.

### 6.2 Endpoints

| Method | Endpoint | Purpose | Authorization |
|--------|----------|---------|---------------|
| `GET` | `/api/departments` | 접근 가능한 부서 목록 | Login |
| `GET` | `/api/projects?departmentId=` | 접근 가능한 프로젝트 목록 | View department |
| `POST` | `/api/projects` | 프로젝트 생성 | Manager/Admin |
| `GET` | `/api/work-items` | 필터/검색된 업무 목록 | Visible scope |
| `POST` | `/api/work-items` | 업무 생성 | Member in department+ |
| `GET` | `/api/work-items/{id}` | 업무 상세 요약 | View work |
| `PATCH` | `/api/work-items/{id}` | 업무 필드 및 상태 변경 | Update work |
| `GET` | `/api/work-items/{id}/activity` | 히스토리 페이지 조회 | View work |
| `GET` | `/api/work-items/{id}/comments` | 댓글 스레드 조회 | View work |
| `POST` | `/api/work-items/{id}/comments` | 댓글 또는 대댓글 작성 | Comment permission |
| `PATCH` | `/api/comments/{id}` | 댓글 수정 | Author/Admin |
| `DELETE` | `/api/comments/{id}` | 댓글 소프트 삭제 | Author/Manager/Admin |
| `POST` | `/api/work-items/{id}/attachments` | 업무 첨부 업로드 | Update/comment permission |
| `POST` | `/api/comments/{id}/attachments` | 댓글 첨부 업로드 | Comment author |
| `GET` | `/api/attachments/{id}/download` | 검증 후 다운로드 | View work |
| `DELETE` | `/api/attachments/{id}` | 첨부 소프트 삭제 | Uploader/Manager/Admin |

### 6.3 Key Payloads

#### Create Work Item

```json
{
  "departmentId": "uuid",
  "projectId": "uuid-or-null",
  "title": "분기 보고서 초안 검토",
  "description": "검토 의견을 댓글로 남겨주세요.",
  "assigneeId": "uuid-or-null",
  "status": "OPEN",
  "priority": "HIGH"
}
```

#### Create Comment Or Reply

```json
{
  "body": "수정본을 첨부했습니다.",
  "parentId": "uuid-or-null"
}
```

#### Activity Response Item

```json
{
  "id": "uuid",
  "type": "STATUS_CHANGED",
  "actor": { "id": "uuid", "name": "홍길동" },
  "payload": { "from": "OPEN", "to": "IN_PROGRESS" },
  "occurredAt": "2026-05-26T02:00:00Z"
}
```

## 7. Page And Interaction Design

### 7.1 Routes

| Route | View |
|-------|------|
| `/login` | 사용자 로그인 |
| `/work-items` | 업무 목록 및 필터 |
| `/work-items/new` | 업무 등록 |
| `/work-items/[id]` | 업무 상세, 히스토리, 댓글, 첨부 |

### 7.2 Work List Layout

```text
+-----------------------------------------------------------------------+
| Header: System Name | Department Selector | User                     |
+-----------------------------------------------------------------------+
| Search | Project | Department | Status | Assignee | + New Work        |
+-----------------------------------------------------------------------+
| Status | Priority | Work Title      | Project | Assignee | Updated   |
| ... dense table rows, sortable and clickable ...                     |
+-----------------------------------------------------------------------+
```

- 데스크톱 화면 기준 바깥 여백 `12-16px`, 행 높이 `40-44px`를 목표로 한다.
- 필터 상태는 URL query string에 유지하여 재방문 및 공유 가능한 목록 상태를 제공한다.
- 제목, 상태, 담당자, 최근 변경 시각은 접기 없이 즉시 보여준다.

### 7.3 Single Work History Page

```text
+-----------------------------------------------------------------------+
| Breadcrumb / Title / Status / Priority / Edit                         |
+----------------------+------------------------------------------------+
| Summary panel        | Activity filters: All / Changes / Comments / File|
| - project/department |------------------------------------------------|
| - assignee/status    | Timeline                                       |
| - description        |  [change] status changed                       |
| - attachments        |  [comment] root comment                        |
|                      |     reply                                     |
|                      |  [file] attached document                     |
|                      |------------------------------------------------|
|                      | Comment editor + attach + submit               |
+----------------------+------------------------------------------------+
```

- 화면 폭 `>= 1024px`에서는 좌측 요약 영역을 `300-340px` 고정 폭으로 유지하고 우측 타임라인이 남는 폭을 사용한다.
- 타임라인은 이벤트 유형 필터와 최신순/과거순 전환을 제공한다. 기본은 최신 이벤트가 쉽게 보이는 최신순이다.
- 댓글 이벤트는 스레드 내용을 표시하고 대댓글 작성 버튼을 해당 댓글 내부에 둔다.
- 요약 패널의 첨부 목록은 파일명, 크기, 업로더, 시각을 조밀하게 표시한다.
- 모바일 또는 좁은 화면에서는 요약을 상단 접이식 영역으로 전환하고 타임라인을 아래에 단일 열로 배치한다.

### 7.4 Components

| Component | Responsibility |
|-----------|----------------|
| `AppHeader` | 사용자 및 부서 컨텍스트 |
| `WorkFilterBar` | 검색/프로젝트/부서/상태/담당자 필터 |
| `WorkTable` | 조밀한 업무 행 목록 |
| `WorkSummaryPanel` | 상세 정보 및 첨부 목록 |
| `StatusBadge`, `PriorityBadge` | 빠른 상태 시각 구분 |
| `ActivityTimeline` | 이벤트 페이지네이션과 필터 표시 |
| `ActivityItem` | 이벤트 유형별 표현 |
| `CommentThread`, `CommentEditor` | 댓글/대댓글 표시 및 작성 |
| `AttachmentList`, `AttachmentUploader` | 업로드 및 다운로드 동작 |
| `PermissionGuard` | 비허용 UI 동작 숨김/비활성화 |

## 8. Validation And Error Handling

| Scenario | Validation / UI Behavior |
|----------|--------------------------|
| 업무 제목 누락 또는 200자 초과 | 저장 전 필드 오류 표시 |
| 권한 없는 부서 업무 생성 | API 거부 후 접근 불가 알림 |
| 2단계 이상 답글 요청 | `400` 및 최상위 댓글 아래 작성 안내 |
| 허용하지 않은 첨부 형식 또는 20 MB 초과 | 업로드 전/서버 양쪽 차단 |
| 업로드 중 실패 | 실패 파일 표시와 재시도 버튼 |
| 과거에 삭제된 댓글 | 스레드 위치를 유지한 삭제 문구 표시 |
| 타임라인 조회 실패 | 기존 화면 유지, 다시 불러오기 동작 제공 |

## 9. Test Plan

### 9.1 Functional Tests

| ID | Test | Expected Result |
|----|------|-----------------|
| T-01 | 부서와 프로젝트가 지정된 업무 생성 | 목록/상세에 업무 노출 및 `WORK_CREATED` 기록 |
| T-02 | 상태와 담당자 변경 | 변경된 값 및 별도 활동 이벤트 표시 |
| T-03 | 댓글과 대댓글 작성 | 1단계 계층과 작성자/시각 표시, 이벤트 기록 |
| T-04 | 대댓글에 추가 깊이 답글 요청 | 서버 검증으로 거부 |
| T-05 | 허용 파일 업로드/다운로드 | 첨부 메타정보와 이벤트 표시, 파일 다운로드 성공 |
| T-06 | 삭제된 댓글 및 첨부 조회 | 삭제 표시 유지, 첨부 다운로드 차단 |
| T-07 | 프로젝트/부서/상태/담당자 필터 | 일치 업무만 조밀한 목록에 노출 |
| T-08 | 긴 히스토리 조회 | cursor로 추가 이력 로드 및 중복 없음 |

### 9.2 Security Tests

| ID | Test | Expected Result |
|----|------|-----------------|
| S-01 | 비소속 사용자가 `PRIVATE` 부서 업무 조회 | 접근 거부 |
| S-02 | 비소속 사용자가 첨부 다운로드 URL 직접 호출 | 파일 노출 없이 실패 |
| S-03 | 일반 사용자가 타인의 댓글 수정/삭제 | 접근 거부 |
| S-04 | 확장자 위장 또는 크기 제한 초과 업로드 | 저장 전 거부 및 감사 가능한 오류 로그 |

### 9.3 UI Review Checks

- 1280px 화면에서 업무 상세의 핵심 내용, 타임라인, 댓글 입력이 과도한 빈 여백 없이 보인다.
- 긴 파일명, 긴 댓글, 여러 대댓글이 있을 때 레이아웃이 깨지지 않는다.
- 키보드 포커스, 라벨, 상태 색상 외 텍스트 표기가 기본 접근성을 충족한다.

## 10. Implementation Order

1. Next.js/TypeScript 프로젝트 초기화, 환경 설정, 공통 레이아웃을 구성한다.
2. Prisma 스키마와 PostgreSQL 마이그레이션으로 사용자, 부서, 프로젝트, 업무, 댓글, 첨부, 활동 이벤트를 생성한다.
3. 세션 인증과 부서/역할 기반 접근 제어 서비스를 구현한다.
4. 업무 목록/등록/상세 API 및 활동 이벤트 트랜잭션을 구현한다.
5. 댓글/대댓글 API와 소프트 삭제 정책을 구현한다.
6. 비공개 첨부 업로드/다운로드 API와 검증 정책을 구현한다.
7. 컴팩트 업무 목록 화면과 상세 요약/타임라인 화면을 연결한다.
8. 댓글 작성, 첨부, 필터, 점진 로딩 상호작용을 완성한다.
9. 기능/권한/첨부/레이아웃 검증을 수행하고 분석 단계에서 설계 일치율을 확인한다.

## 11. Requirement Traceability

| Plan Requirement | Design Coverage |
|------------------|-----------------|
| FR-01, FR-02 | `Department`, `Project`, `WorkItem`, 목록 API 및 필터 UI |
| FR-03, FR-06, FR-10 | `ActivityEvent`, 상세 단일 페이지, cursor 기반 타임라인 |
| FR-04, FR-05 | `Comment.parentId`, 1단계 스레드, 댓글 API/컴포넌트 |
| FR-07, FR-08 | `Attachment`, private storage, 업/다운로드 API 및 첨부 목록 |
| FR-09 | 소프트 삭제, 불변 감사 이벤트, 이전/새 값 payload 정책 |
| Access/security NFR | 역할 매트릭스, 서버 권한 검사, private file download |
| Compact UI direction | 밀도 높은 테이블 및 2열 상세 페이지 레이아웃 |

## 12. Deferred Enhancements

- 실시간 업데이트 알림과 멘션
- 전체 텍스트 검색 또는 파일 본문 검색
- 활동 요약 리포트, 간트/칸반 보기
- 바이러스 스캔 결과 UI 및 첨부 검역 관리 화면
- 사내 SSO 또는 조직 시스템 연동
