"use strict";

const STORAGE_KEY = "worklog-ver2-state";

const STATUS_LABELS = {
  OPEN: "대기",
  IN_PROGRESS: "진행중",
  BLOCKED: "보류",
  DONE: "완료",
  ARCHIVED: "보관"
};

const PRIORITY_LABELS = {
  LOW: "낮음",
  MEDIUM: "보통",
  HIGH: "높음",
  URGENT: "긴급"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const initialData = {
  currentUserId: "u-manager",
  selectedDepartmentId: "d-planning",
  selectedWorkId: null,
  departments: [
    { id: "d-planning", name: "기획팀" },
    { id: "d-support", name: "고객지원팀" }
  ],
  users: [
    { id: "u-manager", name: "기획팀장", departmentId: "d-planning" },
    { id: "u-member", name: "담당자", departmentId: "d-planning" },
    { id: "u-support", name: "지원담당", departmentId: "d-support" }
  ],
  projects: [
    { id: "p-cs", departmentId: "d-planning", name: "고객지원 개선" },
    { id: "p-internal", departmentId: "d-planning", name: "사내 운영 정리" },
    { id: "p-voice", departmentId: "d-support", name: "VOC 응대 개선" }
  ],
  works: [
    {
      id: "w-101",
      departmentId: "d-planning",
      projectId: "p-cs",
      title: "업무 히스토리 화면 검토",
      description: "목록에서 댓글과 첨부 상태를 바로 확인하고, 선택 시 상세 정보를 우측 drawer에서 검토합니다.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      assigneeId: "u-member",
      creatorId: "u-manager",
      createdAt: "2026-05-27T09:10:00+09:00",
      updatedAt: "2026-05-28T10:40:00+09:00"
    },
    {
      id: "w-102",
      departmentId: "d-planning",
      projectId: "p-internal",
      title: "정기 보고 양식 통합",
      description: "부서별 보고 문서의 필수 항목과 첨부 파일 표기 방식을 통일합니다.",
      status: "OPEN",
      priority: "MEDIUM",
      assigneeId: "u-manager",
      creatorId: "u-manager",
      createdAt: "2026-05-26T16:20:00+09:00",
      updatedAt: "2026-05-28T08:30:00+09:00"
    },
    {
      id: "w-103",
      departmentId: "d-planning",
      projectId: "p-cs",
      title: "첨부 파일 보관 정책 확인",
      description: "업무 완료 이후 파일 보관 기간과 다운로드 권한을 검토합니다.",
      status: "BLOCKED",
      priority: "URGENT",
      assigneeId: "u-member",
      creatorId: "u-manager",
      createdAt: "2026-05-24T11:00:00+09:00",
      updatedAt: "2026-05-27T17:12:00+09:00"
    },
    {
      id: "w-104",
      departmentId: "d-support",
      projectId: "p-voice",
      title: "VOC 처리 기준 업데이트",
      description: "반복 문의 유형을 기준으로 처리 기준과 담당자 배정 규칙을 갱신합니다.",
      status: "DONE",
      priority: "LOW",
      assigneeId: "u-support",
      creatorId: "u-support",
      createdAt: "2026-05-20T13:00:00+09:00",
      updatedAt: "2026-05-26T18:10:00+09:00"
    }
  ],
  comments: [
    { id: "c-1", workId: "w-101", authorId: "u-manager", body: "목록에서 댓글 일부가 보여야 검토 우선순위를 빨리 잡을 수 있습니다.", createdAt: "2026-05-28T09:20:00+09:00" },
    { id: "c-2", workId: "w-101", authorId: "u-member", body: "상세는 drawer로 열리면 목록 맥락을 유지할 수 있어 좋겠습니다.", createdAt: "2026-05-28T09:52:00+09:00" },
    { id: "c-3", workId: "w-101", authorId: "u-manager", body: "첨부 여부도 목록에서 바로 보이도록 반영해 주세요.", createdAt: "2026-05-28T10:10:00+09:00" },
    { id: "c-4", workId: "w-101", authorId: "u-member", body: "ver2에서는 Node 없이 열리는 정적 파일로 구성하겠습니다.", createdAt: "2026-05-28T10:38:00+09:00" },
    { id: "c-5", workId: "w-102", authorId: "u-manager", body: "기존 문서 샘플을 기준으로 필수 입력 항목을 먼저 정리합니다.", createdAt: "2026-05-28T08:30:00+09:00" },
    { id: "c-6", workId: "w-103", authorId: "u-member", body: "법무 검토 일정 확인 전까지는 보류 상태로 둡니다.", createdAt: "2026-05-27T17:12:00+09:00" }
  ],
  attachments: [
    { id: "a-1", workId: "w-101", name: "drawer-layout-review.pdf", size: 248100, createdAt: "2026-05-28T10:05:00+09:00", uploadedById: "u-manager" },
    { id: "a-2", workId: "w-103", name: "file-policy-draft.docx", size: 92300, createdAt: "2026-05-27T16:45:00+09:00", uploadedById: "u-member" }
  ],
  activities: [
    { id: "e-1", workId: "w-101", type: "WORK_CREATED", message: "업무가 등록되었습니다.", actorId: "u-manager", occurredAt: "2026-05-27T09:10:00+09:00" },
    { id: "e-2", workId: "w-101", type: "COMMENT_CREATED", message: "댓글이 추가되었습니다.", actorId: "u-member", occurredAt: "2026-05-28T09:52:00+09:00" },
    { id: "e-3", workId: "w-101", type: "ATTACHMENT_ADDED", message: "drawer-layout-review.pdf 파일이 첨부되었습니다.", actorId: "u-manager", occurredAt: "2026-05-28T10:05:00+09:00" },
    { id: "e-4", workId: "w-103", type: "STATUS_CHANGED", message: "상태가 보류로 변경되었습니다.", actorId: "u-member", occurredAt: "2026-05-27T17:12:00+09:00" }
  ]
};

let state = loadState();
let activeDrawerTab = "summary";

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(initialData);
  try {
    const parsed = JSON.parse(saved);
    return { ...structuredClone(initialData), ...parsed };
  } catch {
    return structuredClone(initialData);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatBytes(value) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function id(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function now() {
  return new Date().toISOString();
}

function departmentName(idValue) {
  return state.departments.find((item) => item.id === idValue)?.name || "-";
}

function projectName(idValue) {
  return state.projects.find((item) => item.id === idValue)?.name || "일반 업무";
}

function userName(idValue) {
  return state.users.find((item) => item.id === idValue)?.name || "-";
}

function getWorkComments(workId) {
  return state.comments
    .filter((comment) => comment.workId === workId && !comment.deletedAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getWorkAttachments(workId) {
  return state.attachments
    .filter((attachment) => attachment.workId === workId && !attachment.commentId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getAllWorkAttachments(workId) {
  return state.attachments
    .filter((attachment) => attachment.workId === workId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getCommentAttachments(commentId) {
  return state.attachments
    .filter((attachment) => attachment.commentId === commentId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getWorkActivities(workId) {
  return state.activities
    .filter((activity) => activity.workId === workId)
    .sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));
}

function statusBadge(status) {
  return `<span class="badge status-${escapeHtml(status)}">${escapeHtml(STATUS_LABELS[status] || status)}</span>`;
}

function priorityBadge(priority) {
  return `<span class="badge priority-${escapeHtml(priority)}">${escapeHtml(PRIORITY_LABELS[priority] || priority)}</span>`;
}

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.remove("hidden");
  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => element.classList.add("hidden"), 2200);
}

function filteredWorks() {
  const query = $("#search-input").value.trim().toLowerCase();
  const projectId = $("#project-filter").value;
  const status = $("#status-filter").value;
  return state.works
    .filter((work) => work.departmentId === state.selectedDepartmentId)
    .filter((work) => !projectId || work.projectId === projectId)
    .filter((work) => !status || work.status === status)
    .filter((work) => {
      if (!query) return true;
      const comments = getWorkComments(work.id).map((comment) => comment.body).join(" ");
      return [work.title, work.description, projectName(work.projectId), userName(work.assigneeId), comments]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function renderDepartmentSelect() {
  $("#department-select").innerHTML = state.departments.map((department) =>
    `<option value="${escapeHtml(department.id)}">${escapeHtml(department.name)}</option>`
  ).join("");
  $("#department-select").value = state.selectedDepartmentId;
}

function renderProjectControls() {
  const projects = state.projects.filter((project) => project.departmentId === state.selectedDepartmentId);
  $("#project-filter").innerHTML = `<option value="">전체 프로젝트</option>${projects.map((project) =>
    `<option value="${escapeHtml(project.id)}">${escapeHtml(project.name)}</option>`
  ).join("")}`;
  $("#work-project").innerHTML = `<option value="">프로젝트 없음</option>${projects.map((project) =>
    `<option value="${escapeHtml(project.id)}">${escapeHtml(project.name)}</option>`
  ).join("")}`;
  const users = state.users.filter((user) => user.departmentId === state.selectedDepartmentId);
  $("#work-assignee").innerHTML = `<option value="">담당자 없음</option>${users.map((user) =>
    `<option value="${escapeHtml(user.id)}">${escapeHtml(user.name)}</option>`
  ).join("")}`;
}

function renderWorkList() {
  const works = filteredWorks();
  $("#visible-count").textContent = works.length;
  $("#empty-message").classList.toggle("hidden", works.length > 0);
  $("#work-rows").innerHTML = works.map((work, index) => {
    const comments = getWorkComments(work.id);
    const attachments = getAllWorkAttachments(work.id);
    const previewComments = comments.slice(0, 3);
    const no = index + 1;
    return `
      <tr class="${state.selectedWorkId === work.id ? "selected" : ""}" data-work-id="${escapeHtml(work.id)}">
        <td>${no}</td>
        <td>${statusBadge(work.status)}</td>
        <td>
          <div class="table-title">
            <strong>${escapeHtml(work.title)}</strong>
            ${priorityBadge(work.priority)}
          </div>
          <p>${escapeHtml(work.description || "업무 설명 없음")}</p>
        </td>
        <td>
          <div class="comment-preview">
            ${previewComments.length ? previewComments.map((comment) => `
              <p><strong>${escapeHtml(userName(comment.authorId))}</strong> ${escapeHtml(comment.body)}</p>
            `).join("") : `<p class="muted">등록된 댓글이 없습니다.</p>`}
          </div>
        </td>
        <td>${escapeHtml(projectName(work.projectId))}</td>
        <td>${escapeHtml(userName(work.assigneeId))}</td>
        <td><span class="metric-pill">${comments.length}</span></td>
        <td><span class="metric-pill ${attachments.length ? "has-file" : ""}">${attachments.length ? `${attachments.length}개` : "없음"}</span></td>
        <td>${escapeHtml(formatDate(work.createdAt))}</td>
        <td>${escapeHtml(formatDate(work.updatedAt))}</td>
      </tr>
    `;
  }).join("");
  $$("#work-rows tr").forEach((row) => {
    row.addEventListener("click", () => openDrawer(row.dataset.workId));
  });
}

function renderDrawer() {
  const work = state.works.find((item) => item.id === state.selectedWorkId);
  if (!work) return;
  const comments = getWorkComments(work.id);
  const totalAttachments = getAllWorkAttachments(work.id);
  $("#drawer-path").textContent = `${departmentName(work.departmentId)} / ${projectName(work.projectId)}`;
  $("#drawer-title").textContent = work.title;
  $("#drawer-status").innerHTML = Object.entries(STATUS_LABELS).map(([value, label]) =>
    `<option value="${value}" ${work.status === value ? "selected" : ""}>${label}</option>`
  ).join("");
  $("#drawer-priority").innerHTML = priorityBadge(work.priority);
  $("#drawer-meta").innerHTML = `
    <dt>담당자</dt><dd>${escapeHtml(userName(work.assigneeId))}</dd>
    <dt>작성자</dt><dd>${escapeHtml(userName(work.creatorId))}</dd>
    <dt>생성</dt><dd>${escapeHtml(formatDate(work.createdAt))}</dd>
    <dt>최근 변경</dt><dd>${escapeHtml(formatDate(work.updatedAt))}</dd>
    <dt>댓글</dt><dd>${comments.length}개</dd>
    <dt>첨부</dt><dd>${totalAttachments.length ? `${totalAttachments.length}개 등록` : "없음"}</dd>
  `;
  $("#drawer-description").textContent = work.description || "업무 설명 없음";
  $("#drawer-comment-count").textContent = `${comments.length}개`;
  $("#attachment-list").innerHTML = totalAttachments.length ? totalAttachments.map((file) => `
    <li>
      <strong>${escapeHtml(file.name)}</strong>
      <span>${escapeHtml(attachmentScope(file))} · ${escapeHtml(userName(file.uploadedById))} · ${formatBytes(file.size)} · ${escapeHtml(formatDate(file.createdAt))}</span>
    </li>
  `).join("") : `<li class="muted">등록된 파일이 없습니다.</li>`;
  $("#drawer-comments").innerHTML = comments.length ? comments.map((comment) => `
    <li data-comment-id="${escapeHtml(comment.id)}">
      <div class="comment-head">
        <div>
          <strong>${escapeHtml(userName(comment.authorId))}</strong>
          <span>${escapeHtml(formatDate(comment.createdAt))}${comment.editedAt ? " · 수정됨" : ""}</span>
        </div>
        <div class="comment-actions">
          <button type="button" data-edit-comment="${escapeHtml(comment.id)}">수정</button>
          <button type="button" data-delete-comment="${escapeHtml(comment.id)}">삭제</button>
        </div>
      </div>
      <p>${escapeHtml(comment.body)}</p>
      ${renderCommentAttachments(comment.id)}
    </li>
  `).join("") : `<li class="muted">첫 댓글을 남겨 업무 진행을 기록하세요.</li>`;
  $("#activity-list").innerHTML = getWorkActivities(work.id).map((activity) => `
    <li>
      <span>${escapeHtml(activity.type.replaceAll("_", " "))}</span>
      <p>${escapeHtml(activity.message)}</p>
      <small>${escapeHtml(userName(activity.actorId))} · ${escapeHtml(formatDate(activity.occurredAt))}</small>
    </li>
  `).join("");
  bindCommentActions();
  renderTabs();
}

function renderCommentAttachments(commentId) {
  const files = getCommentAttachments(commentId);
  if (!files.length) return "";
  return `
    <ul class="comment-files">
      ${files.map((file) => `
        <li>${escapeHtml(file.name)} <span>${formatBytes(file.size)}</span></li>
      `).join("")}
    </ul>
  `;
}

function attachmentScope(file) {
  if (!file.commentId) return "업무 첨부";
  const comment = state.comments.find((item) => item.id === file.commentId);
  if (!comment) return "댓글 첨부";
  return `댓글 첨부: ${comment.body.slice(0, 24)}${comment.body.length > 24 ? "..." : ""}`;
}

function bindCommentActions() {
  $$("[data-edit-comment]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      startEditComment(button.dataset.editComment);
    });
  });
  $$("[data-delete-comment]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteComment(button.dataset.deleteComment);
    });
  });
}

function renderTabs() {

  // $$("#drawer-tabs button").forEach((button) => {
    // button.classList.toggle("active", button.dataset.tab === activeDrawerTab);
  // });
  // $$(".tab-panel").forEach((panel) => {
    // panel.classList.toggle("hidden", panel.dataset.panel !== activeDrawerTab);
  // });
}

function openDrawer(workId) {
  state.selectedWorkId = workId;
  activeDrawerTab = "summary";
  resetCommentForm();
  renderWorkList();
  renderDrawer();
  $("#drawer-backdrop").classList.remove("hidden");
  $("#detail-drawer").classList.add("open");
  $(".workspace").classList.add("open");
  $("#detail-drawer").setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  $("#drawer-backdrop").classList.add("hidden");
  $("#detail-drawer").classList.remove("open");
  $(".workspace").classList.remove("open");
  $("#detail-drawer").setAttribute("aria-hidden", "true");
}

function addActivity(workId, type, message) {
  state.activities.push({
    id: id("e"),
    workId,
    type,
    message,
    actorId: state.currentUserId,
    occurredAt: now()
  });
}

function touchWork(workId) {
  const work = state.works.find((item) => item.id === workId);
  if (work) work.updatedAt = now();
}

function selectedCommentFiles() {
  return [...$("#comment-attachment-input").files];
}

function resetCommentForm() {
  $("#editing-comment-id").value = "";
  $("#comment-input").value = "";
  $("#comment-attachment-input").value = "";
  $("#comment-attachment-label").textContent = "선택된 파일 없음";
  $("#cancel-comment-edit").classList.add("hidden");
  $("#comment-submit-button").textContent = "댓글 등록";
}

function startEditComment(commentId) {
  const comment = state.comments.find((item) => item.id === commentId && !item.deletedAt);
  if (!comment) return;
  activeDrawerTab = "comments";
  renderTabs();
  $("#editing-comment-id").value = comment.id;
  $("#comment-input").value = comment.body;
  $("#comment-attachment-input").value = "";
  $("#comment-attachment-label").textContent = "수정 중에는 새 첨부를 추가하지 않습니다.";
  $("#cancel-comment-edit").classList.remove("hidden");
  $("#comment-submit-button").textContent = "댓글 수정";
  $("#comment-input").focus();
}

function deleteComment(commentId) {
  const comment = state.comments.find((item) => item.id === commentId && !item.deletedAt);
  if (!comment) return;
  comment.deletedAt = now();
  touchWork(comment.workId);
  addActivity(comment.workId, "COMMENT_DELETED", "댓글이 삭제되었습니다.");
  saveState();
  resetCommentForm();
  renderWorkList();
  renderDrawer();
  toast("댓글이 삭제되었습니다.");
}

function initialize() {
  renderDepartmentSelect();
  renderProjectControls();
  renderWorkList();
}

$("#department-select").addEventListener("change", (event) => {
  state.selectedDepartmentId = event.target.value;
  state.selectedWorkId = null;
  $("#search-input").value = "";
  $("#status-filter").value = "";
  renderProjectControls();
  renderWorkList();
  closeDrawer();
  saveState();
});

$("#filters").addEventListener("input", renderWorkList);

// $("#drawer-tabs").addEventListener("click", (event) => {
//   const tab = event.target.dataset.tab;
//   if (!tab) return;
//   activeDrawerTab = tab;
//   renderTabs();
// });

$("#new-work-button").addEventListener("click", () => {
  renderProjectControls();
  $("#work-dialog").showModal();
});

$("#close-work-dialog").addEventListener("click", () => $("#work-dialog").close());

$("#work-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget).entries());
  const timestamp = now();
  const work = {
    id: id("w"),
    departmentId: state.selectedDepartmentId,
    projectId: values.projectId || null,
    title: values.title.trim(),
    description: values.description.trim(),
    status: values.status,
    priority: values.priority,
    assigneeId: values.assigneeId || state.currentUserId,
    creatorId: state.currentUserId,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  state.works.push(work);
  addActivity(work.id, "WORK_CREATED", "업무가 등록되었습니다.");
  event.currentTarget.reset();
  $("#work-dialog").close();
  saveState();
  renderWorkList();
  openDrawer(work.id);
  toast("업무가 등록되었습니다.");
});

$("#drawer-status").addEventListener("change", (event) => {
  const work = state.works.find((item) => item.id === state.selectedWorkId);
  if (!work || work.status === event.target.value) return;
  work.status = event.target.value;
  touchWork(work.id);
  addActivity(work.id, "STATUS_CHANGED", `상태가 ${STATUS_LABELS[work.status]}(으)로 변경되었습니다.`);
  saveState();
  renderWorkList();
  renderDrawer();
  toast("상태가 변경되었습니다.");
});

$("#comment-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = $("#comment-input");
  const body = input.value.trim();
  if (!body || !state.selectedWorkId) return;
  const editingCommentId = $("#editing-comment-id").value;
  if (editingCommentId) {
    const comment = state.comments.find((item) => item.id === editingCommentId && !item.deletedAt);
    if (!comment) return;
    comment.body = body;
    comment.editedAt = now();
    touchWork(comment.workId);
    addActivity(comment.workId, "COMMENT_EDITED", "댓글이 수정되었습니다.");
    toast("댓글이 수정되었습니다.");
  } else {
    const commentId = id("c");
    state.comments.push({
      id: commentId,
      workId: state.selectedWorkId,
      authorId: state.currentUserId,
      body,
      createdAt: now()
    });
    selectedCommentFiles().forEach((file) => {
      state.attachments.push({
        id: id("a"),
        workId: state.selectedWorkId,
        commentId,
        name: file.name,
        size: file.size,
        createdAt: now(),
        uploadedById: state.currentUserId
      });
    });
    touchWork(state.selectedWorkId);
    addActivity(state.selectedWorkId, "COMMENT_CREATED", "댓글이 추가되었습니다.");
    if (selectedCommentFiles().length) {
      addActivity(state.selectedWorkId, "ATTACHMENT_ADDED", "댓글에 파일이 첨부되었습니다.");
    }
    toast("댓글이 등록되었습니다.");
  }
  resetCommentForm();
  saveState();
  renderWorkList();
  renderDrawer();
});

$("#cancel-comment-edit").addEventListener("click", resetCommentForm);

$("#comment-attachment-input").addEventListener("change", () => {
  const files = selectedCommentFiles();
  $("#comment-attachment-label").textContent = files.length
    ? files.map((file) => file.name).join(", ")
    : "선택된 파일 없음";
});

$("#attachment-input").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file || !state.selectedWorkId) return;
  state.attachments.push({
    id: id("a"),
    workId: state.selectedWorkId,
    name: file.name,
    size: file.size,
    createdAt: now(),
    uploadedById: state.currentUserId
  });
  touchWork(state.selectedWorkId);
  addActivity(state.selectedWorkId, "ATTACHMENT_ADDED", `${file.name} 파일이 첨부되었습니다.`);
  event.target.value = "";
  saveState();
  renderWorkList();
  renderDrawer();
  toast("첨부 상태가 업데이트되었습니다.");
});

$("#close-drawer").addEventListener("click", closeDrawer);
$("#drawer-backdrop").addEventListener("click", closeDrawer);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDrawer();
});

initialize();
