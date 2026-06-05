"use strict";

const state = {
  user: null,
  departments: [],
  projects: [],
  users: [],
  works: [],
  selectedWork: null,
  activities: [],
  comments: [],
  activityFilter: "ALL"
};

const STATUS_LABELS = {
  OPEN: "대기",
  IN_PROGRESS: "진행중",
  BLOCKED: "보류",
  DONE: "완료",
  ARCHIVED: "보관"
};
const PRIORITY_LABELS = { LOW: "낮음", MEDIUM: "보통", HIGH: "높음", URGENT: "긴급" };

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

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
    month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
  }).format(new Date(value));
}

function formatBytes(value) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function statusBadge(status) {
  return `<span class="badge status-${escapeHtml(status)}">${escapeHtml(STATUS_LABELS[status] || status)}</span>`;
}

function priorityBadge(priority) {
  return `<span class="badge priority-${escapeHtml(priority)}">${escapeHtml(PRIORITY_LABELS[priority] || priority)}</span>`;
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  let payload = null;
  const isJson = response.headers.get("content-type")?.includes("application/json");
  if (isJson) payload = await response.json();
  if (!response.ok) {
    if (response.status === 401 && url !== "/api/auth/login") {
      showLogin();
    }
    const error = new Error(payload?.error || "요청을 처리하지 못했습니다.");
    error.fields = payload?.fields;
    throw error;
  }
  return payload;
}

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.remove("hidden");
  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => element.classList.add("hidden"), 2400);
}

function showLogin() {
  $("#login-view").classList.remove("hidden");
  $("#app-view").classList.add("hidden");
}

function showApp() {
  $("#login-view").classList.add("hidden");
  $("#app-view").classList.remove("hidden");
}

async function initialize() {
  try {
    state.user = await api("/api/auth/me");
    showApp();
    $("#current-user").textContent = state.user.name;
    $("#current-role").textContent = state.user.role;
    await loadDepartments();
  } catch {
    showLogin();
  }
}

async function loadDepartments() {
  state.departments = await api("/api/departments");
  const departmentSelect = $("#header-department");
  departmentSelect.innerHTML = state.departments
    .map((department) => `<option value="${escapeHtml(department.id)}">${escapeHtml(department.name)}</option>`)
    .join("");
  if (state.departments.length) {
    await changeDepartment(state.departments[0].id);
  }
}

async function changeDepartment(departmentId) {
  $("#header-department").value = departmentId;
  [state.projects, state.users] = await Promise.all([
    api(`/api/projects?departmentId=${encodeURIComponent(departmentId)}`),
    api(`/api/users?departmentId=${encodeURIComponent(departmentId)}`)
  ]);
  const projectOptions = `<option value="">전체 프로젝트</option>${state.projects.map((project) =>
    `<option value="${escapeHtml(project.id)}">${escapeHtml(project.name)}</option>`).join("")}`;
  $("#filter-project").innerHTML = projectOptions;
  $("#create-project").innerHTML = `<option value="">프로젝트 없음</option>${state.projects.map((project) =>
    `<option value="${escapeHtml(project.id)}">${escapeHtml(project.name)}</option>`).join("")}`;
  $("#create-assignee").innerHTML = `<option value="">담당자 없음</option>${state.users.map((user) =>
    `<option value="${escapeHtml(user.id)}">${escapeHtml(user.name)}</option>`).join("")}`;
  await loadWorks();
}

async function loadWorks(preferredId) {
  const departmentId = $("#header-department").value;
  const parameters = new URLSearchParams({ departmentId });
  const filters = {
    q: $("#filter-query").value.trim(),
    projectId: $("#filter-project").value,
    status: $("#filter-status").value
  };
  for (const [key, value] of Object.entries(filters)) {
    if (value) parameters.set(key, value);
  }
  state.works = await api(`/api/work-items?${parameters}`);
  renderWorks();
  const nextId = preferredId || state.selectedWork?.id || state.works[0]?.id;
  if (nextId && state.works.some((work) => work.id === nextId)) {
    await selectWork(nextId);
  } else {
    state.selectedWork = null;
    $("#detail-pane").classList.add("hidden");
    $("#detail-empty").classList.remove("hidden");
  }
}

function renderWorks() {
  $("#work-rows").innerHTML = state.works.map((work) => `
    <tr data-id="${escapeHtml(work.id)}" class="${state.selectedWork?.id === work.id ? "selected" : ""}">
      <td>${statusBadge(work.status)}</td>
      <td>${priorityBadge(work.priority)}</td>
      <td class="truncate" title="${escapeHtml(work.title)}"><strong>${escapeHtml(work.title)}</strong></td>
      <td class="truncate">${escapeHtml(work.projectName || "-")}</td>
      <td class="truncate">${escapeHtml(work.assigneeName || "-")}</td>
      <td>${escapeHtml(formatDate(work.updatedAt))}</td>
    </tr>`).join("");
  $("#empty-work").classList.toggle("hidden", state.works.length !== 0);
  $$("#work-rows tr").forEach((row) => row.addEventListener("click", () => selectWork(row.dataset.id)));
}

