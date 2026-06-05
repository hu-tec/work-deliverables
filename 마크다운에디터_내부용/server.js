const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DATA_DIR = path.join(ROOT_DIR, "data");
const UPLOAD_DIR = path.join(ROOT_DIR, "uploads");
const ATTACHMENT_DIR = path.join(UPLOAD_DIR, "attachments");
const DB_PATH = path.join(DATA_DIR, "app-db.json");
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const LAN_IP = process.env.LAN_IP || "<ipconfig IPv4>";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

const AUTH_PAGES = {
  "/login": "/login.html",
  "/login.html": "/login.html",
  "/signup": "/signup.html",
  "/signup.html": "/signup.html"
};

ensureStorage();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");

    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }

    if (handlePageMiddleware(req, res, url)) {
      return;
    }

    serveStatic(res, url.pathname);
  } catch (error) {
    sendJson(res, 500, { error: "서버 오류가 발생했습니다." });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Markdown editor server running`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`LAN:   http://${LAN_IP}:${PORT}`);
  console.log(`API:   http://${LAN_IP}:${PORT}/api`);
});

async function handleApi(req, res, url) {
  const method = req.method || "GET";
  const db = readDb();
  const currentUser = getCurrentUser(req, db);

  if (method === "GET" && url.pathname === "/api/auth/me") {
    sendJson(res, 200, { user: publicUser(currentUser) });
    return;
  }

  if (method === "POST" && url.pathname === "/api/auth/signup") {
    const body = await readJsonBody(req);
    const username = cleanText(body.username);
    const password = String(body.password || "");
    if (!/^[a-zA-Z0-9가-힣_.-]{2,24}$/.test(username) || password.length < 4) {
      sendJson(res, 400, { error: "사용자명은 2-24자, 비밀번호는 4자 이상이어야 합니다." });
      return;
    }
    if (db.users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
      sendJson(res, 409, { error: "이미 사용 중인 사용자명입니다." });
      return;
    }
    const user = {
      id: createId(),
      username,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    const session = createSession(db, user.id);
    writeDb(db);
    sendSessionCookie(res, session.id, 201, { user: publicUser(user) });
    return;
  }

  if (method === "POST" && url.pathname === "/api/auth/login") {
    const body = await readJsonBody(req);
    const username = cleanText(body.username);
    const password = String(body.password || "");
    const user = db.users.find((item) => item.username.toLowerCase() === username.toLowerCase());
    if (!user || !verifyPassword(password, user.passwordHash)) {
      sendJson(res, 401, { error: "사용자명 또는 비밀번호가 올바르지 않습니다." });
      return;
    }
    const session = createSession(db, user.id);
    writeDb(db);
    sendSessionCookie(res, session.id, 200, { user: publicUser(user) });
    return;
  }

  if (method === "POST" && url.pathname === "/api/auth/logout") {
    const sessionId = getSessionId(req);
    if (sessionId) {
      db.sessions = db.sessions.filter((session) => session.id !== sessionId);
      writeDb(db);
    }
    clearSessionCookie(res, { ok: true });
    return;
  }

  if (method === "GET" && url.pathname === "/api/documents") {
    const documents = db.documents
      .slice()
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(({ id, title, fileName, sourcePath, ownerId, ownerUsername, createdAt, updatedAt }) => ({
        id,
        title,
        fileName,
        sourcePath,
        ownerId,
        ownerUsername,
        canDelete: canManage(currentUser, { ownerId }),
        createdAt,
        updatedAt
      }));
    sendJson(res, 200, { documents });
    return;
  }

  if (method === "POST" && url.pathname === "/api/documents") {
    if (!requireUser(res, currentUser)) return;
    const body = await readJsonBody(req);
    const now = new Date().toISOString();
    const document = {
      id: createId(),
      title: cleanText(body.title) || "새 문서",
      fileName: safeFileName(body.fileName || "new-document.md"),
      content: String(body.content || ""),
      sourcePath: null,
      ownerId: currentUser.id,
      ownerUsername: currentUser.username,
      createdAt: now,
      updatedAt: now
    };
    db.documents.push(document);
    writeDb(db);
    sendJson(res, 201, { document });
    return;
  }

  if (method === "POST" && url.pathname === "/api/upload") {
    if (!requireUser(res, currentUser)) return;
    const form = await readMultipartForm(req);
    const upload = form.files.find((file) => file.fieldName === "file");
    if (!upload) {
      sendJson(res, 400, { error: "업로드할 파일이 없습니다." });
      return;
    }
    const now = new Date().toISOString();
    const storedName = `${Date.now()}-${createId()}-${safeFileName(upload.fileName)}`;
    const storedPath = path.join(UPLOAD_DIR, storedName);
    fs.writeFileSync(storedPath, upload.content);

    const document = {
      id: createId(),
      title: upload.fileName.replace(/\.[^.]+$/, "") || "업로드 문서",
      fileName: safeFileName(upload.fileName),
      content: upload.content.toString("utf8"),
      sourcePath: path.join("uploads", storedName),
      ownerId: currentUser.id,
      ownerUsername: currentUser.username,
      createdAt: now,
      updatedAt: now
    };
    db.documents.push(document);
    writeDb(db);
    sendJson(res, 201, { document });
    return;
  }

  const documentMatch = url.pathname.match(/^\/api\/documents\/([^/]+)$/);
  if (documentMatch && method === "GET") {
    const document = db.documents.find((item) => item.id === documentMatch[1]);
    if (!document) {
      sendJson(res, 404, { error: "문서를 찾을 수 없습니다." });
      return;
    }
    sendJson(res, 200, { document: Object.assign({}, document, { canDelete: canManage(currentUser, document) }) });
    return;
  }

  if (documentMatch && method === "PUT") {
    if (!requireUser(res, currentUser)) return;
    const body = await readJsonBody(req);
    const document = db.documents.find((item) => item.id === documentMatch[1]);
    if (!document) {
      sendJson(res, 404, { error: "문서를 찾을 수 없습니다." });
      return;
    }
    document.title = cleanText(body.title) || document.title;
    document.content = String(body.content || "");
    document.fileName = safeFileName(body.fileName || document.fileName || `${document.title}.md`);
    document.updatedAt = new Date().toISOString();
    writeDb(db);
    sendJson(res, 200, { document });
    return;
  }

  if (documentMatch && method === "DELETE") {
    if (!requireUser(res, currentUser)) return;
    const document = db.documents.find((item) => item.id === documentMatch[1]);
    if (!document) {
      sendJson(res, 404, { error: "문서를 찾을 수 없습니다." });
      return;
    }
    if (!canManage(currentUser, document)) {
      sendJson(res, 403, { error: "직접 작성한 문서만 삭제할 수 있습니다." });
      return;
    }
    const documentId = document.id;
    const commentIds = db.comments.filter((comment) => comment.documentId === documentId).map((comment) => comment.id);
    db.documents = db.documents.filter((item) => item.id !== documentId);
    db.comments = db.comments.filter((comment) => comment.documentId !== documentId);
    db.attachments = db.attachments.filter((attachment) => !commentIds.includes(attachment.commentId));
    db.chats = db.chats.filter((chat) => chat.documentId !== documentId);
    writeDb(db);
    sendJson(res, 200, { ok: true });
    return;
  }

  const commentsMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/comments$/);
  if (commentsMatch && method === "GET") {
    const comments = db.comments
      .filter((comment) => comment.documentId === commentsMatch[1])
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((comment) => Object.assign(withCommentAttachments(db, comment), {
        canDelete: canManage(currentUser, comment)
      }));
    sendJson(res, 200, { comments });
    return;
  }

  if (commentsMatch && method === "POST") {
    if (!requireUser(res, currentUser)) return;
    const requestData = await readCommentRequest(req);
    const body = requestData.fields;
    const document = db.documents.find((item) => item.id === commentsMatch[1]);
    if (!document) {
      sendJson(res, 404, { error: "문서를 찾을 수 없습니다." });
      return;
    }
    const comment = {
      id: createId(),
      documentId: document.id,
      parentId: cleanText(body.parentId) || null,
      author: currentUser.username,
      ownerId: currentUser.id,
      ownerUsername: currentUser.username,
      body: cleanText(body.body),
      selectedText: cleanText(body.selectedText),
      start: Number.isFinite(Number(body.start)) ? Number(body.start) : 0,
      end: Number.isFinite(Number(body.end)) ? Number(body.end) : 0,
      createdAt: new Date().toISOString()
    };
    if (comment.parentId) {
      const parent = db.comments.find((item) => item.id === comment.parentId && item.documentId === document.id);
      if (!parent) {
        sendJson(res, 404, { error: "원 댓글을 찾을 수 없습니다." });
        return;
      }
      comment.selectedText = parent.selectedText;
      comment.start = parent.start;
      comment.end = parent.end;
    }
    if (!comment.body || !comment.selectedText || comment.end <= comment.start) {
      sendJson(res, 400, { error: "선택 영역과 댓글 내용을 입력해야 합니다." });
      return;
    }
    db.comments.push(comment);
    const attachments = saveAttachments(db, comment.id, requestData.files);
    writeDb(db);
    sendJson(res, 201, { comment: Object.assign({}, comment, { attachments }) });
    return;
  }

  const commentMatch = url.pathname.match(/^\/api\/comments\/([^/]+)$/);
  if (commentMatch && method === "DELETE") {
    if (!requireUser(res, currentUser)) return;
    const comment = db.comments.find((item) => item.id === commentMatch[1]);
    if (!comment) {
      sendJson(res, 404, { error: "댓글을 찾을 수 없습니다." });
      return;
    }
    if (!canManage(currentUser, comment)) {
      sendJson(res, 403, { error: "직접 작성한 댓글만 삭제할 수 있습니다." });
      return;
    }
    const deleteIds = collectCommentThreadIds(db, comment.id);
    db.comments = db.comments.filter((item) => !deleteIds.includes(item.id));
    db.attachments = db.attachments.filter((attachment) => !deleteIds.includes(attachment.commentId));
    writeDb(db);
    sendJson(res, 200, { ok: true });
    return;
  }

  const chatsMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/chats$/);
  if (chatsMatch && method === "GET") {
    const chats = db.chats
      .filter((chat) => chat.documentId === chatsMatch[1])
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((chat) => Object.assign({}, chat, { canDelete: canManage(currentUser, chat) }));
    sendJson(res, 200, { chats });
    return;
  }

  if (chatsMatch && method === "POST") {
    if (!requireUser(res, currentUser)) return;
    const body = await readJsonBody(req);
    const document = db.documents.find((item) => item.id === chatsMatch[1]);
    if (!document) {
      sendJson(res, 404, { error: "문서를 찾을 수 없습니다." });
      return;
    }
    const chat = {
      id: createId(),
      documentId: document.id,
      author: currentUser.username,
      ownerId: currentUser.id,
      ownerUsername: currentUser.username,
      message: cleanText(body.message),
      createdAt: new Date().toISOString()
    };
    if (!chat.message) {
      sendJson(res, 400, { error: "채팅 메시지를 입력해야 합니다." });
      return;
    }
    db.chats.push(chat);
    writeDb(db);
    sendJson(res, 201, { chat });
    return;
  }

  const chatMatch = url.pathname.match(/^\/api\/chats\/([^/]+)$/);
  if (chatMatch && method === "DELETE") {
    if (!requireUser(res, currentUser)) return;
    const chat = db.chats.find((item) => item.id === chatMatch[1]);
    if (!chat) {
      sendJson(res, 404, { error: "채팅을 찾을 수 없습니다." });
      return;
    }
    if (!canManage(currentUser, chat)) {
      sendJson(res, 403, { error: "직접 작성한 채팅만 삭제할 수 있습니다." });
      return;
    }
    db.chats = db.chats.filter((item) => item.id !== chat.id);
    writeDb(db);
    sendJson(res, 200, { ok: true });
    return;
  }

  sendJson(res, 404, { error: "요청한 API를 찾을 수 없습니다." });
}

