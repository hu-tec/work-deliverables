const fs = require("fs");
const path = require("path");

const docs = [
  ["docs/디자인시스템.md", "design-system.html", "휴텍씨 디자인 시스템"],
  ["docs/시험사이트_분석/2025_figma_사이트맵_기능정의.md", "figma-2025-sitemap.html", "2025 Figma 사이트맵 기능정의"],
  ["docs/시험사이트_분석/2024_figma_사이트맵_기능정의.md", "figma-2024-sitemap.html", "2024 Figma 사이트맵 기능정의"],
  ["docs/시험사이트_분석/vibecoding_화면분석_쉬운설명.md", "vibecoding-screen-analysis.html", "Vibecoding 화면분석 쉬운설명"],
  ["docs/DB_정리/00_문서목록_및_읽는법.md", "db-doc-index.html", "DB 정리 문서목록 및 읽는법"],
  ["docs/DB_정리/02_시험운영/시험_문항과_채점방식_읽기자료.md", "exam-grading.html", "시험 문항과 채점방식 읽기자료"],
  ["docs/DB_정리/03_교육자료/교육과정_전체_읽기자료.md", "curriculum-reading.html", "교육과정 전체 읽기자료"],
  ["docs/DB_정리/05_서비스기획/서비스운영_기획원문_읽기자료.md", "service-planning-source.html", "서비스운영 기획원문 읽기자료"],
  ["docs/DB_정리/99_생성검증결과.md", "db-generation-check.html", "DB 정리 생성검증결과"],
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
