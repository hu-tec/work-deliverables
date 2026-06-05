"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DATA_DIR = path.join(ROOT_DIR, "data");
const DB_PATH = path.join(DATA_DIR, "work_communication.db");
const PORT = Number(process.env.PORT || 4173);
const MAX_JSON_BYTES = 2 * 1024 * 1024;

const STATUSES = new Set(["WAIT", "IN_PROGRESS", "RISK", "DONE", "HOLD"]);
const PRIORITIES = new Set(["LOW", "NORMAL", "HIGH", "URGENT"]);

function now() {
  return new Date().toISOString();
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
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
  if (!total) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Invalid JSON request body.");
    error.statusCode = 400;
    throw error;
  }
}

function createDatabase() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS work_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      work_no TEXT NOT NULL UNIQUE,
      start_date TEXT NOT NULL,
      creator TEXT NOT NULL,
      category_large TEXT NOT NULL,
      category_middle TEXT NOT NULL,
      category_small TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      notice TEXT NOT NULL,
      main_due_date TEXT NOT NULL,
      host_due_date TEXT NOT NULL,
      main_owner TEXT NOT NULL,
      sub_owners TEXT NOT NULL,
      file_name TEXT NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      operational_memo TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      work_item_id INTEGER NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
      parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
      author TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS activity_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      work_item_id INTEGER NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
      actor TEXT NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS work_items_status_updated ON work_items(status, updated_at DESC);
    CREATE INDEX IF NOT EXISTS work_items_category_updated ON work_items(category_large, updated_at DESC);
    CREATE INDEX IF NOT EXISTS comments_work_created ON comments(work_item_id, created_at);
    CREATE INDEX IF NOT EXISTS activity_work_created ON activity_events(work_item_id, created_at DESC);
  `);
  if (db.prepare("SELECT COUNT(*) AS count FROM work_items").get().count === 0) {
    seedDatabase(db);
  }
  return db;
}

function addActivity(db, workItemId, actor, type, message) {
  db.prepare(`
    INSERT INTO activity_events (work_item_id, actor, type, message, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(workItemId, actor, type, message, now());
}

