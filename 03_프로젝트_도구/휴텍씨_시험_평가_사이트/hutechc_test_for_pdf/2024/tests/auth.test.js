import assert from "node:assert/strict";
import test from "node:test";
import { authenticateLogin } from "../lib/auth.js";

test("데모 계정으로 로그인하면 역할 홈 경로를 반환한다", () => {
  assert.deepEqual(authenticateLogin("admin", "1234"), {
    ok: true,
    user: {
      id: "admin",
      name: "관리자",
      role: "admin",
      home: "/admin"
    }
  });
});

test("아이디와 비밀번호가 비어 있으면 로그인하지 않는다", () => {
  assert.deepEqual(authenticateLogin("", ""), {
    ok: false,
    message: "아이디와 비밀번호를 입력하세요."
  });
});

test("등록되지 않은 계정은 로그인하지 않는다", () => {
  assert.deepEqual(authenticateLogin("unknown", "1234"), {
    ok: false,
    message: "등록된 데모 계정 정보와 일치하지 않습니다."
  });
});
