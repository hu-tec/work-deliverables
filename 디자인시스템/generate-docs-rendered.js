const fs = require("fs");
const path = require("path");

const docs = [
  ["docs/재사용_디자인_프롬프트/00_문서목록.md", "reusable-prompts-index.html", "재사용 디자인 프롬프트 문서목록"],
  ["docs/재사용_디자인_프롬프트/사용자/00_문서목록.md", "reusable-user-index.html", "사용자 재사용 디자인 프롬프트"],
  ["docs/재사용_디자인_프롬프트/사용자/01_사용자화면_디자인시스템_기준.md", "reusable-user-design-system.html", "사용자화면 디자인시스템 기준"],
  ["docs/재사용_디자인_프롬프트/관리자/00_문서목록.md", "reusable-admin-index.html", "관리자 재사용 디자인 프롬프트"],
  ["docs/재사용_디자인_프롬프트/관리자/02_BO_테이블레이아웃_기준.md", "reusable-bo-table-layout.html", "BO 테이블레이아웃 기준"],
  ["docs/재사용_디자인_프롬프트/관리자/03_BO_관리자화면_기준.md", "reusable-bo-admin-screen.html", "BO 관리자화면 기준"],
  ["docs/재사용_디자인_프롬프트/관리자/04_BO_관리자용_레이아웃_기준.md", "reusable-bo-admin-layout.html", "BO 관리자용 레이아웃 기준"],
  ["docs/재사용_디자인_프롬프트/관리자/components/상태_유형_칩_기준.md", "reusable-status-chip.html", "상태/유형 칩 기준"],
  ["docs/재사용_디자인_프롬프트/관리자/components/검색필터_기준.md", "reusable-search-filter.html", "검색필터 기준"],
  ["docs/재사용_디자인_프롬프트/관리자/components/인라인_Drawer_기준.md", "reusable-inline-drawer.html", "인라인 Drawer 기준"],
  ["docs/재사용_디자인_프롬프트/관리자/components/테이블선택_Drawer_상세패널_기준.md", "reusable-table-selection-drawer.html", "테이블 선택 Drawer 상세패널 기준"],
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderInline(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let inCode = false;
  let code = [];
  let paragraph = [];
  let listType = null;
  let tableRows = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };
  const flushTable = () => {
    if (!tableRows.length) return;
    const rows = tableRows.filter((row) => !/^[\s|:-]+$/.test(row));
    const rendered = rows.map((row, rowIndex) => {
      const tag = rowIndex === 0 ? "th" : "td";
      const cells = row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|");
      return `<tr>${cells.map((cell) => `<${tag}>${renderInline(cell.trim())}</${tag}>`).join("")}</tr>`;
    }).join("");
    html.push(`<table><tbody>${rendered}</tbody></table>`);
    tableRows = [];
  };
  const flushBlocks = () => {
    flushParagraph();
    flushList();
    flushTable();
  };

  lines.forEach((line) => {
    if (line.startsWith("```")) {
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
        code = [];
        inCode = false;
      } else {
        flushBlocks();
        inCode = true;
      }
      return;
    }
    if (inCode) {
      code.push(line);
      return;
    }
    if (!line.trim()) {
      flushBlocks();
      return;
    }
    if (line.includes("|") && /^\s*\|?.+\|.+/.test(line)) {
      flushParagraph();
      flushList();
      tableRows.push(line);
      return;
    }
    flushTable();
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      return;
    }
    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const type = unordered ? "ul" : "ol";
      if (listType !== type) {
        flushList();
        html.push(`<${type}>`);
        listType = type;
      }
      html.push(`<li>${renderInline((unordered || ordered)[1])}</li>`);
      return;
    }
    const quote = line.match(/^>\s?(.+)$/);
    if (quote) {
      flushParagraph();
      flushList();
      html.push(`<blockquote>${renderInline(quote[1])}</blockquote>`);
      return;
    }
    paragraph.push(line.trim());
  });

  if (inCode) html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
  flushBlocks();
  return html.join("\n");
}

const css = `
body{margin:0;padding:28px 32px;color:#222;font-family:"Noto Sans KR","Pretendard","Apple SD Gothic Neo",Arial,sans-serif;font-size:14px;line-height:1.75;letter-spacing:-.02em}
h1,h2,h3,h4{margin:1.4em 0 .5em;line-height:1.35;letter-spacing:0}
h1:first-child,h2:first-child,h3:first-child{margin-top:0}
h1{font-size:28px}h2{border-bottom:1px solid #e3e5ed;padding-bottom:8px;font-size:22px}h3{font-size:18px}
p,ul,ol,blockquote,table{margin:0 0 14px}ul,ol{padding-left:22px}
blockquote{border-left:4px solid #0088ff;background:#e7f2ff;padding:10px 14px;color:#666}
table{width:100%;border-collapse:collapse;font-size:13px}th,td{border:1px solid #e3e5ed;padding:8px 10px;vertical-align:top}
th{background:#f8f9fc;color:#666;font-weight:700}
pre{overflow:auto;border:1px solid #e3e5ed;border-radius:6px;background:#fbfcff;padding:14px;white-space:pre-wrap}
code{border-radius:4px;background:#f8f9fc;padding:2px 5px;color:#006dcc;font-family:Consolas,Monaco,monospace;font-size:12px;letter-spacing:0}
a{color:#006dcc;text-underline-offset:2px}
`;

fs.mkdirSync("docs_rendered", { recursive: true });

docs.forEach(([source, filename, title]) => {
  const markdown = fs.readFileSync(source, "utf8");
  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>${css}</style>
</head>
<body>
${renderMarkdown(markdown)}
</body>
</html>
`;
  fs.writeFileSync(path.join("docs_rendered", filename), html);
});

console.log(`generated ${docs.length} rendered docs`);