function seedDatabase(db) {
  const timestamp = now();
  const items = [
    ["3237", "26-06-04", "박지민", "개발본부", "프로그램", "코어엔진", "코어 프로그램 리팩토링 및 쿼리 최적화 건", "1. 다국어 테이블 매핑 로직 점검\n2. 글로벌 인덱싱 튜닝\n3. 예외 로그 덤프 기능 구현", "사양서 기준 싱글쿼테이션 오류 예외처리 강화할 것.", "26-06-15", "26-06-18", "홍길동", ["최민식", "송강호", "강동원", "배수지", "하정우"], "core_spec.pdf", "IN_PROGRESS", "HIGH", "인덱싱 검증 결과를 HOST 마감 전 공유"],
    ["3236", "26-06-02", "이진국", "기획홍보", "디자인", "반응형UI", "메인 플랫폼 UI/UX 컴포넌트 추가 및 3단 그리드 반응형 개발", "1. 모바일 브레이크포인트 점검\n2. 가로 압축 창 설계\n3. 아이콘 버튼 상태 정리", "시안 최종 승인 대기 상태.", "26-06-12", "26-06-24", "김철수", ["강동원", "배수지"], "mockup_v1.png", "RISK", "URGENT", "승인 지연 시 개발 일정 영향"],
    ["3235", "26-06-01", "오세영", "운영본부", "정산", "월마감", "협력사 월마감 정산 검수 및 보류건 확인", "1. 보류 정산건 사유 분리\n2. 증빙 누락건 재요청\n3. 최종 지급 리스트 확정", "환불 요청 2건은 결제팀 확인 후 확정.", "26-06-10", "26-06-11", "정다은", ["한지수", "문소라"], "settlement_2606.xlsx", "WAIT", "HIGH", ""],
    ["3234", "26-05-29", "최유리", "고객지원", "문의", "긴급응대", "기업 고객 장애 문의 응대 이력 통합", "1. 장애 접수 채널 통합\n2. 원인별 태그 정리\n3. 재발 방지 코멘트 정리", "VIP 고객 응대 로그 누락 금지.", "26-06-08", "26-06-09", "민준호", ["윤서진", "박서연"], "support_log.csv", "HOLD", "NORMAL", "고객 답변 전 기술팀 코멘트 필요"],
    ["3233", "26-05-27", "한민재", "전략기획", "프로젝트", "리포트", "주간 경영 리포트 자동화 지표 검토", "1. KPI 산식 재확인\n2. 부서별 입력 누락 확인\n3. 자동 발송 문구 검수", "완료 후 다음 주 템플릿에 반영.", "26-06-05", "26-06-07", "이수빈", ["강하늘", "서지훈"], "weekly_report.pdf", "DONE", "LOW", "자동 발송 정상 확인"]
  ];
  const insert = db.prepare(`
    INSERT INTO work_items (
      work_no, start_date, creator, category_large, category_middle, category_small,
      title, description, notice, main_due_date, host_due_date, main_owner,
      sub_owners, file_name, status, priority, operational_memo, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  db.exec("BEGIN");
  try {
    for (const item of items) {
      const values = [...item];
      values[12] = JSON.stringify(values[12]);
      insert.run(...values, timestamp, timestamp);
      const id = db.prepare("SELECT last_insert_rowid() AS id").get().id;
      addActivity(db, id, item[2], "WORK_CREATED", "업무가 등록되었습니다.");
      addActivity(db, id, item[11], "STATUS_CHANGED", `상태가 ${item[14]}로 설정되었습니다.`);
      db.prepare(`
        INSERT INTO comments (work_item_id, parent_id, author, body, created_at)
        VALUES (?, NULL, ?, ?, ?)
      `).run(id, item[11], "진행 상황 확인했습니다. 세부 항목별로 업데이트 남기겠습니다.", timestamp);
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function parseWork(row) {
  return {
    id: row.id,
    workNo: row.work_no,
    startDate: row.start_date,
    creator: row.creator,
    categoryLarge: row.category_large,
    categoryMiddle: row.category_middle,
    categorySmall: row.category_small,
    title: row.title,
    description: row.description,
    notice: row.notice,
    mainDueDate: row.main_due_date,
    hostDueDate: row.host_due_date,
    mainOwner: row.main_owner,
    subOwners: JSON.parse(row.sub_owners || "[]"),
    fileName: row.file_name,
    status: row.status,
    priority: row.priority,
    operationalMemo: row.operational_memo,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function getWork(db, id) {
  const row = db.prepare("SELECT * FROM work_items WHERE id = ?").get(id);
  return row ? parseWork(row) : null;
}

function getDetail(db, id) {
  const work = getWork(db, id);
  if (!work) return null;
  const comments = db.prepare(`
    SELECT id, work_item_id AS workItemId, parent_id AS parentId, author, body, created_at AS createdAt
    FROM comments WHERE work_item_id = ? ORDER BY created_at ASC, id ASC
  `).all(id);
  const activities = db.prepare(`
    SELECT id, work_item_id AS workItemId, actor, type, message, created_at AS createdAt
    FROM activity_events WHERE work_item_id = ? ORDER BY created_at DESC, id DESC
  `).all(id);
  return { ...work, comments, activities };
}

function validateWork(body, partial = false) {
  const fields = {};
  const required = [
    "startDate", "creator", "categoryLarge", "categoryMiddle", "categorySmall",
    "title", "description", "notice", "mainDueDate", "hostDueDate", "mainOwner"
  ];
  for (const field of required) {
    if (!partial || body[field] !== undefined) {
      if (!String(body[field] || "").trim()) fields[field] = "필수 입력입니다.";
    }
  }
  if (body.title !== undefined && String(body.title).trim().length > 180) {
    fields.title = "제목은 180자 이하여야 합니다.";
  }
  if (body.status !== undefined && !STATUSES.has(body.status)) {
    fields.status = "유효하지 않은 상태입니다.";
  }
  if (body.priority !== undefined && !PRIORITIES.has(body.priority)) {
    fields.priority = "유효하지 않은 우선순위입니다.";
  }
  return fields;
}

function listWorks(db, searchParams) {
  const where = [];
  const args = [];
  const query = String(searchParams.get("q") || "").trim();
  const category = String(searchParams.get("category") || "").trim();
  const status = String(searchParams.get("status") || "").trim();
  const priority = String(searchParams.get("priority") || "").trim();
  const due = String(searchParams.get("due") || "").trim();
  if (query) {
    where.push(`(
      title LIKE ? OR description LIKE ? OR notice LIKE ? OR main_owner LIKE ? OR sub_owners LIKE ?
    )`);
    args.push(...Array(5).fill(`%${query}%`));
  }
  if (category) {
    where.push("category_large = ?");
    args.push(category);
  }
  if (status) {
    where.push("status = ?");
    args.push(status);
  }
  if (priority) {
    where.push("priority = ?");
    args.push(priority);
  }
  if (due === "soon") {
    where.push("status != 'DONE'");
  }
  const sql = `
    SELECT * FROM work_items
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY updated_at DESC, id DESC
  `;
  return db.prepare(sql).all(...args).map((row) => {
    const work = parseWork(row);
    work.commentPreview = db.prepare(`
      SELECT author, body FROM comments
      WHERE work_item_id = ?
      ORDER BY created_at DESC, id DESC
      LIMIT 2
    `).all(work.id);
    return work;
  });
}

function createWork(db, body) {
  const fields = validateWork(body);
  if (Object.keys(fields).length) {
    const error = new Error("입력값을 확인하세요.");
    error.statusCode = 400;
    error.fields = fields;
    throw error;
  }
  const timestamp = now();
  const workNo = String(body.workNo || Math.floor(4000 + Math.random() * 5000));
  const subOwners = Array.isArray(body.subOwners)
    ? body.subOwners
    : String(body.subOwners || "").split(",").map((item) => item.trim()).filter(Boolean);
  const result = db.prepare(`
    INSERT INTO work_items (
      work_no, start_date, creator, category_large, category_middle, category_small,
      title, description, notice, main_due_date, host_due_date, main_owner,
      sub_owners, file_name, status, priority, operational_memo, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    workNo, body.startDate, body.creator, body.categoryLarge, body.categoryMiddle,
    body.categorySmall, String(body.title).trim(), String(body.description).trim(),
    String(body.notice).trim(), body.mainDueDate, body.hostDueDate, body.mainOwner,
    JSON.stringify(subOwners), String(body.fileName || "attached_doc.pdf").trim(),
    body.status || "WAIT", body.priority || "NORMAL",
    String(body.operationalMemo || ""), timestamp, timestamp
  );
  addActivity(db, result.lastInsertRowid, body.creator || "운영자", "WORK_CREATED", "업무가 등록되었습니다.");
  return getDetail(db, result.lastInsertRowid);
}

function updateWork(db, id, body) {
  const before = getWork(db, id);
  if (!before) return null;
  const fields = validateWork(body, true);
  if (Object.keys(fields).length) {
    const error = new Error("입력값을 확인하세요.");
    error.statusCode = 400;
    error.fields = fields;
    throw error;
  }
  const next = { ...before, ...body };
  const subOwners = Array.isArray(next.subOwners) ? next.subOwners : before.subOwners;
  const timestamp = now();
  db.prepare(`
    UPDATE work_items SET
      start_date = ?, creator = ?, category_large = ?, category_middle = ?, category_small = ?,
      title = ?, description = ?, notice = ?, main_due_date = ?, host_due_date = ?,
      main_owner = ?, sub_owners = ?, file_name = ?, status = ?, priority = ?,
      operational_memo = ?, updated_at = ?
    WHERE id = ?
  `).run(
    next.startDate, next.creator, next.categoryLarge, next.categoryMiddle, next.categorySmall,
    String(next.title).trim(), String(next.description).trim(), String(next.notice).trim(),
    next.mainDueDate, next.hostDueDate, next.mainOwner, JSON.stringify(subOwners),
    next.fileName || "", next.status, next.priority, String(next.operationalMemo || ""),
    timestamp, id
  );
  const actor = String(body.actor || "운영자");
  if (body.status && body.status !== before.status) {
    addActivity(db, id, actor, "STATUS_CHANGED", `상태가 ${before.status}에서 ${body.status}(으)로 변경되었습니다.`);
  } else {
    addActivity(db, id, actor, "WORK_UPDATED", "업무 상세 정보가 저장되었습니다.");
  }
  return getDetail(db, id);
}

function serveStatic(req, res, pathname) {
  const target = pathname === "/" ? "/index.html" : pathname;
  const fullPath = path.resolve(PUBLIC_DIR, `.${target}`);
  if (!fullPath.startsWith(PUBLIC_DIR) || !fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
    return false;
  }
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8"
  };
  const ext = path.extname(fullPath);
  res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
  res.end(fs.readFileSync(fullPath));
  return true;
}

