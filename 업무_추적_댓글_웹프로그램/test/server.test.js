"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { after, before, test } = require("node:test");
const { createApp } = require("../src/server");

let server;
let rootDir;
let baseUrl;

before(async () => {
  rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "work-history-"));
  server = createApp({
    dataDir: path.join(rootDir, "data"),
    uploadDir: path.join(rootDir, "uploads"),
    publicDir: path.resolve(__dirname, "../public")
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  server.closeDatabase();
  fs.rmSync(rootDir, { recursive: true, force: true });
});

async function login(email) {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "demo1234" })
  });
  assert.equal(response.status, 200);
  return response.headers.get("set-cookie").split(";")[0];
}

async function request(cookie, pathname, options = {}) {
  return fetch(`${baseUrl}${pathname}`, {
    ...options,
    headers: {
      Cookie: cookie,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
}

test("serves the compact browser application", async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /업무 히스토리 트래커/);
});

test("creates work and records status activity for authorized department users", async () => {
  const cookie = await login("manager@demo.local");
  const departments = await (await request(cookie, "/api/departments")).json();
  const departmentId = departments[0].id;
  const projects = await (await request(cookie, `/api/projects?departmentId=${departmentId}`)).json();

  const createResponse = await request(cookie, "/api/work-items", {
    method: "POST",
    body: JSON.stringify({
      departmentId,
      projectId: projects[0].id,
      title: "신규 이력 테스트",
      description: "활동 이력이 남아야 합니다.",
      priority: "HIGH",
      status: "OPEN"
    })
  });
  assert.equal(createResponse.status, 201);
  const work = await createResponse.json();

  const invalidProjectResponse = await request(cookie, "/api/work-items", {
    method: "POST",
    body: JSON.stringify({
      departmentId,
      projectId: "wrong-project",
      title: "잘못된 프로젝트",
      status: "OPEN",
      priority: "MEDIUM"
    })
  });
  assert.equal(invalidProjectResponse.status, 400);

  const patchResponse = await request(cookie, `/api/work-items/${work.id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "IN_PROGRESS" })
  });
  assert.equal(patchResponse.status, 200);

  const activity = await (await request(cookie, `/api/work-items/${work.id}/activity`)).json();
  assert.deepEqual(activity.items.map((event) => event.type), ["STATUS_CHANGED", "WORK_CREATED"]);
});

test("supports root comments and one reply level only", async () => {
  const cookie = await login("manager@demo.local");
  const work = (await (await request(cookie, "/api/work-items")).json())[0];
  const rootResponse = await request(cookie, `/api/work-items/${work.id}/comments`, {
    method: "POST", body: JSON.stringify({ body: "최상위 의견" })
  });
  assert.equal(rootResponse.status, 201);
  const root = await rootResponse.json();
  const replyResponse = await request(cookie, `/api/work-items/${work.id}/comments`, {
    method: "POST", body: JSON.stringify({ body: "답글", parentId: root.id })
  });
  assert.equal(replyResponse.status, 201);
  const reply = await replyResponse.json();
  const nestedResponse = await request(cookie, `/api/work-items/${work.id}/comments`, {
    method: "POST", body: JSON.stringify({ body: "허용되지 않는 깊이", parentId: reply.id })
  });
  assert.equal(nestedResponse.status, 400);
});

test("keeps private attachments unavailable to users outside the department", async () => {
  const managerCookie = await login("manager@demo.local");
  const work = (await (await request(managerCookie, "/api/work-items")).json())[0];
  const uploadResponse = await request(managerCookie, `/api/work-items/${work.id}/attachments`, {
    method: "POST",
    body: JSON.stringify({
      fileName: "review.txt",
      contentType: "text/plain",
      dataBase64: Buffer.from("restricted document").toString("base64")
    })
  });
  assert.equal(uploadResponse.status, 201);
  const attachment = await uploadResponse.json();

  const downloadResponse = await request(managerCookie, `/api/attachments/${attachment.id}/download`);
  assert.equal(downloadResponse.status, 200);
  assert.equal(await downloadResponse.text(), "restricted document");

  const outsideCookie = await login("outside@demo.local");
  assert.equal((await request(outsideCookie, `/api/work-items/${work.id}`)).status, 404);
  assert.equal((await request(outsideCookie, `/api/attachments/${attachment.id}/download`)).status, 404);
});
