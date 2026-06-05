const documentListEl = document.getElementById("documentList");
const newDocumentButton = document.getElementById("newDocumentButton");
const fileInput = document.getElementById("fileInput");
const authUserEl = document.getElementById("authUser");
const authLinksEl = document.getElementById("authLinks");
const logoutButton = document.getElementById("logoutButton");
const titleInput = document.getElementById("titleInput");
const fileNameInput = document.getElementById("fileNameInput");
const saveButton = document.getElementById("saveButton");
const deleteDocumentButton = document.getElementById("deleteDocumentButton");
const downloadWordButton = document.getElementById("downloadWordButton");
const openTabsEl = document.getElementById("openTabs");
const markdownInput = document.getElementById("markdownInput");
const previewEl = document.getElementById("preview");
const documentStatus = document.getElementById("documentStatus");
const selectionHint = document.getElementById("selectionHint");
const selectedTextEl = document.getElementById("selectedText");
const authorInput = document.getElementById("authorInput");
const commentInput = document.getElementById("commentInput");
const commentAttachmentInput = document.getElementById("commentAttachmentInput");
const addCommentButton = document.getElementById("addCommentButton");
const commentListEl = document.getElementById("commentList");
const commentsTabButton = document.getElementById("commentsTabButton");
const chatTabButton = document.getElementById("chatTabButton");
const commentsPanel = document.getElementById("commentsPanel");
const chatPanel = document.getElementById("chatPanel");
const chatAuthorInput = document.getElementById("chatAuthorInput");
const chatMessageInput = document.getElementById("chatMessageInput");
const sendChatButton = document.getElementById("sendChatButton");
const chatListEl = document.getElementById("chatList");

let documents = [];
let openDocuments = [];
let activeDocument = null;
let currentUser = null;
let comments = [];
let chats = [];
let activeCommentGroupKey = "";
let previewCommentGroupsByKey = new Map();
let selection = { start: 0, end: 0, text: "" };
let saveTimer = null;

init();

async function init() {
  bindEvents();
  await loadCurrentUser();
  await loadDocuments();
  if (documents.length) {
    await openDocument(documents[0].id);
  } else {
    createLocalDocument();
  }
}

function bindEvents() {
  newDocumentButton.addEventListener("click", createLocalDocument);
  fileInput.addEventListener("change", uploadSelectedFile);
  logoutButton.addEventListener("click", logout);
  saveButton.addEventListener("click", saveActiveDocument);
  deleteDocumentButton.addEventListener("click", deleteActiveDocument);
  downloadWordButton.addEventListener("click", downloadWord);
  addCommentButton.addEventListener("click", addComment);
  commentsTabButton.addEventListener("click", () => setSidePanel("comments"));
  chatTabButton.addEventListener("click", () => setSidePanel("chat"));
  sendChatButton.addEventListener("click", sendChatMessage);

  markdownInput.addEventListener("input", () => {
    renderCurrentPreview();
    updateStatus("수정 중");
    scheduleSave();
  });

  markdownInput.addEventListener("select", updateSelection);
  markdownInput.addEventListener("mouseup", updateSelection);
  markdownInput.addEventListener("keyup", updateSelection);

  titleInput.addEventListener("input", () => {
    if (!activeDocument) return;
    activeDocument.title = titleInput.value;
    scheduleSave();
  });

  fileNameInput.addEventListener("input", () => {
    if (!activeDocument) return;
    activeDocument.fileName = fileNameInput.value;
    scheduleSave();
  });
}

async function loadCurrentUser() {
  const result = await api("/api/auth/me");
  currentUser = result.user;
  renderAuth();
}

function renderAuth() {
  if (currentUser) {
    authUserEl.textContent = `${currentUser.username} 로그인 중`;
    authLinksEl.classList.add("hidden");
    logoutButton.classList.remove("hidden");
    authorInput.value = currentUser.username;
    chatAuthorInput.value = currentUser.username;
  } else {
    authUserEl.textContent = "로그인이 필요합니다.";
    authLinksEl.classList.remove("hidden");
    logoutButton.classList.add("hidden");
  }
}

async function logout() {
  await api("/api/auth/logout", { method: "POST", body: {} });
  window.location.href = "/login";
}

async function loadDocuments() {
  const result = await api("/api/documents");
  documents = result.documents || [];
  renderDocumentList();
  syncOpenDocumentTitles();
  renderOpenTabs();
}

function renderDocumentList() {
  if (!documents.length) {
    documentListEl.innerHTML = '<div class="empty">저장된 문서가 없습니다.</div>';
    return;
  }

  documentListEl.innerHTML = documents.map((item) => {
    const activeClass = activeDocument && activeDocument.id === item.id ? " active" : "";
    const updated = formatDate(item.updatedAt);
    const owner = item.ownerUsername ? " · " + item.ownerUsername : "";
    return `<button type="button" class="document-item${activeClass}" data-id="${escapeHtml(item.id)}">
      <strong>${escapeHtml(item.title || item.fileName || "제목 없음")}</strong>
      <span>${escapeHtml(item.fileName || "문서")} · ${updated}${escapeHtml(owner)}</span>
    </button>`;
  }).join("");

  documentListEl.querySelectorAll(".document-item").forEach((button) => {
    button.addEventListener("click", () => openDocument(button.dataset.id));
  });
}