function createServer() {
  const db = createDatabase();
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    try {
      if (!url.pathname.startsWith("/api/")) {
        if (req.method === "GET" && serveStatic(req, res, url.pathname)) return;
        apiError(res, 404, "Not found.");
        return;
      }

      if (url.pathname === "/api/work-items" && req.method === "GET") {
        json(res, 200, listWorks(db, url.searchParams));
        return;
      }
      if (url.pathname === "/api/work-items" && req.method === "POST") {
        const body = await readJson(req);
        json(res, 201, createWork(db, body));
        return;
      }

      const workMatch = url.pathname.match(/^\/api\/work-items\/(\d+)$/);
      if (workMatch && req.method === "GET") {
        const detail = getDetail(db, Number(workMatch[1]));
        if (!detail) {
          apiError(res, 404, "업무를 찾을 수 없습니다.");
          return;
        }
        json(res, 200, detail);
        return;
      }
      if (workMatch && req.method === "PATCH") {
        const body = await readJson(req);
        const detail = updateWork(db, Number(workMatch[1]), body);
        if (!detail) {
          apiError(res, 404, "업무를 찾을 수 없습니다.");
          return;
        }
        json(res, 200, detail);
        return;
      }

      const commentMatch = url.pathname.match(/^\/api\/work-items\/(\d+)\/comments$/);
      if (commentMatch && req.method === "POST") {
        const work = getWork(db, Number(commentMatch[1]));
        if (!work) {
          apiError(res, 404, "업무를 찾을 수 없습니다.");
          return;
        }
        const body = await readJson(req);
        const text = String(body.body || "").trim();
        if (!text || text.length > 2000) {
          apiError(res, 400, "댓글은 1자 이상 2000자 이하여야 합니다.");
          return;
        }
        const timestamp = now();
        const result = db.prepare(`
          INSERT INTO comments (work_item_id, parent_id, author, body, created_at)
          VALUES (?, ?, ?, ?, ?)
        `).run(work.id, body.parentId || null, String(body.author || "운영자"), text, timestamp);
        addActivity(db, work.id, body.author || "운영자", "COMMENT_CREATED", body.parentId ? "대댓글이 등록되었습니다." : "댓글이 등록되었습니다.");
        json(res, 201, { id: result.lastInsertRowid, workItemId: work.id, parentId: body.parentId || null, author: body.author || "운영자", body: text, createdAt: timestamp });
        return;
      }

      apiError(res, 404, "Not found.");
    } catch (error) {
      apiError(res, error.statusCode || 500, error.message || "Server error.", error.fields);
    }
  });
}

if (require.main === module) {
  createServer().listen(PORT, () => {
    console.log(`Work communication tool: http://localhost:${PORT}`);
    console.log(`SQLite database: ${DB_PATH}`);
  });
}

module.exports = { createServer, createDatabase };
