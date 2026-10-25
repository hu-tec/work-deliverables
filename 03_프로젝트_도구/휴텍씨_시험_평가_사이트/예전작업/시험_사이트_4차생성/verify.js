const fs = require("fs");
const vm = require("vm");

const html = fs.readFileSync("index.html", "utf8");
const js = fs.readFileSync("app.js", "utf8");
const css = fs.readFileSync("styles.css", "utf8");
const all = `${html}\n${js}\n${css}`;

const failures = [];

function assert(name, condition, detail = "") {
  if (!condition) failures.push(`${name}${detail ? `: ${detail}` : ""}`);
}

function extractViews() {
  const match = js.match(/const views = \{([\s\S]*?)\};/);
  if (!match) return [];
  return [...match[1].matchAll(/\n\s+([A-Za-z0-9]+):/g)].map((item) => item[1]);
}

assert("app.js syntax", (() => {
  try {
    new vm.Script(js);
    return true;
  } catch (error) {
    failures.push(`app.js syntax detail: ${error.message}`);
    return false;
  }
})());

const views = extractViews();
assert("views declared", views.length >= 20, `found ${views.length}`);
const missingViews = views.filter((view) => !html.includes(`id="view-${view}"`));
assert("all declared views have sections", missingViews.length === 0, missingViews.join(", "));

const staticIds = [...js.matchAll(/querySelector(?:All)?\((?:`|"|')#([A-Za-z0-9_-]+)/g)]
  .map((item) => item[1])
  .filter((id) => id !== "view-");
const missingIds = [...new Set(staticIds)].filter((id) => !html.includes(`id="${id}"`));
assert("all static queried ids exist", missingIds.length === 0, missingIds.join(", "));

[
  "design_system_major",
  "--ds-color-brand-primary",
  "filter-chip",
  "state-pill",
  "btn--primary",
  "aria-selected",
  "aria-pressed",
  "완료 체크리스트",
  "회원관리 상세 전체",
  "마이페이지 1920",
  "관리자 자격증관리 상세",
  "관리자 카테고리",
  "라우트 / 정책",
  "DB 고정값 Chip",
  "변환",
  "언어쌍",
  "upload-classification/review",
  "admin/forms/new",
].forEach((keyword) => {
  assert(`keyword ${keyword}`, all.includes(keyword));
});

assert("DB fixed value headers", html.includes("<th>변환</th>") && html.includes("<th>언어쌍</th>"));
assert("DB fixed values render as chips", js.includes("row[17]") && js.includes("row[18]") && js.includes("chip fixed"));
assert("sample DB rows", (js.match(/\["[0-9]+", "UI/g) || []).length >= 15);
assert("completion audit visible", html.includes('id="view-completionAudit"') && html.includes("체크리스트 점검"));
assert("route policy visible", html.includes('id="view-routePolicy"') && html.includes("권장 라우트"));
assert("detail pages visible", ["view-memberDetail", "view-mypage", "view-certificateAdmin", "view-categoryAdmin"].every((id) => html.includes(`id="${id}"`)));

if (failures.length) {
  console.error("Verification failed");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Verification passed");
console.log(`views=${views.length}`);
console.log(`staticIds=${new Set(staticIds).size}`);
console.log(`sampleRows=${(js.match(/\["[0-9]+", "UI/g) || []).length}`);