async function selectWork(id) {
  const [work, activities, comments] = await Promise.all([
    api(`/api/work-items/${id}`),
    api(`/api/work-items/${id}/activity`),
    api(`/api/work-items/${id}/comments`)
  ]);
  state.selectedWork = work;
  state.activities = activities.items;
  state.comments = comments;
  $("#detail-empty").classList.add("hidden");
  $("#detail-pane").classList.remove("hidden");
  renderWorks();
  renderDetail();
}

function renderDetail() {
  const work = state.selectedWork;
  $("#detail-path").textContent = `${work.departmentName} / ${work.projectName || "일반 업무"}`;
  $("#detail-title").textContent = work.title;
  $("#detail-priority").innerHTML = priorityBadge(work.priority);
  $("#detail-status").innerHTML = Object.entries(STATUS_LABELS).map(([value, label]) =>
    `<option value="${value}" ${work.status === value ? "selected" : ""}>${label}</option>`).join("");
  $("#detail-status").disabled = !work.canUpdate;
  $("#work-meta").innerHTML = `
    <dt>상태</dt><dd>${statusBadge(work.status)}</dd>
    <dt>프로젝트</dt><dd>${escapeHtml(work.projectName || "-")}</dd>
    <dt>부서</dt><dd>${escapeHtml(work.departmentName)}</dd>
    <dt>담당자</dt><dd>${escapeHtml(work.assigneeName || "-")}</dd>
    <dt>작성자</dt><dd>${escapeHtml(work.creatorName)}</dd>
    <dt>최근 변경</dt><dd>${escapeHtml(formatDate(work.updatedAt))}</dd>`;
  $("#work-description").textContent = work.description || "업무 설명 없음";
  $("#attachment-file").disabled = !work.canUpdate;
  renderAttachments();
  renderTimeline();
  renderComments();
}

function renderAttachments() {
  const attachments = state.selectedWork.attachments;
  $("#attachment-list").innerHTML = attachments.length ? attachments.map((file) => `
    <li>
      <a href="/api/attachments/${escapeHtml(file.id)}/download">${escapeHtml(file.originalName)}</a>
      <span class="file-meta">${escapeHtml(file.uploadedByName)} · ${formatBytes(file.sizeBytes)} · ${escapeHtml(formatDate(file.createdAt))}</span>
    </li>`).join("") : `<li class="subtle">등록된 파일이 없습니다.</li>`;
}

function activityGroup(type) {
  if (type.startsWith("COMMENT")) return "COMMENT";
  if (type.startsWith("ATTACHMENT")) return "FILE";
  return "CHANGE";
}

function describeActivity(event) {
  const data = event.payload;
  switch (event.type) {
    case "WORK_CREATED": return `업무를 생성했습니다. 상태: ${STATUS_LABELS[data.status] || data.status}`;
    case "STATUS_CHANGED": return `상태를 ${STATUS_LABELS[data.from] || data.from}에서 ${STATUS_LABELS[data.to] || data.to}(으)로 변경했습니다.`;
    case "WORK_UPDATED": return `업무 정보를 변경했습니다: ${Object.keys(data).join(", ")}`;
    case "COMMENT_CREATED": return data.parentId ? "대댓글을 작성했습니다." : "댓글을 작성했습니다.";
    case "COMMENT_EDITED": return "댓글을 수정했습니다.";
    case "COMMENT_DELETED": return "댓글을 삭제했습니다.";
    case "ATTACHMENT_ADDED": return `파일을 첨부했습니다: ${data.fileName}`;
    case "ATTACHMENT_REMOVED": return `첨부파일을 삭제했습니다: ${data.fileName}`;
    default: return event.type;
  }
}

function renderTimeline() {
  const items = state.activities.filter((event) =>
    state.activityFilter === "ALL" || activityGroup(event.type) === state.activityFilter);
  $("#timeline").innerHTML = items.length ? items.map((event) => `
    <li>
      <span class="event-type">${escapeHtml(activityGroup(event.type))}</span>
      <div class="event-description">
        ${escapeHtml(describeActivity(event))}
        <small>${escapeHtml(event.actorName)} · ${escapeHtml(formatDate(event.occurredAt))}</small>
      </div>
    </li>`).join("") : `<li class="subtle">표시할 활동이 없습니다.</li>`;
}

