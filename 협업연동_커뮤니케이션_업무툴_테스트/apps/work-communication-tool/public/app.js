"use strict";

const state = {
  works: [],
  selected: null,
  activityFilter: "ALL",
  lastFocusedRow: null,
  drawerClosedManually: false
};

const STATUS = {
  WAIT: { label: "대기", cls: "wait" },
  IN_PROGRESS: { label: "진행중", cls: "info" },
  RISK: { label: "지연주의", cls: "fail" },
  DONE: { label: "완료", cls: "ok" },
  HOLD: { label: "보류", cls: "wait" }
};
const PRIORITY = {
  URGENT: { label: "긴급", cls: "red" },
  HIGH: { label: "높음", cls: "warn" },
  NORMAL: { label: "보통", cls: "blue" },
  LOW: { label: "낮음", cls: "gray" }
};
const ACTIVITY_GROUP = {
  WORK_CREATED: "CHANGE",
  WORK_UPDATED: "CHANGE",
  STATUS_CHANGED: "CHANGE",
  COMMENT_CREATED: "COMMENT"
};

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

function normalizeDate(value) {
  return String(value || "").replaceAll(".", "-").replaceAll("/", "-");
}

function statusChip(value) {
  const status = STATUS[value] || { label: value || "-", cls: "" };
  return `<span class="status ${status.cls}">${escapeHtml(status.label)}</span>`;
}

function priorityBadge(value) {
  const priority = PRIORITY[value] || { label: value || "-", cls: "gray" };
  return `<span class="badge ${priority.cls}">${escapeHtml(priority.label)}</span>`;
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;
  if (!response.ok) {
    const error = new Error(payload?.error || "요청을 처리하지 못했습니다.");
    error.fields = payload?.fields || {};
    throw error;
  }
  return payload;
}

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.remove("hidden");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.add("hidden"), 2200);
}