function createLocalDocument() {
  activeDocument = {
    id: null,
    title: "새 문서",
    fileName: "new-document.md",
    content: "# 새 문서\n\n마크다운 내용을 작성하세요."
  };
  comments = [];
  chats = [];
  activeCommentGroupKey = "";
  titleInput.value = activeDocument.title;
  fileNameInput.value = activeDocument.fileName;
  markdownInput.value = activeDocument.content;
  resetSelection();
  renderCurrentPreview();
  renderCommentList();
  renderChatList();
  renderDocumentList();
  addOpenDocumentTab(activeDocument);
  renderOpenTabs();
  updateDeleteDocumentButton();
  updateStatus("새 문서");
}

async function openDocument(id) {
  const result = await api(`/api/documents/${encodeURIComponent(id)}`);
  activeDocument = result.document;
  activeCommentGroupKey = "";
  comments = [];
  chats = [];
  titleInput.value = activeDocument.title || "";
  fileNameInput.value = activeDocument.fileName || "";
  markdownInput.value = activeDocument.content || "";
  resetSelection();
  await loadComments();
  await loadChats();
  addOpenDocumentTab(activeDocument);
  renderCurrentPreview();
  renderDocumentList();
  renderOpenTabs();
  updateDeleteDocumentButton();
  updateStatus("불러옴");
}

async function saveActiveDocument() {
  if (!activeDocument) return;
  if (!currentUser) {
    updateStatus("문서를 저장하려면 로그인하세요.", "warn");
    return;
  }
  const previousTabId = activeDocument.id || "__draft__";

  const payload = {
    title: titleInput.value.trim() || "제목 없음",
    fileName: fileNameInput.value.trim() || "document.md",
    content: markdownInput.value
  };

  if (activeDocument.id) {
    const result = await api(`/api/documents/${encodeURIComponent(activeDocument.id)}`, {
      method: "PUT",
      body: payload
    });
    activeDocument = result.document;
  } else {
    const result = await api("/api/documents", {
      method: "POST",
      body: payload
    });
    activeDocument = result.document;
  }

  await loadDocuments();
  replaceOpenDocumentTab(previousTabId, activeDocument);
  addOpenDocumentTab(activeDocument);
  renderOpenTabs();
  updateDeleteDocumentButton();
  updateStatus("저장됨");
}

async function deleteActiveDocument() {
  if (!activeDocument || !activeDocument.id || !activeDocument.canDelete) return;
  const ok = window.confirm("현재 문서를 삭제할까요? 댓글과 채팅도 함께 삭제됩니다.");
  if (!ok) return;

  await api(`/api/documents/${encodeURIComponent(activeDocument.id)}`, {
    method: "DELETE",
    body: {}
  });

  const deletedId = activeDocument.id;
  documents = documents.filter((item) => item.id !== deletedId);
  openDocuments = openDocuments.filter((item) => item.id !== deletedId);
  renderDocumentList();
  renderOpenTabs();
  if (openDocuments.length) {
    await activateOpenTab(openDocuments[0].id);
  } else {
    createLocalDocument();
  }
  updateStatus("문서 삭제됨");
}

function updateDeleteDocumentButton() {
  const canDelete = !!(activeDocument && activeDocument.id && activeDocument.canDelete);
  deleteDocumentButton.disabled = !canDelete;
}

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveActiveDocument().catch(() => updateStatus("저장 실패", "warn"));
  }, 900);
}

async function uploadSelectedFile() {
  if (!currentUser) {
    updateStatus("파일을 업로드하려면 로그인하세요.", "warn");
    fileInput.value = "";
    return;
  }
  const file = fileInput.files && fileInput.files[0];
  if (!file) return;

  if (!/\.(md|markdown|txt)$/i.test(file.name)) {
    updateStatus("마크다운 또는 텍스트 파일만 업로드할 수 있습니다.", "warn");
    fileInput.value = "";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData
  });
  if (!response.ok) {
    updateStatus("업로드 실패", "warn");
    return;
  }

  const result = await response.json();
  fileInput.value = "";
  await loadDocuments();
  await openDocument(result.document.id);
  updateStatus("업로드 저장됨");
}

function addOpenDocumentTab(documentItem) {
  if (!documentItem) return;
  const tabId = documentItem.id || "__draft__";
  const existing = openDocuments.find((item) => item.id === tabId);
  const title = documentItem.title || documentItem.fileName || "새 문서";
  const fileName = documentItem.fileName || "new-document.md";

  if (existing) {
    existing.title = title;
    existing.fileName = fileName;
    return;
  }

  openDocuments.push({ id: tabId, title, fileName });
}

function replaceOpenDocumentTab(previousTabId, documentItem) {
  const tab = openDocuments.find((item) => item.id === previousTabId);
  if (!tab || !documentItem || !documentItem.id) return;
  tab.id = documentItem.id;
  tab.title = documentItem.title || documentItem.fileName || "문서";
  tab.fileName = documentItem.fileName || tab.fileName;
}