function ensureStorage() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  fs.mkdirSync(ATTACHMENT_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    writeDb({ documents: [], comments: [], attachments: [], chats: [], users: [], sessions: [] });
  }
}

function readDb() {
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  db.documents = Array.isArray(db.documents) ? db.documents : [];
  db.comments = Array.isArray(db.comments) ? db.comments : [];
  db.attachments = Array.isArray(db.attachments) ? db.attachments : [];
  db.chats = Array.isArray(db.chats) ? db.chats : [];
  db.users = Array.isArray(db.users) ? db.users : [];
  db.sessions = Array.isArray(db.sessions) ? db.sessions : [];
  db.comments.forEach((comment) => {
    if (!Object.prototype.hasOwnProperty.call(comment, "parentId")) {
      comment.parentId = null;
    }
  });
  return db;
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function serveStatic(res, requestPath) {
  const cleanPath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, cleanPath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendJson(res, 403, { error: "접근할 수 없는 경로입니다." });
    return;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    sendJson(res, 404, { error: "파일을 찾을 수 없습니다." });
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

function handlePageMiddleware(req, res, url) {
  const method = req.method || "GET";
  if (method !== "GET") return false;

  const db = readDb();
  const currentUser = getCurrentUser(req, db);
  const isAppPage = url.pathname === "/" || url.pathname === "/index.html";

  if (isAppPage && !currentUser) {
    redirect(res, "/login");
    return true;
  }

  if (isAppPage) {
    serveStatic(res, "/index.html");
    return true;
  }

  if (Object.prototype.hasOwnProperty.call(AUTH_PAGES, url.pathname)) {
    if (currentUser) {
      redirect(res, "/");
      return true;
    }
    serveStatic(res, AUTH_PAGES[url.pathname]);
    return true;
  }

  return false;
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function readCommentRequest(req) {
  const contentType = req.headers["content-type"] || "";
  if (contentType.startsWith("multipart/form-data")) {
    return readMultipartForm(req);
  }
  return readJsonBody(req).then((fields) => ({ fields, files: [] }));
}

function readMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers["content-type"] || "";
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
      reject(new Error("multipart boundary is missing"));
      return;
    }

    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const buffer = Buffer.concat(chunks);
        const boundary = Buffer.from(`--${boundaryMatch[1]}`);
        const fields = {};
        const files = [];

        splitMultipart(buffer, boundary).forEach((part) => {
          const fieldNameMatch = part.header.match(/name="([^"]+)"/);
          if (!fieldNameMatch) return;

          const fileNameMatch = part.header.match(/filename="([^"]*)"/);
          const fieldName = fieldNameMatch[1];
          if (fileNameMatch && fileNameMatch[1]) {
            const contentTypeMatch = part.header.match(/Content-Type:\s*([^\r\n]+)/i);
            files.push({
              fieldName,
              fileName: fileNameMatch[1],
              mimeType: contentTypeMatch ? contentTypeMatch[1].trim() : "application/octet-stream",
              content: part.body
            });
            return;
          }

          fields[fieldName] = part.body.toString("utf8");
        });
        resolve({ fields, files });
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function splitMultipart(buffer, boundary) {
  const parts = [];
  let cursor = 0;

  while (cursor < buffer.length) {
    const start = buffer.indexOf(boundary, cursor);
    if (start < 0) break;
    const bodyStart = start + boundary.length + 2;
    const next = buffer.indexOf(boundary, bodyStart);
    if (next < 0) break;
    const part = buffer.subarray(bodyStart, next - 2);
    const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd > 0) {
      parts.push({
        header: part.subarray(0, headerEnd).toString("utf8"),
        body: part.subarray(headerEnd + 4)
      });
    }
    cursor = next;
  }

  return parts;
}

