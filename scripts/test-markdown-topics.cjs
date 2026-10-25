const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const topics = require('../markdown-topics.js');

test('폴더 이름보다 문서 목적을 우선하며 기준·분석·요청문을 구분한다', () => {
  const cases = [
    ['01_화면_디자인/디자인시스템_확장시안/docs/DB_정리/99_생성검증결과.md', 'data'],
    ['01_화면_디자인/디자인시스템_확장시안/docs/시험사이트_분석/2024_figma_사이트맵_기능정의.md', 'site-analysis'],
    ['01_화면_디자인/디자인리소스_Figma_비교/figma_pdf_vs_design_resource_analysis.md', 'design-analysis'],
    ['01_화면_디자인/디자인리소스_Figma_비교/prompt.md', 'prompts'],
    ['01_화면_디자인/디자인시스템/docs/재사용_디자인_프롬프트/공통/03_다단구조_밀도_간격_기준.md', 'design-rules'],
    ['01_화면_디자인/디자인시스템/docs/old/디자인시스템_고도화_프롬프트.md', 'prompts'],
    ['03_프로젝트_도구/파일추출_업무프롬프트_생성기/v1/파일추출_업무프롬프트_생성기_기획안.md', 'planning'],
    ['03_프로젝트_도구/파일추출_업무프롬프트_생성기/v1/README.md', 'manual'],
    ['03_프로젝트_도구/마크다운에디터_내부용/uploads/1780373443446-e239dcd7c3bccca9-figma_mcp_사용_가이드.md', 'manual']
  ];
  cases.forEach(([file, expected]) => assert.equal(topics.classify({path: file}), expected, file));
});

test('등록 Markdown 전체가 하나의 목적 탭에 속하고 합계와 원본 경로가 보존된다', () => {
  const source = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const context = {};
  vm.runInNewContext(source.slice(source.indexOf('const DATA ='), source.indexOf('const htmlSections =')) + ';globalThis.data = DATA;', context);
  vm.runInNewContext(source.slice(source.indexOf('const COMMON_MD_DOCS ='), source.indexOf('let htmlView =')), context);
  const docs = context.data.mdDocs;
  const ids = topics.topics.filter(topic => topic.id !== 'all').map(topic => topic.id);
  const counts = Object.fromEntries(ids.map(id => [id, 0]));
  const before = docs.map(doc => doc.path).join('\n');
  docs.forEach(doc => {
    const id = topics.classify(doc);
    assert.ok(ids.includes(id), doc.path);
    counts[id]++;
  });
  assert.equal(Object.values(counts).reduce((sum, count) => sum + count, 0), docs.length);
  assert.equal(docs.map(doc => doc.path).join('\n'), before);
  assert.ok(Object.values(counts).every(count => count > 0));
  console.log('Markdown ' + docs.length + '개: ' + topics.topics.filter(topic => topic.id !== 'all').map(topic => topic.label + ' ' + counts[topic.id]).join(' / '));
});