function syncOpenDocumentTitles() {
  openDocuments = openDocuments.map((tab) => {
    if (tab.id === "__draft__") return tab;
    const documentItem = documents.find((item) => item.id === tab.id);
    if (!documentItem) return tab;
    return {
      id: tab.id,
      title: documentItem.title || documentItem.fileName || tab.title,
      fileName: documentItem.fileName || tab.fileName
    };
  });
}

function renderOpenTabs() {
  if (!openDocuments.length) {
    openTabsEl.innerHTML = '<span class="open-tabs-empty">열린 문서가 없습니다. 왼쪽 목록에서 문서를 선택하세요.</span>';
    return;
  }

  const activeId = activeDocument ? activeDocument.id || "__draft__" : "";
  openTabsEl.innerHTML = openDocuments.map((tab) => {
    const activeClass = tab.id === activeId ? " active" : "";
    return `<button type="button" class="open-tab${activeClass}" data-tab-id="${escapeHtml(tab.id)}" title="${escapeHtml(tab.fileName || tab.title)}">
      <span class="open-tab-title">${escapeHtml(tab.title || tab.fileName || "문서")}</span>
      <span class="open-tab-close" data-close-id="${escapeHtml(tab.id)}" aria-label="탭 닫기">×</span>
    </button>`;
  }).join("");

  openTabsEl.querySelectorAll(".open-tab").forEach((tabButton) => {
    tabButton.addEventListener("click", (event) => {
      const closeId = event.target.dataset.closeId;
      if (closeId) {
        closeOpenTab(closeId);
        return;
      }
      activateOpenTab(tabButton.dataset.tabId);
    });
  });
}

async function activateOpenTab(tabId) {
  if (tabId === "__draft__") {
    createLocalDocument();
    return;
  }
  await openDocument(tabId);
}

async function closeOpenTab(tabId) {
  const closeIndex = openDocuments.findIndex((tab) => tab.id === tabId);
  if (closeIndex < 0) return;

  const wasActive = activeDocument && (activeDocument.id || "__draft__") === tabId;
  openDocuments.splice(closeIndex, 1);

  if (!wasActive) {
    renderOpenTabs();
    return;
  }

  const nextTab = openDocuments[Math.max(0, closeIndex - 1)] || openDocuments[0];
  if (nextTab) {
    await activateOpenTab(nextTab.id);
  } else {
    createLocalDocument();
  }
  renderOpenTabs();
}

function updateSelection() {
  const start = markdownInput.selectionStart;
  const end = markdownInput.selectionEnd;
  const text = markdownInput.value.slice(start, end).trim();
  selection = { start, end, text };

  if (text && end > start) {
    selectedTextEl.textContent = text;
    selectionHint.textContent = `${text.length.toLocaleString("ko-KR")}자 선택됨`;
    addCommentButton.disabled = false;
    renderCurrentPreview();
  } else {
    resetSelection();
  }
}

function resetSelection() {
  selection = { start: 0, end: 0, text: "" };
  selectedTextEl.textContent = "선택된 영역이 없습니다.";
  selectionHint.textContent = "댓글을 달 영역을 드래그하세요.";
  addCommentButton.disabled = true;
  renderCurrentPreview();
}

async function loadComments() {
  if (!activeDocument || !activeDocument.id) {
    comments = [];
    renderCommentList();
    return;
  }

  const result = await api(`/api/documents/${encodeURIComponent(activeDocument.id)}/comments`);
  comments = result.comments || [];
  renderCommentList();
}

async function loadChats() {
  if (!activeDocument || !activeDocument.id) {
    chats = [];
    renderChatList();
    return;
  }

  const result = await api(`/api/documents/${encodeURIComponent(activeDocument.id)}/chats`);
  chats = result.chats || [];
  renderChatList();
}

async function addComment() {
  if (!activeDocument || !activeDocument.id) {
    await saveActiveDocument();
  }
  if (!activeDocument || !activeDocument.id || !selection.text) return;
  if (!currentUser) {
    updateStatus("댓글을 작성하려면 로그인하세요.", "warn");
    return;
  }

  const body = commentInput.value.trim();
  if (!body) {
    updateStatus("댓글 내용을 입력하세요.", "warn");
    return;
  }

  await postComment({
    author: currentUser.username,
    body,
    selectedText: selection.text,
    start: selection.start,
    end: selection.end,
    files: Array.from(commentAttachmentInput.files || [])
  });

  commentInput.value = "";
  commentAttachmentInput.value = "";
  resetSelection();
  await loadComments();
  renderCurrentPreview();
  updateStatus("댓글 저장됨");
}

