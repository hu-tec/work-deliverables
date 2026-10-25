// 실제 정리DB(휴텍씨DB_정제/일반사용자용_정리DB) CSV → data/*.json 시드 변환
// 규칙: 실제 데이터만 사용. 원본에 없는 값은 빈 문자열로 보존. 추측/생성 금지.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DB = join(ROOT, "..", "휴텍씨DB_정제", "일반사용자용_정리DB");
const OUT = join(ROOT, "data");

// ---- RFC4180 CSV 파서 (멀티라인/따옴표 필드 지원) ----
function parseCsv(text) {
  // BOM 제거
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\r") {
        // skip; \n handles row end
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += c;
      }
    }
  }
  // 마지막 필드/행
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function readTable(relPath) {
  const full = join(DB, relPath);
  const text = readFileSync(full, "utf8");
  const rows = parseCsv(text);
  const header = rows[0].map((h) => h.trim());
  const records = rows
    .slice(1)
    .filter((r) => r.some((c) => c.trim() !== "")) // 완전 빈 행 제거
    .map((r) => {
      const obj = {};
      header.forEach((h, i) => {
        obj[h] = (r[i] ?? "").trim();
      });
      return obj;
    });
  return { header, records };
}

function writeJson(name, data) {
  if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
  const p = join(OUT, name);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(data, null, 2), "utf8");
  return p;
}

const summary = [];

// ---- 1. 서비스 분야 대/중/소 분류 ----
{
  const { records } = readTable("01_분류체계/서비스_분야_대중소분류.csv");
  const data = records.map((r, i) => ({
    id: `field-${i + 1}`,
    large: r["대분류"] || "",
    medium: r["중분류"] || "",
    small: r["소분류"] || "",
    source: { file: r["원본파일"] || "", row: r["원본행"] || "" },
  }));
  writeJson("classification.json", data);
  summary.push(["classification.json", data.length]);
}

// ---- 2. 자격시험 종류와 급수 ----
{
  const { records } = readTable("01_분류체계/자격시험_종류와_급수.csv");
  const data = records.map((r, i) => ({
    id: `grade-${i + 1}`,
    examType: r["시험종류"] || "",
    gradeGroup: r["등급구분"] || "",
    grade: r["급수"] || "",
    source: { file: r["원본파일"] || "", row: r["원본행"] || "" },
  }));
  writeJson("grades.json", data);
  summary.push(["grades.json", data.length]);
}

// ---- 3. 응시대상 급수목록 ----
{
  const { records } = readTable("02_시험운영/응시대상_급수목록.csv");
  const data = records.map((r, i) => ({
    id: `exam-grade-${i + 1}`,
    gradeGroup: r["등급구분"] || "",
    detailGrade: r["세부급수"] || "",
    source: { file: r["원본파일"] || "", row: r["원본행"] || "" },
  }));
  writeJson("exam-grades.json", data);
  summary.push(["exam-grades.json", data.length]);
}

// ---- 4. 시험 기본설정 선택항목 (설정항목별 그룹) ----
{
  const { records } = readTable("02_시험운영/시험_기본설정_선택항목.csv");
  const groups = {};
  for (const r of records) {
    const key = r["설정항목"] || "";
    if (!key) continue;
    if (!groups[key]) groups[key] = [];
    if (r["선택값"]) groups[key].push(r["선택값"]);
  }
  const data = Object.entries(groups).map(([setting, values]) => ({
    setting,
    values,
  }));
  writeJson("exam-settings.json", data);
  summary.push(["exam-settings.json", `${data.length} 그룹`]);
}

// ---- 5. 통합DB 항목사전 (관리자 참고용) ----
{
  const { records } = readTable("05_서비스기획/통합DB_항목사전.csv");
  const data = records.map((r) => ({
    colNo: r["원본열번호"] || "",
    area: r["영역"] || "",
    name: r["항목명"] || "",
    example: r["기재값_또는_예시"] || "",
    source: { file: r["원본파일"] || "" },
  }));
  writeJson("field-dictionary.json", data);
  summary.push(["field-dictionary.json", data.length]);
}

// ---- 6. 문제은행 (분야별) ----
{
  const fieldFiles = [
    ["개발", "문제은행_개발.csv"],
    ["건강", "문제은행_건강.csv"],
    ["관계교육", "문제은행_관계교육.csv"],
    ["문서작성", "문제은행_문서작성.csv"],
    ["생활기타", "문제은행_생활기타.csv"],
    ["영상콘텐츠", "문제은행_영상콘텐츠.csv"],
    ["음성콘텐츠", "문제은행_음성콘텐츠.csv"],
    ["재무생활", "문제은행_재무생활.csv"],
    ["전문분야", "문제은행_전문분야.csv"],
    ["창작활동", "문제은행_창작활동.csv"],
    ["취업", "문제은행_취업.csv"],
    ["통번역", "문제은행_통번역.csv"],
  ];
  const index = [];
  for (const [fieldKey, file] of fieldFiles) {
    const { records } = readTable(`04_문제은행/${file}`);
    const items = records.map((r, i) => {
      const questions = [r["시험문제_안1"], r["시험문제_안2"], r["시험문제_안3"]]
        .map((v) => (v || "").trim())
        .filter((v) => v !== "");
      const answers = [r["답안자료_안1"], r["답안자료_안2"]]
        .map((v) => (v || "").trim())
        .filter((v) => v !== "");
      return {
        id: `${fieldKey}-${r["원본문항번호"] || i + 1}`,
        field: fieldKey,
        large: r["대분류"] || "",
        medium: r["중분류"] || "",
        small: r["소분류"] || "",
        originalNo: r["원본문항번호"] || "",
        questions, // 시험문제 안1~3 (있는 것만)
        answers, // 답안자료 안1~2 (있는 것만)
        modelAnswer: r["모범답안_채점자용"] || "", // 채점자용 비공개
        memo: r["추가메모"] || "",
        source: { file: r["원본파일"] || "", row: r["원본행"] || "" },
      };
    });
    writeJson(`question-bank/${fieldKey}.json`, items);
    index.push({
      field: fieldKey,
      count: items.length,
      withQuestion: items.filter((it) => it.questions.length > 0).length,
      withModelAnswer: items.filter((it) => it.modelAnswer !== "").length,
    });
  }
  writeJson("question-bank-index.json", index);
  const total = index.reduce((s, x) => s + x.count, 0);
  summary.push(["question-bank/*.json", `${index.length}분야 / 총 ${total}문항`]);
}

// ---- 결과 출력 ----
console.log("\n=== 시드 변환 완료 (실제 정리DB 기준) ===");
for (const [name, count] of summary) {
  console.log(`  ${name.padEnd(28)} ${count}`);
}
console.log(`\n출력 위치: ${OUT}\n`);