function renderComments() {
  const roots = state.comments.filter((comment) => !comment.parentId);
  const repliesFor = (id) => state.comments.filter((comment) => comment.parentId === id);
  const commentHtml = (comment, reply) => `
    <li class="comment ${reply ? "reply" : ""}">
      <div class="comment-head">
        <strong>${escapeHtml(comment.authorName)}</strong>
        <span>${escapeHtml(formatDate(comment.createdAt))}</span>
        ${comment.editedAt ? "<span>(수정됨)</span>" : ""}
      </div>
      <div class="comment-text">${escapeHtml(comment.deletedAt ? "삭제된 댓글입니다." : comment.body)}</div>
      ${!reply && !comment.deletedAt ? `<button class="reply-action" data-reply-id="${escapeHtml(comment.id)}" data-reply-name="${escapeHtml(comment.authorName)}">답글</button>` : ""}
    </li>`;
  $("#comments").innerHTML = roots.length ? roots.map((root) =>
    `${commentHtml(root, false)}${repliesFor(root.id).map((reply) => commentHtml(reply, true)).join("")}`
  ).join("") : `<li class="subtle">첫 댓글을 남겨 업무 진행을 기록하세요.</li>`;
  $("#comment-count").textContent = `${state.comments.length}건`;
  $$("[data-reply-id]").forEach((button) => button.addEventListener("click", () => {
    $("#reply-parent").value = button.dataset.replyId;
    $("#reply-banner").textContent = `${button.dataset.replyName}님의 댓글에 답글 작성 중`;
    $("#reply-banner").classList.remove("hidden");
    $("#cancel-reply").classList.remove("hidden");
    $("#comment-body").focus();
  }));
}

async function refreshSelected() {
  if (state.selectedWork) {
    await selectWork(state.selectedWork.id);
    await loadWorks(state.selectedWork.id);
  }
}

$("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("#login-error").textContent = "";
  try {
    state.user = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: $("#login-email").value, password: $("#login-password").value })
    });
    showApp();
    $("#current-user").textContent = state.user.name;
    $("#current-role").textContent = state.user.role;
    await loadDepartments();
  } catch (error) {
    $("#login-error").textContent = error.message;
  }
});

$("#logout").addEventListener("click", async () => {
  await api("/api/auth/logout", { method: "POST" });
  state.user = null;
  showLogin();
});

$("#header-department").addEventListener("change", (event) => changeDepartment(event.target.value));
$("#filters").addEventListener("submit", (event) => {
  event.preventDefault();
  loadWorks();
});
$("#new-work").addEventListener("click", () => $("#work-dialog").showModal());
$("#close-work").addEventListener("click", () => $("#work-dialog").close());

$("#work-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.target).entries());
  values.departmentId = $("#header-department").value;
  try {
    const work = await api("/api/work-items", { method: "POST", body: JSON.stringify(values) });
    event.target.reset();
    $("#work-dialog").close();
    toast("업무가 등록되었습니다.");
    await loadWorks(work.id);
  } catch (error) {
    $("#work-error").textContent = error.message;
  }
});

$("#detail-status").addEventListener("change", async (event) => {
  try {
    await api(`/api/work-items/${state.selectedWork.id}`, {
      method: "PATCH", body: JSON.stringify({ status: event.target.value })
    });
    toast("업무 상태가 변경되었습니다.");
    await refreshSelected();
  } catch (error) {
    toast(error.message);
    renderDetail();
  }
});

$("#activity-tabs").addEventListener("click", (event) => {
  if (event.target.dataset.filter) {
    state.activityFilter = event.target.dataset.filter;
    $$("#activity-tabs button").forEach((button) =>
      button.classList.toggle("active", button.dataset.filter === state.activityFilter));
    renderTimeline();
  }
});

$("#comment-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await api(`/api/work-items/${state.selectedWork.id}/comments`, {
      method: "POST",
      body: JSON.stringify({ body: $("#comment-body").value, parentId: $("#reply-parent").value || null })
    });
    $("#comment-body").value = "";
    cancelReply();
    toast("댓글이 기록되었습니다.");
    await refreshSelected();
  } catch (error) {
    toast(error.message);
  }
});

function cancelReply() {
  $("#reply-parent").value = "";
  $("#reply-banner").classList.add("hidden");
  $("#cancel-reply").classList.add("hidden");
}
$("#cancel-reply").addEventListener("click", cancelReply);

$("#attachment-file").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  $("#attachment-message").textContent = "";
  try {
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    await api(`/api/work-items/${state.selectedWork.id}/attachments`, {
      method: "POST",
      body: JSON.stringify({ fileName: file.name, contentType: file.type, dataBase64: base64 })
    });
    toast("파일이 첨부되었습니다.");
    event.target.value = "";
    await refreshSelected();
  } catch (error) {
    $("#attachment-message").textContent = error.message;
  }
});

initialize();