async function addReply(parentId, form) {
  if (!activeDocument || !activeDocument.id) return;
  if (!currentUser) {
    updateStatus("답글을 작성하려면 로그인하세요.", "warn");
    return;
  }

  const formData = new FormData(form);
  const body = String(formData.get("body") || "").trim();
  if (!body) {
    updateStatus("답글 내용을 입력하세요.", "warn");
    return;
  }

  const parent = comments.find((comment) => comment.id === parentId);
  if (!parent) return;

  await postComment({
    parentId,
    author: currentUser.username,
    body,
    selectedText: parent.selectedText,
    start: parent.start,
    end: parent.end,
    files: Array.from(form.querySelector('input[type="file"]').files || [])
  });

  await loadComments();
  renderCurrentPreview();
  updateStatus("답글 저장됨");
}

async function postComment(payload) {
  const formData = new FormData();
  formData.append("author", payload.author || "익명");
  formData.append("body", payload.body || "");
  formData.append("selectedText", payload.selectedText || "");
  formData.append("start", String(payload.start || 0));
  formData.append("end", String(payload.end || 0));
  if (payload.parentId) {
    formData.append("parentId", payload.parentId);
  }
  (payload.files || []).forEach((file) => {
    formData.append("attachments", file);
  });

  const response = await fetch(`/api/documents/${encodeURIComponent(activeDocument.id)}/comments`, {
    method: "POST",
    body: formData
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "댓글 저장 실패");
  }
  return result.comment;
}

function renderCommentList() {
  if (!comments.length) {
    commentListEl.innerHTML = '<div class="empty">아직 댓글이 없습니다.</div>';
    return;
  }

  const groups = buildCommentGroups();
  commentListEl.innerHTML = groups.map((group) => {
    const activeClass = group.key === activeCommentGroupKey ? " active" : "";
    const authors = group.authors.join(", ");
    const domKey = encodeCommentKey(group.key);
    return `<article class="comment-group${activeClass}" id="comment-${domKey}" data-comment-key="${domKey}">
      <div class="comment-group-head">
        <strong>${escapeHtml(group.allComments.length)}개 댓글</strong>
        <span>${escapeHtml(authors)}</span>
      </div>
      <div class="comment-target">${escapeHtml(group.selectedText)}</div>
      <div class="comment-thread">
        ${group.rootComments.map((comment) => renderCommentItem(comment, group.repliesByParent.get(comment.id) || [])).join("")}
      </div>
    </article>`;
  }).join("");

  commentListEl.querySelectorAll(".comment-group").forEach((item) => {
    item.addEventListener("click", (event) => {
      if (event.target.closest(".reply-form")) return;
      focusCommentGroup(item.dataset.commentKey);
    });
  });

  commentListEl.querySelectorAll(".reply-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      addReply(form.dataset.parentId, form).catch(() => updateStatus("답글 저장 실패", "warn"));
    });
  });

  commentListEl.querySelectorAll("[data-delete-comment-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteComment(button.dataset.deleteCommentId);
    });
  });
}

function renderCommentItem(comment, replies) {
  return `<div class="comment-item">
    <div class="comment-meta">
      <strong>${escapeHtml(comment.author)}</strong>
      <span>${formatDate(comment.createdAt)}</span>
    </div>
    <p class="comment-body">${escapeHtml(comment.body)}</p>
    ${renderAttachments(comment.attachments)}
    ${replies.length ? `<div class="reply-list">${replies.map((reply) => renderReplyItem(reply)).join("")}</div>` : ""}
    ${comment.canDelete ? `<button type="button" class="item-delete" data-delete-comment-id="${escapeHtml(comment.id)}">댓글 삭제</button>` : ""}
    <form class="reply-form" data-parent-id="${escapeHtml(comment.id)}">
      <input name="author" type="text" placeholder="답글 작성자">
      <textarea name="body" rows="2" placeholder="답글 내용"></textarea>
      <input name="attachments" type="file" multiple>
      <button type="submit">답글 저장</button>
    </form>
  </div>`;
}

function renderReplyItem(reply) {
  return `<div class="reply-item">
    <div class="comment-meta">
      <strong>${escapeHtml(reply.author)}</strong>
      <span>${formatDate(reply.createdAt)}</span>
    </div>
    <p class="comment-body">${escapeHtml(reply.body)}</p>
    ${renderAttachments(reply.attachments)}
    ${reply.canDelete ? `<button type="button" class="item-delete" data-delete-comment-id="${escapeHtml(reply.id)}">답글 삭제</button>` : ""}
  </div>`;
}

async function deleteComment(commentId) {
  await api(`/api/comments/${encodeURIComponent(commentId)}`, {
    method: "DELETE",
    body: {}
  });
  await loadComments();
  renderCurrentPreview();
  updateStatus("댓글 삭제됨");
}

function renderAttachments(attachments) {
  if (!attachments || !attachments.length) return "";
  return `<div class="attachment-list">
    ${attachments.map((attachment) => {
      return `<span class="attachment-item">${escapeHtml(attachment.originalName)} · ${formatSize(attachment.size)}</span>`;
    }).join("")}
  </div>`;
}

function renderCurrentPreview() {
  const groups = buildCommentGroups();
  previewCommentGroupsByKey = new Map(groups.map((group) => [group.key, group]));
  const markedMarkdown = applyPreviewMarkers(markdownInput.value, groups);
  const blocks = parseMarkdown(markedMarkdown);
  previewEl.innerHTML = renderPreview(blocks);
  previewEl.querySelectorAll(".comment-highlight").forEach((item) => {
    item.addEventListener("click", () => {
      focusCommentGroup(item.dataset.commentKey);
    });
  });
}