function formValues(form) {
  const values = Object.fromEntries(new FormData(form).entries());
  if (values.subOwners) {
    values.subOwners = values.subOwners.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return values;
}

function buildParams() {
  const params = new URLSearchParams();
  const filters = {
    q: $("#filter-query").value.trim(),
    category: $("#filter-category").value,
    status: $("#filter-status").value,
    priority: $("#filter-priority").value
  };
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  return params;
}

async function loadWorks(preferredId) {
  const params = buildParams();
  state.works = await api(`/api/work-items?${params.toString()}`);
  renderFilters();
  renderSummary();
  renderRows();
  const nextId = preferredId || state.selected?.id || state.works[0]?.id;
  if (nextId && state.works.some((work) => work.id === nextId)) {
    await selectWork(nextId, { preserveFocus: true });
  } else {
    state.selected = null;
    renderEmptyDetail();
  }
}

function renderFilters() {
  const current = $("#filter-category").value;
  const categories = [...new Set(state.works.map((work) => work.categoryLarge))].sort();
  $("#filter-category").innerHTML = `<option value="">전체</option>${categories
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join("")}`;
  $("#filter-category").value = categories.includes(current) ? current : "";

  const tags = [];
  if ($("#filter-query").value.trim()) tags.push(`검색: ${$("#filter-query").value.trim()}`);
  if ($("#filter-category").value) tags.push(`대분류: ${$("#filter-category").value}`);
  if ($("#filter-status").value) tags.push(`상태: ${STATUS[$("#filter-status").value]?.label}`);
  if ($("#filter-priority").value) tags.push(`우선순위: ${PRIORITY[$("#filter-priority").value]?.label}`);
  $("#active-filters").innerHTML = tags.length
    ? tags.map((tag) => `<span class="filter-tag">${escapeHtml(tag)}</span>`).join("")
    : `<span class="muted">적용된 필터 없음</span>`;
}

function renderSummary() {
  const count = (predicate) => state.works.filter(predicate).length;
  const rows = [
    ["전체 업무", state.works.length],
    ["진행중", count((work) => work.status === "IN_PROGRESS")],
    ["지연주의", count((work) => work.status === "RISK")],
    ["완료", count((work) => work.status === "DONE")],
    ["첨부 있음", count((work) => Boolean(work.fileName))]
  ];
  $("#summary-strip").innerHTML = rows.map(([label, value]) => `
    <div class="summary-item"><strong>${value}</strong><span>${label}</span></div>
  `).join("");
  $("#table-count").textContent = `${state.works.length}건`;
}

function renderRows() {
  $("#work-rows").innerHTML = state.works.map((work) => {
    const selected = state.selected?.id === work.id ? "is-open" : "";
    const comments = (work.commentPreview || []).length
      ? work.commentPreview.map((comment) => `
          <div class="summary-row">댓글 ${escapeHtml(comment.author)}: ${escapeHtml(comment.body)}</div>
        `).join("")
      : `<div class="summary-row">댓글 등록 대기</div>`;
    return `
      <tr class="${selected}" data-id="${work.id}" role="button" tabindex="0" aria-controls="table-detail-drawer">
        <td><input type="checkbox" ${selected ? "checked" : ""} aria-label="선택"></td>
        <td>${escapeHtml(work.workNo)}</td>
        <td>${escapeHtml(work.startDate.replaceAll("-", ""))}</td>
        <td>${escapeHtml(work.creator)}</td>
        <td>
          <span class="marker-tag marker-blue">${escapeHtml(work.categoryLarge)}</span>
          <span class="marker-sep">&gt;</span>
          <span class="marker-tag marker-green">${escapeHtml(work.categoryMiddle)}</span>
          <span class="marker-sep">&gt;</span>
          <span class="marker-tag marker-orange">${escapeHtml(work.categorySmall)}</span>
        </td>
        <td>
          <div class="title-line">${escapeHtml(work.title)}</div>
          <div class="feed-box-notice">
            <span class="bold-text">중요: ${escapeHtml(work.notice)}</span>
            <span class="row-badges">${statusChip(work.status)} ${priorityBadge(work.priority)}</span>
          </div>
        </td>
        <td>
          <div class="steps-text">${escapeHtml(work.description)}</div>
          <div class="feed-box-comment">${comments}</div>
        </td>
        <td>${escapeHtml(work.mainDueDate.replaceAll("-", ""))}<span class="time-badge ${work.status === "RISK" ? "time-alert" : "time-safe"}">${escapeHtml(STATUS[work.status]?.label || work.status)}</span></td>
        <td>${escapeHtml(work.hostDueDate.replaceAll("-", ""))}<span class="time-badge ${work.priority === "URGENT" ? "time-alert" : "time-safe"}">${escapeHtml(PRIORITY[work.priority]?.label || work.priority)}</span></td>
        <td>${escapeHtml(work.mainOwner)}</td>
        <td>${escapeHtml(work.subOwners.slice(0, 5).join(", "))}</td>
        <td><button class="file-preview-button" type="button" data-preview-file="${escapeHtml(work.fileName || "-")}">${escapeHtml(work.fileName || "-")}</button></td>
      </tr>`;
  }).join("");
  $("#empty-state").classList.toggle("hidden", state.works.length > 0);
  $("#selected-info").textContent = `선택 ${state.selected ? "1" : "0"}건`;

  $$("#work-rows tr").forEach((row) => {
    row.addEventListener("click", (event) => {
      if (event.target.type === "checkbox") event.preventDefault();
      state.lastFocusedRow = row;
      selectWork(Number(row.dataset.id));
    });
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        state.lastFocusedRow = row;
        selectWork(Number(row.dataset.id));
      }
    });
  });
  $$("[data-preview-file]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    $("#preview-body").innerHTML = `
      <div>
        <strong>${escapeHtml(button.dataset.previewFile)}</strong>
        <p class="muted">목록 공유자료 칸에서 호출한 미리보기입니다.</p>
      </div>
    `;
    $("#preview-dialog").showModal();
  }));
}

async function selectWork(id, options = {}) {
  state.selected = await api(`/api/work-items/${id}`);
  state.drawerClosedManually = false;
  openDrawer();
  renderRows();
  renderDetail();
  if (!options.preserveFocus) {
    $("#drawer-title").focus?.();
  }
}

function renderEmptyDetail() {
  $("#table-workspace").classList.remove("is-drawer-open", "is-drawer-wide");
  $("#drawer-title").textContent = "업무를 선택하세요";
  $("#drawer-summary").textContent = "목록 행을 클릭하면 상세 처리 패널이 열립니다.";
}

function renderDetail() {
  const work = state.selected;
  if (!work) return;
  $("#drawer-kicker").textContent = `${work.categoryLarge} / ${work.categoryMiddle}`;
  $("#drawer-title").textContent = work.title;
  $("#drawer-summary").textContent = `${work.workNo} · ${work.creator} · ${work.mainOwner} 책임 · ${work.mainDueDate} / ${work.hostDueDate}`;
  $("#detail-priority-chip").innerHTML = priorityBadge(work.priority);
  $("#file-name").textContent = work.fileName || "-";
  const form = $("#detail-form");
  for (const [name, value] of Object.entries({
    workNo: work.workNo,
    startDate: work.startDate,
    creator: work.creator,
    categoryLarge: work.categoryLarge,
    categoryMiddle: work.categoryMiddle,
    categorySmall: work.categorySmall,
    mainOwner: work.mainOwner,
    subOwners: work.subOwners.join(", "),
    mainDueDate: work.mainDueDate,
    hostDueDate: work.hostDueDate,
    status: work.status,
    priority: work.priority,
    title: work.title,
    description: work.description,
    notice: work.notice,
    operationalMemo: work.operationalMemo,
    fileName: work.fileName
  })) {
    const field = form.elements[name];
    if (field) field.value = value;
  }
  renderTimeline();
  renderComments();
}

function renderTimeline() {
  const work = state.selected;
  const activities = (work?.activities || []).filter((event) => {
    const group = ACTIVITY_GROUP[event.type] || "CHANGE";
    return state.activityFilter === "ALL" || state.activityFilter === group;
  });
  $("#activity-count").textContent = `${activities.length}건`;
  $("#timeline").innerHTML = activities.length ? activities.map((event) => `
    <li>
      <span class="event-type">${escapeHtml(ACTIVITY_GROUP[event.type] || "CHANGE")}</span>
      <div class="event-description">
        ${escapeHtml(event.message)}
        <small>${escapeHtml(event.actor)} · ${escapeHtml(normalizeDate(event.createdAt).slice(2, 16).replace("T", " "))}</small>
      </div>
    </li>
  `).join("") : `<li class="muted">표시할 활동이 없습니다.</li>`;
}

function renderComments() {
  const comments = state.selected?.comments || [];
  const roots = comments.filter((comment) => !comment.parentId);
  const replies = (id) => comments.filter((comment) => comment.parentId === id);
  const item = (comment, isReply) => `
    <li class="comment ${isReply ? "reply" : ""}">
      <div class="comment-head"><strong>${escapeHtml(comment.author)}</strong><span>${escapeHtml(normalizeDate(comment.createdAt).slice(2, 16).replace("T", " "))}</span></div>
      <div class="comment-body">${escapeHtml(comment.body)}</div>
      ${isReply ? "" : `<button class="reply-button" type="button" data-reply-id="${comment.id}" data-reply-author="${escapeHtml(comment.author)}">답글</button>`}
    </li>`;
  $("#comment-count").textContent = `${comments.length}건`;
  $("#comments").innerHTML = roots.length
    ? roots.map((root) => `${item(root, false)}${replies(root.id).map((reply) => item(reply, true)).join("")}`).join("")
    : `<li class="muted">첫 댓글을 남겨 업무 진행을 기록하세요.</li>`;
  $$("[data-reply-id]").forEach((button) => button.addEventListener("click", () => {
    $("#reply-parent").value = button.dataset.replyId;
    $("#reply-banner").textContent = `${button.dataset.replyAuthor}님의 댓글에 답글 작성 중`;
    $("#reply-banner").classList.remove("hidden");
    $("#cancel-reply-button").classList.remove("hidden");
    $("#comment-body").focus();
  }));
}

function openDrawer() {
  $("#table-workspace").classList.add("is-drawer-open");
}

function closeDrawer() {
  $("#table-workspace").classList.remove("is-drawer-open", "is-drawer-wide");
  $("#wide-button").textContent = "넓게보기";
  $("#wide-button").setAttribute("aria-pressed", "false");
  state.drawerClosedManually = true;
  $$("#work-rows tr").forEach((row) => row.classList.remove("is-open"));
  if (state.lastFocusedRow) state.lastFocusedRow.focus();
}

function setWideMode(enabled) {
  const workspace = $("#table-workspace");
  if (enabled && !state.selected) return;
  workspace.classList.toggle("is-drawer-wide", enabled);
  workspace.classList.toggle("is-drawer-open", Boolean(state.selected));
  $("#wide-button").textContent = enabled ? "기본보기" : "넓게보기";
  $("#wide-button").setAttribute("aria-pressed", enabled ? "true" : "false");
}

function toggleWide() {
  setWideMode(!$("#table-workspace").classList.contains("is-drawer-wide"));
}

async function saveDetail(event) {
  event.preventDefault();
  if (!state.selected) return;
  const values = formValues($("#detail-form"));
  values.actor = "운영자";
  try {
    state.selected = await api(`/api/work-items/${state.selected.id}`, {
      method: "PATCH",
      body: JSON.stringify(values)
    });
    toast("상세 정보가 저장되었습니다.");
    await loadWorks(state.selected.id);
  } catch (error) {
    toast(error.message);
  }
}

async function createWork(event) {
  event.preventDefault();
  const values = formValues(event.target);
  try {
    const work = await api("/api/work-items", {
      method: "POST",
      body: JSON.stringify(values)
    });
    toast("업무가 등록되었습니다.");
    event.target.reset();
    event.target.elements.startDate.value = "26-06-04";
    event.target.elements.creator.value = "운영자";
    await loadWorks(work.id);
  } catch (error) {
    toast(error.message);
  }
}

async function addComment() {
  if (!state.selected) return;
  const body = $("#comment-body").value.trim();
  if (!body) return;
  try {
    await api(`/api/work-items/${state.selected.id}/comments`, {
      method: "POST",
      body: JSON.stringify({
        body,
        parentId: $("#reply-parent").value ? Number($("#reply-parent").value) : null,
        author: "운영자"
      })
    });
    $("#comment-body").value = "";
    cancelReply();
    toast("댓글이 등록되었습니다.");
    state.selected = await api(`/api/work-items/${state.selected.id}`);
    renderDetail();
    await loadWorks(state.selected.id);
  } catch (error) {
    toast(error.message);
  }
}

function cancelReply() {
  $("#reply-parent").value = "";
  $("#reply-banner").classList.add("hidden");
  $("#cancel-reply-button").classList.add("hidden");
}

function clearFilters() {
  $("#filter-query").value = "";
  $("#filter-category").value = "";
  $("#filter-status").value = "";
  $("#filter-priority").value = "";
  loadWorks();
}

function previewFile() {
  const fileName = $("#detail-form").elements.fileName.value || state.selected?.fileName || "-";
  $("#preview-body").innerHTML = `
    <div>
      <strong>${escapeHtml(fileName)}</strong>
      <p class="muted">로컬 프로토타입에서는 파일 바이너리 대신 공유자료명을 SQLite에 저장합니다.</p>
    </div>
  `;
  $("#preview-dialog").showModal();
}

function bindEvents() {
  $("#refresh-button").addEventListener("click", () => loadWorks());
  $("#open-create-button").addEventListener("click", () => $("#create-panel").scrollIntoView({ behavior: "smooth", block: "start" }));
  $("[data-scroll-create]").addEventListener("click", () => $("#create-panel").scrollIntoView({ behavior: "smooth", block: "start" }));
  $("#reopen-drawer-button").addEventListener("click", () => {
    if (state.selected) {
      state.drawerClosedManually = false;
      openDrawer();
      setWideMode(false);
      renderRows();
    }
  });
  $("#close-drawer-button").addEventListener("click", closeDrawer);
  $("#wide-button").addEventListener("click", toggleWide);
  $("#detail-form").addEventListener("submit", saveDetail);
  $("#create-form").addEventListener("submit", createWork);
  $("#comment-submit-button").addEventListener("click", addComment);
  $("#cancel-reply-button").addEventListener("click", cancelReply);
  $("#preview-button").addEventListener("click", previewFile);
  $("#close-preview-button").addEventListener("click", () => $("#preview-dialog").close());
  $("#clear-filter-button").addEventListener("click", clearFilters);
  ["filter-query", "filter-category", "filter-status", "filter-priority"].forEach((id) => {
    const eventName = id === "filter-query" ? "input" : "change";
    $(`#${id}`).addEventListener(eventName, () => loadWorks());
  });
  $("#activity-tabs").addEventListener("click", (event) => {
    if (!event.target.dataset.filter) return;
    state.activityFilter = event.target.dataset.filter;
    $$("#activity-tabs button").forEach((button) => button.classList.toggle("active", button.dataset.filter === state.activityFilter));
    renderTimeline();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && $("#table-workspace").classList.contains("is-drawer-open")) {
      closeDrawer();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && document.activeElement === $("#comment-body")) {
      addComment();
    }
  });
}

bindEvents();
loadWorks().catch((error) => toast(error.message));
