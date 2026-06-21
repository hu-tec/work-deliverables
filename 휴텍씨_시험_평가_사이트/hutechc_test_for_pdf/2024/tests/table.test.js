import assert from "node:assert/strict";
import test from "node:test";
import { filterRows, paginateRows, toggleSelection } from "../lib/table.js";

const rows = [
  { id: "1", name: "김민서", status: "approved" },
  { id: "2", name: "박지훈", status: "pending" },
  { id: "3", name: "이서연", status: "pending" }
];

test("테이블 검색은 행 전체 값에서 대소문자 구분 없이 찾는다", () => {
  assert.deepEqual(filterRows(rows, { query: "min", status: "all" }), []);
  assert.equal(filterRows(rows, { query: "박", status: "all" })[0].id, "2");
});

test("테이블 상태 필터는 검색어와 함께 적용된다", () => {
  assert.deepEqual(
    filterRows(rows, { query: "이", status: "pending" }).map((row) => row.id),
    ["3"]
  );
});

test("페이지네이션은 요청 페이지 범위를 계산한다", () => {
  assert.deepEqual(paginateRows(rows, 2, 2).map((row) => row.id), ["3"]);
  assert.deepEqual(paginateRows(rows, 0, 2).map((row) => row.id), ["1", "2"]);
});

test("체크박스 선택은 같은 ID를 다시 누르면 해제한다", () => {
  assert.deepEqual(toggleSelection([], "1"), ["1"]);
  assert.deepEqual(toggleSelection(["1", "2"], "1"), ["2"]);
});