function buildCommentGroups() {
  const groupMap = new Map();

  const rootComments = comments.filter((comment) => !comment.parentId);
  const replyComments = comments.filter((comment) => comment.parentId);
  const repliesByParent = new Map();

  replyComments.forEach((reply) => {
    if (!repliesByParent.has(reply.parentId)) {
      repliesByParent.set(reply.parentId, []);
    }
    repliesByParent.get(reply.parentId).push(reply);
  });

  rootComments.forEach((comment) => {
    const selectedText = String(comment.selectedText || "").trim();
    if (!selectedText) return;
    const key = [
      Number(comment.start) || 0,
      Number(comment.end) || 0,
      normalizeCommentText(selectedText)
    ].join("-");

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        key,
        selectedText,
        start: Number(comment.start) || 0,
        end: Number(comment.end) || 0,
        rootComments: [],
        allComments: [],
        repliesByParent,
        authors: []
      });
    }

    const group = groupMap.get(key);
    const replies = repliesByParent.get(comment.id) || [];
    group.rootComments.push(comment);
    group.allComments.push(comment, ...replies);
    [comment, ...replies].forEach((item) => {
      if (!group.authors.includes(item.author)) {
        group.authors.push(item.author);
      }
    });
  });

  return Array.from(groupMap.values()).sort((a, b) => a.start - b.start);
}

