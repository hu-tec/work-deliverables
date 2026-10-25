"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const MAX_JSON_BYTES = 28 * 1024 * 1024;
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
  ".png", ".jpg", ".jpeg", ".webp", ".txt", ".csv", ".zip"
]);
const WORK_STATUSES = new Set(["OPEN", "IN_PROGRESS", "BLOCKED", "DONE", "ARCHIVED"]);
const PRIORITIES = new Set(["LOW", "MEDIUM", "HIGH", "URGENT"]);
const SESSION_AGE_MS = 1000 * 60 * 60 * 12;

function now() {
  return new Date().toISOString();
}

function json(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function apiError(res, status, message, fields) {
  json(res, status, { error: message, fields: fields || undefined });
}

async function readJson(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_JSON_BYTES) {
      const error = new Error("Request payload is too large.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  if (!total) {
    return {};
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Invalid JSON request body.");
    error.statusCode = 400;
    throw error;
  }
}

function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || "")
      .split(";")
      .map((item) => item.trim().split("="))
      .filter(([key]) => key)
      .map(([key, value]) => [key, decodeURIComponent(value || "")])
  );
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  return {
    salt,
    hash: crypto.scryptSync(password, salt, 64).toString("hex")
  };
}

function passwordMatches(password, salt, expectedHash) {
  const actual = Buffer.from(hashPassword(password, salt).hash, "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function safeName(name) {
  return path.basename(String(name || "file")).replace(/[^\w.\- ()\u3131-\uD79D]/g, "_");
}

function createDatabase(dataDir, shouldSeed) {
  fs.mkdirSync(dataDir, { recursive: true });
  const db = new DatabaseSync(path.join(dataDir, "tracker.db"));
  db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      password_salt TEXT NOT NULL, password_hash TEXT NOT NULL,
      role TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, visibility TEXT NOT NULL,
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS department_members (
      department_id TEXT NOT NULL REFERENCES departments(id),
      user_id TEXT NOT NULL REFERENCES users(id), is_manager INTEGER NOT NULL DEFAULT 0,
      joined_at TEXT NOT NULL, PRIMARY KEY (department_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY, department_id TEXT NOT NULL REFERENCES departments(id),
      name TEXT NOT NULL, description TEXT, status TEXT NOT NULL,
      created_by_id TEXT NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS work_items (
      id TEXT PRIMARY KEY, department_id TEXT NOT NULL REFERENCES departments(id),
      project_id TEXT REFERENCES projects(id), title TEXT NOT NULL, description TEXT NOT NULL,
      status TEXT NOT NULL, priority TEXT NOT NULL,
      assignee_id TEXT REFERENCES users(id), created_by_id TEXT NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY, work_item_id TEXT NOT NULL REFERENCES work_items(id),
      parent_id TEXT REFERENCES comments(id), author_id TEXT NOT NULL REFERENCES users(id),
      body TEXT NOT NULL, created_at TEXT NOT NULL, edited_at TEXT, deleted_at TEXT
    );
    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY, work_item_id TEXT NOT NULL REFERENCES work_items(id),
      comment_id TEXT REFERENCES comments(id), uploaded_by_id TEXT NOT NULL REFERENCES users(id),
      original_name TEXT NOT NULL, storage_key TEXT NOT NULL UNIQUE,
      content_type TEXT NOT NULL, size_bytes INTEGER NOT NULL, sha256 TEXT,
      created_at TEXT NOT NULL, deleted_at TEXT
    );
    CREATE TABLE IF NOT EXISTS activity_events (
      id TEXT PRIMARY KEY, work_item_id TEXT NOT NULL REFERENCES work_items(id),
      actor_id TEXT NOT NULL REFERENCES users(id), type TEXT NOT NULL,
      entity_id TEXT, payload TEXT NOT NULL, occurred_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
      expires_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS work_department_updated ON work_items(department_id, updated_at DESC);
    CREATE INDEX IF NOT EXISTS work_project_status_updated ON work_items(project_id, status, updated_at DESC);
    CREATE INDEX IF NOT EXISTS work_assignee_status ON work_items(assignee_id, status);
    CREATE INDEX IF NOT EXISTS comment_work_created ON comments(work_item_id, created_at);
    CREATE INDEX IF NOT EXISTS activity_work_occurred ON activity_events(work_item_id, occurred_at DESC);
    CREATE INDEX IF NOT EXISTS attachment_work_created ON attachments(work_item_id, created_at DESC);
  `);
  if (shouldSeed && db.prepare("SELECT COUNT(*) AS count FROM users").get().count === 0) {
    seedDatabase(db);
  }
  return db;
}

function seedDatabase(db) {
  const timestamp = now();
  const adminId = crypto.randomUUID();
  const managerId = crypto.randomUUID();
  const memberId = crypto.randomUUID();
  const outsiderId = crypto.randomUUID();
  const departmentId = crypto.randomUUID();
  const projectId = crypto.randomUUID();
  const workId = crypto.randomUUID();
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, name, password_salt, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const users = [
    [adminId, "admin@demo.local", "관리자", "ADMIN"],
    [managerId, "manager@demo.local", "기획팀장", "MANAGER"],
    [memberId, "member@demo.local", "담당자", "MEMBER"],
    [outsiderId, "outside@demo.local", "외부부서원", "MEMBER"]
  ];
  db.exec("BEGIN");
  try {
    for (const [id, email, name, role] of users) {
      const credential = hashPassword("demo1234");
      insertUser.run(id, email, name, credential.salt, credential.hash, role, timestamp, timestamp);
    }
    db.prepare("INSERT INTO departments VALUES (?, ?, ?, ?, ?)").run(
      departmentId, "기획팀", "PRIVATE", timestamp, timestamp
    );
    const addMember = db.prepare("INSERT INTO department_members VALUES (?, ?, ?, ?)");
    addMember.run(departmentId, managerId, 1, timestamp);
    addMember.run(departmentId, memberId, 0, timestamp);
    db.prepare("INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
      projectId, departmentId, "고객지원 개선", "문의 이력을 체계화하는 프로젝트", "ACTIVE",
      managerId, timestamp, timestamp
    );
    db.prepare(`
      INSERT INTO work_items VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      workId, departmentId, projectId, "업무 히스토리 화면 검토",
      "상세 화면에서 댓글과 첨부 파일 흐름이 자연스러운지 검토합니다.",
      "IN_PROGRESS", "HIGH", memberId, managerId, timestamp, timestamp
    );
    addActivity(db, workId, managerId, "WORK_CREATED", workId, {
      title: "업무 히스토리 화면 검토", status: "IN_PROGRESS", priority: "HIGH"
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function addActivity(db, workItemId, actorId, type, entityId, payload) {
  db.prepare(`
    INSERT INTO activity_events (id, work_item_id, actor_id, type, entity_id, payload, occurred_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), workItemId, actorId, type, entityId || null, JSON.stringify(payload), now());
}

function getAuthenticatedUser(db, req) {
  const token = parseCookies(req).session;
  if (!token) {
    return null;
  }
  return db.prepare(`
    SELECT u.id, u.email, u.name, u.role
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token = ? AND s.expires_at > ?
  `).get(token, now()) || null;
}

function isDepartmentMember(db, userId, departmentId) {
  return Boolean(db.prepare(
    "SELECT 1 FROM department_members WHERE department_id = ? AND user_id = ?"
  ).get(departmentId, userId));
}

function isDepartmentManager(db, userId, departmentId) {
  return Boolean(db.prepare(
    "SELECT 1 FROM department_members WHERE department_id = ? AND user_id = ? AND is_manager = 1"
  ).get(departmentId, userId));
}

function canViewWork(db, user, work) {
  if (user.role === "ADMIN" || work.visibility === "ORGANIZATION") {
    return true;
  }
  return isDepartmentMember(db, user.id, work.departmentId);
}

function canUpdateWork(db, user, work) {
  return user.role === "ADMIN" ||
    isDepartmentManager(db, user.id, work.departmentId) ||
    work.createdById === user.id ||
    work.assigneeId === user.id;
}

function getWork(db, id) {
  return db.prepare(`
    SELECT w.id, w.department_id AS departmentId, w.project_id AS projectId,
      w.title, w.description, w.status, w.priority, w.assignee_id AS assigneeId,
      w.created_by_id AS createdById, w.created_at AS createdAt, w.updated_at AS updatedAt,
      d.name AS departmentName, d.visibility, p.name AS projectName,
      a.name AS assigneeName, c.name AS creatorName
    FROM work_items w
    JOIN departments d ON d.id = w.department_id
    LEFT JOIN projects p ON p.id = w.project_id
    LEFT JOIN users a ON a.id = w.assignee_id
    JOIN users c ON c.id = w.created_by_id
    WHERE w.id = ?
  `).get(id);
}

function accessibleDepartments(db, user) {
  return db.prepare(`
    SELECT DISTINCT d.id, d.name, d.visibility
    FROM departments d
    LEFT JOIN department_members dm ON dm.department_id = d.id AND dm.user_id = ?
    WHERE ? = 'ADMIN' OR d.visibility = 'ORGANIZATION' OR dm.user_id IS NOT NULL
    ORDER BY d.name
  `).all(user.id, user.role);
}

function listAttachments(db, workId) {
  return db.prepare(`
    SELECT a.id, a.comment_id AS commentId, a.original_name AS originalName,
      a.content_type AS contentType, a.size_bytes AS sizeBytes, a.created_at AS createdAt,
      u.name AS uploadedByName
    FROM attachments a JOIN users u ON u.id = a.uploaded_by_id
    WHERE a.work_item_id = ? AND a.deleted_at IS NULL
    ORDER BY a.created_at DESC
  `).all(workId);
}

function serveStatic(req, res, publicDir, pathname) {
  const target = pathname === "/" ? "/index.html" : pathname;
  const fullPath = path.resolve(publicDir, `.${target}`);
  if (!fullPath.startsWith(path.resolve(publicDir)) || !fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
    return false;
  }
  const extension = path.extname(fullPath);
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml"
  };
  const content = fs.readFileSync(fullPath);
  res.writeHead(200, { "Content-Type": types[extension] || "application/octet-stream" });
  res.end(content);
  return true;
}

function createApp(options = {}) {
  const rootDir = options.rootDir || path.resolve(__dirname, "..");
  const dataDir = options.dataDir || path.join(rootDir, "data");
  const uploadDir = options.uploadDir || path.join(rootDir, "uploads");
  const publicDir = options.publicDir || path.join(rootDir, "public");
  fs.mkdirSync(uploadDir, { recursive: true });
  const db = createDatabase(dataDir, options.seed !== false);

  const server = http.createServer(async (req, res) => {
    const requestUrl = new URL(req.url, "http://localhost");
    const pathname = requestUrl.pathname;
    try {
      if (!pathname.startsWith("/api/")) {
        if (req.method === "GET" && serveStatic(req, res, publicDir, pathname)) {
          return;
        }
        apiError(res, 404, "Not found.");
        return;
      }

      if (pathname === "/api/auth/login" && req.method === "POST") {
        const body = await readJson(req);
        const user = db.prepare("SELECT * FROM users WHERE email = ?").get(String(body.email || "").trim());
        if (!user || !passwordMatches(String(body.password || ""), user.password_salt, user.password_hash)) {
          apiError(res, 401, "이메일 또는 비밀번호를 확인하세요.");
          return;
        }
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + SESSION_AGE_MS).toISOString();
        db.prepare("INSERT INTO sessions VALUES (?, ?, ?)").run(token, user.id, expiresAt);
        res.setHeader("Set-Cookie", `session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_AGE_MS / 1000}`);
        json(res, 200, { id: user.id, email: user.email, name: user.name, role: user.role });
        return;
      }

      if (pathname === "/api/auth/logout" && req.method === "POST") {
        const token = parseCookies(req).session;
        if (token) {
          db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
        }
        res.setHeader("Set-Cookie", "session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0");
        json(res, 200, { ok: true });
        return;
      }

      const user = getAuthenticatedUser(db, req);
      if (!user) {
        apiError(res, 401, "로그인이 필요합니다.");
        return;
      }
      if (pathname === "/api/auth/me" && req.method === "GET") {
        json(res, 200, user);
        return;
      }
      if (pathname === "/api/departments" && req.method === "GET") {
        json(res, 200, accessibleDepartments(db, user));
        return;
      }
      if (pathname === "/api/users" && req.method === "GET") {
        const departmentId = requestUrl.searchParams.get("departmentId");
        if (!departmentId || !accessibleDepartments(db, user).some((department) => department.id === departmentId)) {
          apiError(res, 403, "부서 접근 권한이 없습니다.");
          return;
        }
        json(res, 200, db.prepare(`
          SELECT u.id, u.name, u.email FROM users u
          JOIN department_members dm ON dm.user_id = u.id
          WHERE dm.department_id = ? ORDER BY u.name
        `).all(departmentId));
        return;
      }
      if (pathname === "/api/projects" && req.method === "GET") {
        const departmentId = requestUrl.searchParams.get("departmentId");
        const allowed = accessibleDepartments(db, user).map((department) => department.id);
        const queried = departmentId ? allowed.filter((id) => id === departmentId) : allowed;
        if (departmentId && queried.length === 0) {
          apiError(res, 403, "부서 접근 권한이 없습니다.");
          return;
        }
        const placeholders = queried.map(() => "?").join(",");
        json(res, 200, queried.length ? db.prepare(`
          SELECT id, department_id AS departmentId, name, status
          FROM projects WHERE department_id IN (${placeholders}) AND status = 'ACTIVE' ORDER BY name
        `).all(...queried) : []);
        return;
      }
      if (pathname === "/api/work-items" && req.method === "GET") {
        const departments = accessibleDepartments(db, user).map((department) => department.id);
        if (!departments.length) {
          json(res, 200, []);
          return;
        }
        const where = [`w.department_id IN (${departments.map(() => "?").join(",")})`];
        const args = [...departments];
        for (const [param, column] of [
          ["departmentId", "w.department_id"], ["projectId", "w.project_id"],
          ["status", "w.status"], ["assigneeId", "w.assignee_id"]
        ]) {
          const value = requestUrl.searchParams.get(param);
          if (value) {
            where.push(`${column} = ?`);
            args.push(value);
          }
        }
        const search = requestUrl.searchParams.get("q");
        if (search) {
          where.push("(w.title LIKE ? OR w.description LIKE ?)");
          args.push(`%${search}%`, `%${search}%`);
        }
        json(res, 200, db.prepare(`
          SELECT w.id, w.title, w.status, w.priority, w.updated_at AS updatedAt,
            d.name AS departmentName, p.name AS projectName, u.name AS assigneeName
          FROM work_items w JOIN departments d ON d.id = w.department_id
          LEFT JOIN projects p ON p.id = w.project_id LEFT JOIN users u ON u.id = w.assignee_id
          WHERE ${where.join(" AND ")}
          ORDER BY w.updated_at DESC LIMIT 100
        `).all(...args));
        return;
      }
      if (pathname === "/api/work-items" && req.method === "POST") {
        const body = await readJson(req);
        const fields = {};
        if (!String(body.title || "").trim() || String(body.title).trim().length > 200) {
          fields.title = "제목은 1자 이상 200자 이하여야 합니다.";
        }
        const department = db.prepare("SELECT * FROM departments WHERE id = ?").get(body.departmentId);
        if (!department || (!isDepartmentMember(db, user.id, department.id) && user.role !== "ADMIN")) {
          fields.departmentId = "업무를 작성할 수 있는 부서를 선택하세요.";
        }
        if (body.projectId && !db.prepare(
          "SELECT 1 FROM projects WHERE id = ? AND department_id = ? AND status = 'ACTIVE'"
        ).get(body.projectId, body.departmentId)) {
          fields.projectId = "선택한 부서의 활성 프로젝트를 지정하세요.";
        }
        if (body.assigneeId && !db.prepare(
          "SELECT 1 FROM department_members WHERE user_id = ? AND department_id = ?"
        ).get(body.assigneeId, body.departmentId)) {
          fields.assigneeId = "선택한 부서의 구성원을 담당자로 지정하세요.";
        }
        if (!WORK_STATUSES.has(body.status || "OPEN")) {
          fields.status = "유효하지 않은 상태입니다.";
        }
        if (!PRIORITIES.has(body.priority || "MEDIUM")) {
          fields.priority = "유효하지 않은 우선순위입니다.";
        }
        if (Object.keys(fields).length) {
          apiError(res, 400, "입력값을 확인하세요.", fields);
          return;
        }
        const id = crypto.randomUUID();
        const timestamp = now();
        db.exec("BEGIN");
        try {
          db.prepare(`
            INSERT INTO work_items VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(id, body.departmentId, body.projectId || null, String(body.title).trim(),
            String(body.description || "").trim(), body.status || "OPEN", body.priority || "MEDIUM",
            body.assigneeId || null, user.id, timestamp, timestamp);
          addActivity(db, id, user.id, "WORK_CREATED", id, {
            title: String(body.title).trim(), status: body.status || "OPEN", priority: body.priority || "MEDIUM"
          });
          db.exec("COMMIT");
        } catch (error) {
          db.exec("ROLLBACK");
          throw error;
        }
        json(res, 201, getWork(db, id));
        return;
      }

      const workMatch = pathname.match(/^\/api\/work-items\/([^/]+)$/);
      if (workMatch && req.method === "GET") {
        const work = getWork(db, workMatch[1]);
        if (!work || !canViewWork(db, user, work)) {
          apiError(res, 404, "업무를 찾을 수 없습니다.");
          return;
        }
        json(res, 200, { ...work, attachments: listAttachments(db, work.id), canUpdate: canUpdateWork(db, user, work) });
        return;
      }
      if (workMatch && req.method === "PATCH") {
        const work = getWork(db, workMatch[1]);
        if (!work || !canUpdateWork(db, user, work)) {
          apiError(res, 403, "업무 수정 권한이 없습니다.");
          return;
        }
        const body = await readJson(req);
        const updates = {};
        for (const field of ["title", "description", "status", "priority", "assigneeId"]) {
          if (body[field] !== undefined && body[field] !== work[field]) {
            updates[field] = body[field];
          }
        }
        if (updates.title !== undefined && (!String(updates.title).trim() || String(updates.title).length > 200)) {
          apiError(res, 400, "제목은 1자 이상 200자 이하여야 합니다.");
          return;
        }
        if (updates.status && !WORK_STATUSES.has(updates.status)) {
          apiError(res, 400, "유효하지 않은 상태입니다.");
          return;
        }
        if (updates.priority && !PRIORITIES.has(updates.priority)) {
          apiError(res, 400, "유효하지 않은 우선순위입니다.");
          return;
        }
        if (updates.assigneeId && !db.prepare(
          "SELECT 1 FROM department_members WHERE user_id = ? AND department_id = ?"
        ).get(updates.assigneeId, work.departmentId)) {
          apiError(res, 400, "선택한 부서의 구성원을 담당자로 지정하세요.");
          return;
        }
        if (!Object.keys(updates).length) {
          json(res, 200, work);
          return;
        }
        const next = { ...work, ...updates, updatedAt: now() };
        const changes = Object.fromEntries(Object.entries(updates).map(([key, value]) => [key, { from: work[key], to: value }]));
        db.exec("BEGIN");
        try {
          db.prepare(`
            UPDATE work_items SET title = ?, description = ?, status = ?, priority = ?,
              assignee_id = ?, updated_at = ? WHERE id = ?
          `).run(next.title, next.description, next.status, next.priority, next.assigneeId || null, next.updatedAt, work.id);
          if (updates.status) {
            addActivity(db, work.id, user.id, "STATUS_CHANGED", work.id, changes.status);
            delete changes.status;
          }
          if (Object.keys(changes).length) {
            addActivity(db, work.id, user.id, "WORK_UPDATED", work.id, changes);
          }
          db.exec("COMMIT");
        } catch (error) {
          db.exec("ROLLBACK");
          throw error;
        }
        json(res, 200, getWork(db, work.id));
        return;
      }

      const activityMatch = pathname.match(/^\/api\/work-items\/([^/]+)\/activity$/);
      if (activityMatch && req.method === "GET") {
        const work = getWork(db, activityMatch[1]);
        if (!work || !canViewWork(db, user, work)) {
          apiError(res, 404, "업무를 찾을 수 없습니다.");
          return;
        }
        const limit = Math.min(Number(requestUrl.searchParams.get("limit")) || 30, 100);
        const offset = Math.max(Number(requestUrl.searchParams.get("offset")) || 0, 0);
        const events = db.prepare(`
          SELECT e.id, e.type, e.entity_id AS entityId, e.payload, e.occurred_at AS occurredAt,
            u.id AS actorId, u.name AS actorName
          FROM activity_events e JOIN users u ON u.id = e.actor_id
          WHERE e.work_item_id = ? ORDER BY e.occurred_at DESC LIMIT ? OFFSET ?
        `).all(work.id, limit + 1, offset);
        json(res, 200, {
          items: events.slice(0, limit).map((event) => ({ ...event, payload: JSON.parse(event.payload) })),
          nextOffset: events.length > limit ? offset + limit : null
        });
        return;
      }

      const commentsMatch = pathname.match(/^\/api\/work-items\/([^/]+)\/comments$/);
      if (commentsMatch && req.method === "GET") {
        const work = getWork(db, commentsMatch[1]);
        if (!work || !canViewWork(db, user, work)) {
          apiError(res, 404, "업무를 찾을 수 없습니다.");
          return;
        }
        json(res, 200, db.prepare(`
          SELECT c.id, c.parent_id AS parentId, c.author_id AS authorId,
            CASE WHEN c.deleted_at IS NULL THEN c.body ELSE NULL END AS body,
            c.created_at AS createdAt, c.edited_at AS editedAt, c.deleted_at AS deletedAt,
            u.name AS authorName
          FROM comments c JOIN users u ON u.id = c.author_id
          WHERE c.work_item_id = ? ORDER BY c.created_at ASC
        `).all(work.id));
        return;
      }
      if (commentsMatch && req.method === "POST") {
        const work = getWork(db, commentsMatch[1]);
        if (!work || !canViewWork(db, user, work)) {
          apiError(res, 404, "업무를 찾을 수 없습니다.");
          return;
        }
        const body = await readJson(req);
        const text = String(body.body || "").trim();
        if (!text || text.length > 4000) {
          apiError(res, 400, "댓글은 1자 이상 4000자 이하여야 합니다.");
          return;
        }
        if (body.parentId) {
          const parent = db.prepare("SELECT * FROM comments WHERE id = ? AND work_item_id = ?").get(body.parentId, work.id);
          if (!parent || parent.parent_id) {
            apiError(res, 400, "대댓글은 최상위 댓글에만 작성할 수 있습니다.");
            return;
          }
        }
        const id = crypto.randomUUID();
        const timestamp = now();
        db.exec("BEGIN");
        try {
          db.prepare(`
            INSERT INTO comments (id, work_item_id, parent_id, author_id, body, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(id, work.id, body.parentId || null, user.id, text, timestamp);
          addActivity(db, work.id, user.id, "COMMENT_CREATED", id, { commentId: id, parentId: body.parentId || null });
          db.exec("COMMIT");
        } catch (error) {
          db.exec("ROLLBACK");
          throw error;
        }
        json(res, 201, { id, parentId: body.parentId || null, authorId: user.id, authorName: user.name, body: text, createdAt: timestamp });
        return;
      }

      const commentMatch = pathname.match(/^\/api\/comments\/([^/]+)$/);
      if (commentMatch && (req.method === "PATCH" || req.method === "DELETE")) {
        const comment = db.prepare("SELECT * FROM comments WHERE id = ?").get(commentMatch[1]);
        const work = comment && getWork(db, comment.work_item_id);
        if (!comment || !work || !canViewWork(db, user, work)) {
          apiError(res, 404, "댓글을 찾을 수 없습니다.");
          return;
        }
        const privileged = user.role === "ADMIN" || isDepartmentManager(db, user.id, work.departmentId);
        if (comment.author_id !== user.id && !privileged) {
          apiError(res, 403, "댓글을 변경할 권한이 없습니다.");
          return;
        }
        const timestamp = now();
        if (req.method === "PATCH") {
          const body = await readJson(req);
          const text = String(body.body || "").trim();
          if (!text || text.length > 4000) {
            apiError(res, 400, "댓글은 1자 이상 4000자 이하여야 합니다.");
            return;
          }
          db.exec("BEGIN");
          db.prepare("UPDATE comments SET body = ?, edited_at = ? WHERE id = ? AND deleted_at IS NULL").run(text, timestamp, comment.id);
          addActivity(db, work.id, user.id, "COMMENT_EDITED", comment.id, { commentId: comment.id });
          db.exec("COMMIT");
          json(res, 200, { ok: true });
        } else {
          db.exec("BEGIN");
          db.prepare("UPDATE comments SET deleted_at = ? WHERE id = ?").run(timestamp, comment.id);
          addActivity(db, work.id, user.id, "COMMENT_DELETED", comment.id, { commentId: comment.id });
          db.exec("COMMIT");
          json(res, 200, { ok: true });
        }
        return;
      }

      const uploadMatch = pathname.match(/^\/api\/work-items\/([^/]+)\/attachments$/);
      if (uploadMatch && req.method === "POST") {
        const work = getWork(db, uploadMatch[1]);
        if (!work || !canUpdateWork(db, user, work)) {
          apiError(res, 403, "첨부파일을 추가할 권한이 없습니다.");
          return;
        }
        const body = await readJson(req);
        const originalName = safeName(body.fileName);
        const extension = path.extname(originalName).toLowerCase();
        if (!ALLOWED_EXTENSIONS.has(extension) || !body.dataBase64) {
          apiError(res, 400, "허용된 형식의 파일만 첨부할 수 있습니다.");
          return;
        }
        if (body.commentId && !db.prepare(
          "SELECT 1 FROM comments WHERE id = ? AND work_item_id = ? AND deleted_at IS NULL"
        ).get(body.commentId, work.id)) {
          apiError(res, 400, "해당 업무의 유효한 댓글에만 파일을 연결할 수 있습니다.");
          return;
        }
        const binary = Buffer.from(body.dataBase64, "base64");
        if (!binary.length || binary.length > MAX_FILE_BYTES) {
          apiError(res, 400, "첨부파일은 20 MB 이하여야 합니다.");
          return;
        }
        const id = crypto.randomUUID();
        const storageName = `${id}${extension}`;
        const storagePath = path.join(uploadDir, storageName);
        fs.writeFileSync(storagePath, binary);
        const timestamp = now();
        try {
          db.exec("BEGIN");
          db.prepare(`
            INSERT INTO attachments VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
          `).run(id, work.id, body.commentId || null, user.id, originalName, storageName,
            String(body.contentType || "application/octet-stream"), binary.length,
            crypto.createHash("sha256").update(binary).digest("hex"), timestamp);
          addActivity(db, work.id, user.id, "ATTACHMENT_ADDED", id, { attachmentId: id, fileName: originalName, sizeBytes: binary.length });
          db.exec("COMMIT");
        } catch (error) {
          db.exec("ROLLBACK");
          fs.rmSync(storagePath, { force: true });
          throw error;
        }
        json(res, 201, { id, originalName, sizeBytes: binary.length, createdAt: timestamp });
        return;
      }

      const downloadMatch = pathname.match(/^\/api\/attachments\/([^/]+)\/download$/);
      if (downloadMatch && req.method === "GET") {
        const attachment = db.prepare(`
          SELECT a.*, w.department_id AS departmentId FROM attachments a
          JOIN work_items w ON w.id = a.work_item_id WHERE a.id = ? AND a.deleted_at IS NULL
        `).get(downloadMatch[1]);
        const work = attachment && getWork(db, attachment.work_item_id);
        if (!attachment || !work || !canViewWork(db, user, work)) {
          apiError(res, 404, "첨부파일을 찾을 수 없습니다.");
          return;
        }
        const binaryPath = path.join(uploadDir, attachment.storage_key);
        if (!fs.existsSync(binaryPath)) {
          apiError(res, 404, "첨부파일을 찾을 수 없습니다.");
          return;
        }
        res.writeHead(200, {
          "Content-Type": attachment.content_type,
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(attachment.original_name)}`,
          "Content-Length": attachment.size_bytes
        });
        fs.createReadStream(binaryPath).pipe(res);
        return;
      }

      const deleteAttachmentMatch = pathname.match(/^\/api\/attachments\/([^/]+)$/);
      if (deleteAttachmentMatch && req.method === "DELETE") {
        const attachment = db.prepare("SELECT * FROM attachments WHERE id = ? AND deleted_at IS NULL").get(deleteAttachmentMatch[1]);
        const work = attachment && getWork(db, attachment.work_item_id);
        if (!attachment || !work) {
          apiError(res, 404, "첨부파일을 찾을 수 없습니다.");
          return;
        }
        const canDelete = user.role === "ADMIN" || attachment.uploaded_by_id === user.id ||
          isDepartmentManager(db, user.id, work.departmentId);
        if (!canDelete) {
          apiError(res, 403, "첨부파일을 삭제할 권한이 없습니다.");
          return;
        }
        db.exec("BEGIN");
        db.prepare("UPDATE attachments SET deleted_at = ? WHERE id = ?").run(now(), attachment.id);
        addActivity(db, work.id, user.id, "ATTACHMENT_REMOVED", attachment.id, { attachmentId: attachment.id, fileName: attachment.original_name });
        db.exec("COMMIT");
        json(res, 200, { ok: true });
        return;
      }

      apiError(res, 404, "API endpoint not found.");
    } catch (error) {
      console.error(error);
      apiError(res, error.statusCode || 500, error.statusCode ? error.message : "서버 요청을 처리하지 못했습니다.");
    }
  });

  server.db = db;
  server.closeDatabase = () => db.close();
  return server;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  const server = createApp();
  server.listen(port, () => {
    console.log(`Work history tracker running at http://localhost:${port}`);
    console.log("Demo accounts: admin@demo.local / manager@demo.local / member@demo.local (password: demo1234)");
  });
}

module.exports = { createApp };