function saveAttachments(db, commentId, files) {
  return files
    .filter((file) => file.fieldName === "attachments" || file.fieldName === "attachment")
    .map((file) => {
      const storedName = `${Date.now()}-${createId()}-${safeFileName(file.fileName)}`;
      const storedPath = path.join(ATTACHMENT_DIR, storedName);
      fs.writeFileSync(storedPath, file.content);

      const attachment = {
        id: createId(),
        commentId,
        originalName: file.fileName,
        storedName,
        path: path.join("uploads", "attachments", storedName),
        size: file.content.length,
        mimeType: file.mimeType,
        createdAt: new Date().toISOString()
      };
      db.attachments.push(attachment);
      return attachment;
    });
}

function withCommentAttachments(db, comment) {
  return Object.assign({}, comment, {
    parentId: comment.parentId || null,
    attachments: db.attachments.filter((attachment) => attachment.commentId === comment.id)
  });
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password, encoded) {
  const parts = String(encoded || "").split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const expected = Buffer.from(parts[2], "hex");
  const actual = crypto.scryptSync(String(password), parts[1], 64);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function createSession(db, userId) {
  const session = {
    id: createId() + createId(),
    userId,
    createdAt: new Date().toISOString()
  };
  db.sessions.push(session);
  return session;
}

function getCurrentUser(req, db) {
  const sessionId = getSessionId(req);
  if (!sessionId) return null;
  const session = db.sessions.find((item) => item.id === sessionId);
  if (!session) return null;
  return db.users.find((user) => user.id === session.userId) || null;
}

function getSessionId(req) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/(?:^|;\s*)md_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

function sendSessionCookie(res, sessionId, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Set-Cookie": `md_session=${encodeURIComponent(sessionId)}; HttpOnly; Path=/; SameSite=Lax`
  });
  res.end(JSON.stringify(payload));
}

function clearSessionCookie(res, payload) {
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Set-Cookie": "md_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0"
  });
  res.end(JSON.stringify(payload));
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username
  };
}

function requireUser(res, user) {
  if (user) return true;
  sendJson(res, 401, { error: "로그인이 필요합니다." });
  return false;
}

function canManage(user, item) {
  return !!(user && item && item.ownerId && item.ownerId === user.id);
}

function collectCommentThreadIds(db, rootId) {
  const ids = [rootId];
  let changed = true;
  while (changed) {
    changed = false;
    db.comments.forEach((comment) => {
      if (comment.parentId && ids.includes(comment.parentId) && !ids.includes(comment.id)) {
        ids.push(comment.id);
        changed = true;
      }
    });
  }
  return ids;
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function cleanText(value) {
  return String(value || "").trim();
}

function safeFileName(value) {
  return cleanText(value).replace(/[\\/:*?"<>|]/g, "_") || "document.md";
}

function createId() {
  return crypto.randomBytes(8).toString("hex");
}
