const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const search = require('../catalog-search.js');
const root = path.resolve(__dirname, '..');

test('본문 검색, 여러 단어 AND 조건, 제목 우선순위, 종류 필터', () => {
  const entries = [
    {path: 'screen.html', title: '신청 화면', kind: 'html', content: '키보드로 이동할 때 초점 표시를 확인합니다.'},
    {path: 'guide.md', title: '키보드 초점', kind: 'md', content: '화면 점검 방법'},
    {path: 'other.md', title: '키보드', kind: 'md', content: '검색 대상 아님'}
  ].map(search.prepare);
  assert.deepEqual(search.search(entries, '키보드 초점').map(x => x.path), ['guide.md', 'screen.html']);
  assert.deepEqual(search.search(entries, '키보드 초점', 'html').map(x => x.path), ['screen.html']);
  assert.equal(search.search(entries, '키보드 없는단어').length, 0);
  assert.equal(search.search(entries, '   ').length, 0);
});

test('대소문자·전각 문자·한글 조합 정규화 및 제목/본문 교차 검색', () => {
  const item = search.prepare({title: 'SEO 보고서', path: 'a.md', kind: 'md', content: '개인정보 암호화'});
  assert.equal(search.search([item], 'ｓｅｏ  ' + '개인정보'.normalize('NFD')).length, 1);
});

test('긴 본문 끝까지 검색하며 검색 결과의 HTML은 실행되지 않도록 이스케이프', () => {
  const entry = search.prepare({title: '문서', kind: 'md', path: 'a.md', content: '앞부분 '.repeat(30000) + '<img src=x onerror=alert(1)> 암호화 끝부분'});
  assert.equal(search.search([entry], '암호화').length, 1);
  const excerpt = search.snippet(entry, ['암호화']);
  assert.match(excerpt.html, /<mark>암호화<\/mark>/);
  assert.ok(!excerpt.html.includes('<img'));
  assert.ok(excerpt.html.includes('&lt;img'));
  assert.ok(search.highlight('<script>', ['script']).includes('&lt;<mark>script</mark>&gt;'));
});

test('생성된 색인에 등록 자료가 빠지지 않고 실제 파일을 가리킴', () => {
  const context = {window: {}};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'search-index.js'), 'utf8'), context);
  const entries = context.window.DELIVERABLE_SEARCH_INDEX;
  const byPath = new Map(entries.map(entry => [entry.path, entry]));
  const catalog = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const paths = [...catalog.matchAll(/"path":\s*"([^"\n]+\.(?:html|md))"/g)].map(match => match[1]);
  for (const file of paths) assert.ok(byPath.has(file), file);
  for (const entry of entries) assert.ok(fs.existsSync(path.join(root, entry.path)), entry.path);
  assert.ok(entries.some(entry => entry.kind === 'guide' && entry.path.endsWith('보안_프롬프트.md')));
});

test('통합검색 결과 수·열기·초기화와 기존 목록의 본문 검색 연결', () => {
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, {value: '', listeners: {}, addEventListener(type, handler) { this.listeners[type] = handler; }, focus() {}});
    return elements.get(id);
  };
  const previous = {document: global.document, index: global.DELIVERABLE_SEARCH_INDEX};
  global.document = {getElementById: element};
  global.DELIVERABLE_SEARCH_INDEX = [{path: 'a.html', kind: 'html', title: '원문', content: '키보드 초점 표시'}];
  let opened, shown = 0;
  try {
    search.mount({docs: {htmlDocs: [{path: 'a.html', title: '화면'}], mdDocs: []}, title: doc => doc.title,
      dbFiles: [{path: 'data.csv', name: '표 자료', rows: [['개인정보', '암호화']]}],
      showResults: () => shown++, open: entry => { opened = entry; }});
    element('global-search-kind').value = 'all';
    element('global-search-input').value = '키보드 초점';
    element('global-search-form').listeners.submit({preventDefault() {}});
    assert.match(element('global-search-status').textContent, /^1개/);
    assert.match(element('global-search-results').innerHTML, /<mark>키보드<\/mark>/);
    element('global-search-results').listeners.click({target: {closest: () => ({dataset: {searchResult: '0'}})}});
    assert.equal(opened.path, 'a.html');
    assert.equal(search.matchesDocument({path: 'a.html'}, '키보드 초점'), true);
    assert.equal(search.matchesDocument({path: 'data.csv'}, '개인정보 암호화'), true);
    element('global-search-form').listeners.reset({preventDefault() {}});
    assert.equal(element('global-search-input').value, '');
    assert.ok(shown >= 2);
  } finally {
    global.document = previous.document;
    global.DELIVERABLE_SEARCH_INDEX = previous.index;
  }
});