function focusCommentGroup(key) {
  activeCommentGroupKey = decodeCommentKey(key || "");
  setSidePanel("comments");
  renderCommentList();
  renderCurrentPreview();

  const commentEl = document.getElementById(`comment-${encodeCommentKey(activeCommentGroupKey)}`);
  if (commentEl) {
    commentEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  const highlightEl = previewEl.querySelector(".comment-highlight.active");
  if (highlightEl) {
    highlightEl.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}

function setSidePanel(panelName) {
  const isChat = panelName === "chat";
  commentsTabButton.classList.toggle("active", !isChat);
  chatTabButton.classList.toggle("active", isChat);
  commentsPanel.classList.toggle("active", !isChat);
  chatPanel.classList.toggle("active", isChat);
}

async function sendChatMessage() {
  if (!activeDocument || !activeDocument.id) {
    await saveActiveDocument();
  }
  if (!activeDocument || !activeDocument.id) return;
  if (!currentUser) {
    updateStatus("채팅을 작성하려면 로그인하세요.", "warn");
    return;
  }

  const message = chatMessageInput.value.trim();
  if (!message) {
    updateStatus("채팅 메시지를 입력하세요.", "warn");
    return;
  }

  await api(`/api/documents/${encodeURIComponent(activeDocument.id)}/chats`, {
    method: "POST",
    body: {
      author: currentUser.username,
      message
    }
  });

  chatMessageInput.value = "";
  await loadChats();
  updateStatus("채팅 저장됨");
}

function renderChatList() {
  if (!chats.length) {
    chatListEl.innerHTML = '<div class="empty">아직 채팅이 없습니다.</div>';
    return;
  }

  chatListEl.innerHTML = chats.map((chat) => {
    return `<article class="chat-item">
      <div class="comment-meta">
        <strong>${escapeHtml(chat.author)}</strong>
        <span>${formatDate(chat.createdAt)}</span>
      </div>
      <p>${escapeHtml(chat.message)}</p>
      ${chat.canDelete ? `<button type="button" class="item-delete" data-delete-chat-id="${escapeHtml(chat.id)}">채팅 삭제</button>` : ""}
    </article>`;
  }).join("");
  chatListEl.querySelectorAll("[data-delete-chat-id]").forEach((button) => {
    button.addEventListener("click", () => deleteChat(button.dataset.deleteChatId));
  });
  chatListEl.scrollTop = chatListEl.scrollHeight;
}

async function deleteChat(chatId) {
  await api(`/api/chats/${encodeURIComponent(chatId)}`, {
    method: "DELETE",
    body: {}
  });
  await loadChats();
  updateStatus("채팅 삭제됨");
}

function applyPreviewMarkers(markdown, groups) {
  let output = String(markdown || "");
  const markers = [];

  groups.forEach((group) => {
    if (group.start >= 0 && group.end > group.start && group.end <= output.length) {
      const key = encodeCommentKey(group.key);
      markers.push({ index: group.end, text: `{{COMMENT_END:${key}}}` });
      markers.push({ index: group.start, text: `{{COMMENT_START:${key}}}` });
    }
  });

  if (selection.text && selection.end > selection.start && selection.end <= output.length) {
    markers.push({ index: selection.end, text: "{{DRAFT_END}}" });
    markers.push({ index: selection.start, text: "{{DRAFT_START}}" });
  }

  markers
    .sort((a, b) => b.index - a.index || b.text.localeCompare(a.text))
    .forEach((marker) => {
      output = output.slice(0, marker.index) + marker.text + output.slice(marker.index);
    });

  return output;
}

function downloadWord() {
  const title = titleInput.value.trim() || "Markdown Document";
  const fileName = toDocxName(fileNameInput.value || title);
  const blocks = parseMarkdown(markdownInput.value);
  const blob = createDocx(blocks, title);
  downloadBlob(blob, fileName);
}

async function api(url, options = {}) {
  const fetchOptions = {
    method: options.method || "GET",
    headers: {},
  };
  if (options.body) {
    fetchOptions.headers["Content-Type"] = "application/json";
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "요청 실패");
  }
  return payload;
}

function updateStatus(message, type) {
  documentStatus.textContent = message;
  documentStatus.style.color = type === "warn" ? "var(--warn)" : "var(--muted)";
}

function parseMarkdown(markdown) {
  const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let paragraph = [];
  let code = null;

  function flushParagraph() {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (/^```/.test(trimmed)) {
      if (code) {
        blocks.push({ type: "code", text: code.lines.join("\n"), lang: code.lang });
        code = null;
      } else {
        flushParagraph();
        code = { lang: trimmed.slice(3).trim(), lines: [] };
      }
      continue;
    }

    if (code) {
      code.lines.push(line);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2].trim() });
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushParagraph();
      blocks.push({ type: "hr" });
      continue;
    }

    if (isTableStart(lines, i)) {
      flushParagraph();
      const headers = splitTableRow(lines[i]);
      const rows = [];
      i += 2;
      while (i < lines.length && /^\s*\|?.+\|.+/.test(lines[i])) {
        rows.push(splitTableRow(lines[i]));
        i += 1;
      }
      i -= 1;
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    const ordered = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      blocks.push({ type: "list", ordered: true, text: ordered[2].trim() });
      continue;
    }

    const unordered = trimmed.match(/^[-*+]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      blocks.push({ type: "list", ordered: false, text: unordered[1].trim() });
      continue;
    }

    const quote = trimmed.match(/^>\s?(.+)$/);
    if (quote) {
      flushParagraph();
      blocks.push({ type: "quote", text: quote[1].trim() });
      continue;
    }

    paragraph.push(trimmed);
  }

  if (code) blocks.push({ type: "code", text: code.lines.join("\n"), lang: code.lang });
  flushParagraph();
  return blocks;
}

function isTableStart(lines, index) {
  if (index + 1 >= lines.length) return false;
  return /^\s*\|?.+\|.+/.test(lines[index]) && /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(lines[index + 1]);
}

function splitTableRow(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function renderPreview(blocks) {
  if (!blocks.length) return '<div class="empty">문서 내용이 비어 있습니다.</div>';

  const renderState = { activeKey: "" };
  return blocks.map((block) => {
    if (block.type === "heading") {
      const level = Math.min(block.level, 3);
      return `<h${level}>${inlineHtml(block.text, renderState)}</h${level}>`;
    }
    if (block.type === "paragraph") return `<p>${inlineHtml(block.text, renderState)}</p>`;
    if (block.type === "quote") return `<blockquote>${inlineHtml(block.text, renderState)}</blockquote>`;
    if (block.type === "list") {
      const tag = block.ordered ? "ol" : "ul";
      return `<${tag}><li>${inlineHtml(block.text, renderState)}</li></${tag}>`;
    }
    if (block.type === "code") return `<pre><code>${escapeHtml(block.text)}</code></pre>`;
    if (block.type === "hr") return "<hr>";
    if (block.type === "table") {
      const headers = block.headers.map((cell) => `<th>${inlineHtml(cell, renderState)}</th>`).join("");
      const rows = block.rows.map((row) => {
        return "<tr>" + row.map((cell) => `<td>${inlineHtml(cell, renderState)}</td>`).join("") + "</tr>";
      }).join("");
      return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    }
    return "";
  }).join("");
}

function inlineHtml(text, renderState) {
  const markerPattern = /\{\{(COMMENT_(START|END):([^}]+)|DRAFT_(START|END))\}\}/g;
  let html = "";
  let cursor = 0;
  let match;

  if (renderState.activeKey) {
    html += openCommentMark(renderState.activeKey);
  }

  while ((match = markerPattern.exec(text)) !== null) {
    if (match.index > cursor) {
      html += inlinePlainHtml(text.slice(cursor, match.index));
    }

    if (match[4]) {
      if (match[4] === "START") {
        if (renderState.activeKey) html += "</mark>";
        renderState.activeKey = "__draft__";
        html += '<mark class="draft-highlight">';
      } else if (renderState.activeKey === "__draft__") {
        html += "</mark>";
        renderState.activeKey = "";
      }
      cursor = markerPattern.lastIndex;
      continue;
    }

    const key = decodeCommentKey(match[3]);
    if (match[2] === "START") {
      if (renderState.activeKey) html += "</mark>";
      renderState.activeKey = key;
      html += openCommentMark(key);
    } else if (renderState.activeKey) {
      html += commentCountHtml(renderState.activeKey) + "</mark>";
      renderState.activeKey = "";
    }
    cursor = markerPattern.lastIndex;
  }

  if (cursor < text.length) {
    html += inlinePlainHtml(text.slice(cursor));
  }
  if (renderState.activeKey) {
    html += (renderState.activeKey === "__draft__" ? "" : commentCountHtml(renderState.activeKey)) + "</mark>";
  }
  return html;
}

function openCommentMark(key) {
  const group = previewCommentGroupsByKey.get(key);
  const activeClass = key === activeCommentGroupKey ? " active" : "";
  const authors = group ? group.authors.join(", ") : "";
  return `<mark class="comment-highlight${activeClass}" data-comment-key="${encodeCommentKey(key)}" title="${escapeHtml(authors)}">`;
}

function commentCountHtml(key) {
  const group = previewCommentGroupsByKey.get(key);
  if (!group) return "";
  return `<span class="comment-count">${group.allComments.length}</span>`;
}

function inlinePlainHtml(text) {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return html;
}

function findHighlights(text, commentGroups) {
  const candidates = [];
  const normalizedText = normalizeCommentText(text);

  commentGroups.forEach((group) => {
    const selected = normalizeCommentText(group.selectedText);
    if (!selected) return;

    const directIndex = text.indexOf(group.selectedText);
    if (directIndex >= 0) {
      candidates.push({
        start: directIndex,
        end: directIndex + group.selectedText.length,
        group
      });
      return;
    }

    const normalizedIndex = normalizedText.indexOf(selected);
    if (normalizedIndex >= 0) {
      candidates.push({
        start: normalizedIndex,
        end: normalizedIndex + selected.length,
        group
      });
    }
  });

  return candidates
    .sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start))
    .filter((candidate, index, sorted) => {
      const previous = sorted.slice(0, index).find((item) => candidate.start < item.end);
      return !previous;
    });
}

function normalizeCommentText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function encodeCommentKey(value) {
  return encodeURIComponent(String(value || ""));
}

function decodeCommentKey(value) {
  try {
    return decodeURIComponent(String(value || ""));
  } catch (error) {
    return String(value || "");
  }
}

function createDocx(blocks, title) {
  return new Blob([createDocxBytes(blocks, title)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });
}

function createDocxBytes(blocks, title) {
  const files = {
    "[Content_Types].xml": contentTypesXml(),
    "_rels/.rels": relsXml(),
    "docProps/core.xml": coreXml(title),
    "docProps/app.xml": appXml(),
    "word/_rels/document.xml.rels": documentRelsXml(),
    "word/styles.xml": stylesXml(),
    "word/document.xml": documentXml(blocks)
  };
  return zipStore(files);
}

function documentXml(blocks) {
  const body = blocks.map(blockToWordXml).join("");
  return xmlHeader() +
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    "<w:body>" + body +
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>' +
    "</w:body></w:document>";
}

function blockToWordXml(block) {
  if (block.type === "heading") {
    const size = block.level === 1 ? 36 : block.level === 2 ? 30 : 26;
    return paragraphXml(block.text, { bold: true, size, spacingBefore: 180, spacingAfter: 80 });
  }
  if (block.type === "paragraph") return paragraphXml(block.text, {});
  if (block.type === "quote") return paragraphXml(block.text, { italic: true, indent: 360, color: "475467" });
  if (block.type === "list") return paragraphXml((block.ordered ? "1. " : "- ") + block.text, { indent: 360, hanging: 260 });
  if (block.type === "code") return paragraphXml(block.text, { mono: true, size: 19, shading: "F2F4F7" });
  if (block.type === "hr") return '<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="D0D5DD"/></w:pBdr></w:pPr></w:p>';
  if (block.type === "table") return tableXml(block);
  return "";
}

function paragraphXml(text, options) {
  const pPr = [];
  if (options.spacingBefore || options.spacingAfter) {
    pPr.push(`<w:spacing w:before="${options.spacingBefore || 0}" w:after="${options.spacingAfter || 120}"/>`);
  } else {
    pPr.push('<w:spacing w:after="120"/>');
  }
  if (options.indent) {
    pPr.push(`<w:ind w:left="${options.indent}"${options.hanging ? ` w:hanging="${options.hanging}"` : ""}/>`);
  }
  if (options.shading) {
    pPr.push(`<w:shd w:val="clear" w:color="auto" w:fill="${options.shading}"/>`);
  }
  return `<w:p><w:pPr>${pPr.join("")}</w:pPr>${inlineWordRuns(text, options)}</w:p>`;
}

function inlineWordRuns(text, options) {
  return tokenizeInline(text).map((token) => {
    const runOptions = Object.assign({}, options);
    if (token.bold) runOptions.bold = true;
    if (token.italic) runOptions.italic = true;
    if (token.code) {
      runOptions.mono = true;
      runOptions.shading = "EEF2F7";
    }
    return runXml(token.text, runOptions);
  }).join("");
}

function tokenizeInline(text) {
  const tokens = [];
  const pattern = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) tokens.push({ text: text.slice(lastIndex, match.index) });
    const value = match[0];
    if (value.startsWith("**") || value.startsWith("__")) {
      tokens.push({ text: value.slice(2, -2), bold: true });
    } else if (value.startsWith("`")) {
      tokens.push({ text: value.slice(1, -1), code: true });
    } else if (value.startsWith("*") || value.startsWith("_")) {
      tokens.push({ text: value.slice(1, -1), italic: true });
    } else {
      const link = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      tokens.push({ text: link ? `${link[1]} (${link[2]})` : value });
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) tokens.push({ text: text.slice(lastIndex) });
  return tokens;
}

function runXml(text, options) {
  const props = [];
  const font = options.mono ? "Consolas" : "Malgun Gothic";
  props.push(`<w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:eastAsia="${font}"/>`);
  props.push(`<w:sz w:val="${options.size || 22}"/>`);
  if (options.bold) props.push("<w:b/>");
  if (options.italic) props.push("<w:i/>");
  if (options.color) props.push(`<w:color w:val="${options.color}"/>`);
  if (options.shading) props.push(`<w:shd w:val="clear" w:color="auto" w:fill="${options.shading}"/>`);
  return `<w:r><w:rPr>${props.join("")}</w:rPr>${textXml(text)}</w:r>`;
}

function textXml(text) {
  return String(text).split("\n").map((line, index) => {
    const prefix = index > 0 ? "<w:br/>" : "";
    return prefix + `<w:t xml:space="preserve">${escapeXml(line)}</w:t>`;
  }).join("");
}

function tableXml(block) {
  const rows = [block.headers, ...block.rows].map((row, rowIndex) => {
    const cells = row.map((cell) => {
      const shade = rowIndex === 0 ? '<w:shd w:val="clear" w:color="auto" w:fill="EEF2F7"/>' : "";
      return '<w:tc><w:tcPr><w:tcW w:w="2500" w:type="pct"/>' + shade + '</w:tcPr>' +
        paragraphXml(cell, { bold: rowIndex === 0, spacingAfter: 0 }) +
        "</w:tc>";
    }).join("");
    return "<w:tr>" + cells + "</w:tr>";
  }).join("");
  return '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders><w:top w:val="single" w:sz="4" w:color="D0D5DD"/><w:left w:val="single" w:sz="4" w:color="D0D5DD"/><w:bottom w:val="single" w:sz="4" w:color="D0D5DD"/><w:right w:val="single" w:sz="4" w:color="D0D5DD"/><w:insideH w:val="single" w:sz="4" w:color="D0D5DD"/><w:insideV w:val="single" w:sz="4" w:color="D0D5DD"/></w:tblBorders></w:tblPr>' + rows + "</w:tbl>";
}

function contentTypesXml() {
  return xmlHeader() +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
    '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
    '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
    '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>' +
    "</Types>";
}

function relsXml() {
  return xmlHeader() +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
    '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>' +
    "</Relationships>";
}

function documentRelsXml() {
  return xmlHeader() + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>';
}

function coreXml(title) {
  const now = new Date().toISOString();
  return xmlHeader() +
    '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
    `<dc:title>${escapeXml(title)}</dc:title><dc:creator>Markdown Editor</dc:creator>` +
    `<cp:lastModifiedBy>Markdown Editor</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>` +
    "</cp:coreProperties>";
}

function appXml() {
  return xmlHeader() +
    '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">' +
    "<Application>Markdown Editor</Application></Properties>";
}

function stylesXml() {
  return xmlHeader() +
    '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
    '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Malgun Gothic" w:hAnsi="Malgun Gothic" w:eastAsia="Malgun Gothic"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>' +
    "</w:styles>";
}

function zipStore(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  let count = 0;

  Object.keys(files).forEach((name) => {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(String(files[name]));
    const crc = crc32(data);
    const localHeader = concatBytes(
      u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(crc),
      u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), nameBytes
    );
    localParts.push(localHeader, data);
    const centralHeader = concatBytes(
      u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(crc),
      u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), u16(0),
      u16(0), u16(0), u32(0), u32(offset), nameBytes
    );
    centralParts.push(centralHeader);
    offset += localHeader.length + data.length;
    count += 1;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const endRecord = concatBytes(
    u32(0x06054b50), u16(0), u16(0), u16(count), u16(count),
    u32(centralSize), u32(offset), u16(0)
  );
  return concatBytes(...localParts, ...centralParts, endRecord);
}

function crc32(bytes) {
  let crc = -1;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function concatBytes(...arrays) {
  const size = arrays.reduce((sum, array) => sum + array.length, 0);
  const merged = new Uint8Array(size);
  let offset = 0;
  arrays.forEach((array) => {
    merged.set(array, offset);
    offset += array.length;
  });
  return merged;
}

function u16(value) {
  return new Uint8Array([value & 255, (value >>> 8) & 255]);
}

function u32(value) {
  return new Uint8Array([value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255]);
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function toDocxName(value) {
  const base = String(value || "document").replace(/\.[^.]+$/, "").replace(/[\\/:*?"<>|]/g, "_").trim();
  return (base || "document") + ".docx";
}

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatSize(bytes) {
  const size = Number(bytes) || 0;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function xmlHeader() {
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
}
