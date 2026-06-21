import assert from "node:assert/strict";
import test from "node:test";
import { canAccess, roles, routeMatches, routes } from "../lib/ia.js";

test("권한별 IA는 계획서의 1차 대메뉴를 포함한다", () => {
  assert.deepEqual(roles.candidate.menus, ["시험관리", "자격증관리", "결제관리", "마이페이지", "고객센터"]);
  assert.deepEqual(roles.author.menus, ["출제관리", "시험관리", "자료관리", "마이페이지", "고객센터"]);
  assert.deepEqual(roles.grader.menus, ["채점관리", "시험관리", "자료관리", "마이페이지", "고객센터"]);
  assert.equal(roles.admin.menus.length, 10);
  assert.ok(roles.admin.menus.includes("시스템관리"));
});

test("권한별 사이드바 메뉴는 메뉴별 링크를 가진다", () => {
  for (const [role, roleInfo] of Object.entries(roles)) {
    for (const menu of roleInfo.menus) {
      assert.equal(typeof roleInfo.menuLinks[menu], "string", `${role} ${menu}`);
      assert.notEqual(roleInfo.menuLinks[menu], roleInfo.home, `${role} ${menu}`);
    }
  }
});

test("대표 라우트는 권한 접근 규칙을 가진다", () => {
  assert.equal(canAccess("admin", "/admin/members"), true);
  assert.equal(canAccess("admin", "/admin/members/1"), true);
  assert.equal(canAccess("candidate", "/admin/members"), false);
  assert.equal(canAccess("candidate", "/candidate/exams/register"), true);
  assert.equal(canAccess("grader", "/author/items"), false);
});

test("동적 App Router 경로는 실제 URL과 매칭된다", () => {
  assert.equal(routeMatches("/admin/members/[id]", "/admin/members/1"), true);
  assert.equal(routeMatches("/admin/members/[id]", "/admin/members"), false);
  assert.equal(routeMatches("/admin/members/[id]", "/admin/members/"), false);
});

test("사이드바 메뉴 링크는 구현 라우트 또는 역할별 fallback으로 이동한다", () => {
  const implementedPaths = new Set(routes.map((route) => route.path));
  const fallbackRoles = new Set(["candidate", "author", "grader", "admin"]);

  for (const [role, roleInfo] of Object.entries(roles)) {
    for (const href of Object.values(roleInfo.menuLinks)) {
      const isImplemented = implementedPaths.has(href);
      const isRoleFallback = fallbackRoles.has(role) && href.startsWith(`/${role}/`);

      assert.equal(isImplemented || isRoleFallback, true, `${role} ${href}`);
    }
  }
});

test("모든 대표 라우트는 기준 디자인 파일 경로를 기록한다", () => {
  for (const route of routes) {
    assert.match(route.designSource, /^\.\.\/\.\.\/figma_pdf\/2024\//);
  }
});
