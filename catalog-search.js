(function (root) {
  'use strict';
  const labels = {html: 'HTML', md: 'Markdown', guide: '프롬프트 가이드', db: 'DB 자료', tool: '프로젝트·도구', reference: '레퍼런스'};
  const normalize = value => String(value == null ? '' : value).normalize('NFKC').replace(/\s+/g, ' ').trim();
  const terms = query => [...new Set(normalize(query).toLocaleLowerCase().split(' ').filter(Boolean))];
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
  const flatten = value => Array.isArray(value) ? value.map(flatten).join(' ') : value && typeof value === 'object' ? Object.values(value).map(flatten).join(' ') : normalize(value);
  let documentsByPath = new Map();

  function prepare(entry) {
    const body = normalize(entry.content);
    const metadata = normalize([entry.title, entry.path, entry.section, entry.subsection, entry.date, ...(entry.sourceDocs || [])].join(' '));
    return {...entry, body, metadata, titleLower: normalize(entry.title).toLocaleLowerCase(), bodyLower: body.toLocaleLowerCase(), metaLower: metadata.toLocaleLowerCase(), searchable: (metadata + ' ' + body).toLocaleLowerCase()};
  }

  function search(entries, query, kind = 'all') {
    const words = terms(query);
    if (!words.length) return [];
    const phrase = normalize(query).toLocaleLowerCase();
    return entries.filter(entry => (kind === 'all' || entry.kind === kind) && words.every(word => entry.searchable.includes(word)))
      .map(entry => ({entry, score: (entry.titleLower === phrase ? 100 : 0) + (entry.titleLower.includes(phrase) ? 40 : 0) + words.reduce((score, word) => score + (entry.titleLower.includes(word) ? 15 : entry.metaLower.includes(word) ? 5 : 1), 0)}))
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, 'ko')).map(item => item.entry);
  }

  function highlight(text, words) {
    const lower = text.toLocaleLowerCase();
    const ranges = [];
    words.forEach(word => {
      let from = 0, found;
      while ((found = lower.indexOf(word, from)) >= 0) {
        ranges.push([found, found + word.length]);
        from = found + word.length;
      }
    });
    ranges.sort((a, b) => a[0] - b[0]);
    const merged = [];
    ranges.forEach(range => {
      const last = merged[merged.length - 1];
      if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
      else merged.push(range.slice());
    });
    let output = '', offset = 0;
    merged.forEach(([start, end]) => {
      output += escape(text.slice(offset, start)) + '<mark>' + escape(text.slice(start, end)) + '</mark>';
      offset = end;
    });
    return output + escape(text.slice(offset));
  }

  function snippet(entry, words) {
    const bodyMatches = words.some(word => entry.bodyLower.includes(word));
    const text = bodyMatches ? entry.body : entry.metadata;
    const lower = text.toLocaleLowerCase();
    const first = Math.min(...words.map(word => lower.indexOf(word)).filter(index => index >= 0));
    const start = Number.isFinite(first) ? Math.max(0, first - 45) : 0;
    const end = Math.min(text.length, start + 200);
    const label = entry.kind === 'reference' ? '등록 정보 일치' : bodyMatches ? '내용 일치' : '제목·경로 일치';
    return {label, html: (start ? '… ' : '') + highlight(text.slice(start, end), words) + (end < text.length ? ' …' : '')};
  }

  function matchesDocument(doc, query) {
    const words = terms(query);
    if (!words.length) return true;
    const indexed = documentsByPath.get(doc.path);
    const text = indexed ? indexed.searchable : prepare(doc).searchable;
    return words.every(word => text.includes(word));
  }

  function mount(options) {
    const catalog = new Map([...options.docs.htmlDocs, ...options.docs.mdDocs].map(doc => [doc.path, doc]));
    const byPath = new Map();
    (root.DELIVERABLE_SEARCH_INDEX || []).forEach(source => {
      const doc = catalog.get(source.path);
      byPath.set(source.path, {...doc, ...source, title: doc ? options.title(doc) : source.title,
        date: (root.FILE_MODIFIED_DATES || {})[source.path] || (doc && (doc.modifiedDate || doc.date)) || '', key: source.path});
    });
    // Keep metadata/embedded Markdown searchable even if the generated file is unavailable.
    catalog.forEach((doc, path) => {
      if (!byPath.has(path)) byPath.set(path, {...doc, key: path, title: options.title(doc), kind: path.endsWith('.html') ? 'html' : 'md'});
    });
    (options.dbFiles || []).forEach(file => byPath.set(file.path, {
      key: file.path, path: file.path, title: file.name, section: file.group, kind: 'db',
      content: file.content || flatten(file.rows || file.sheets || [])
    }));
    const entries = [...byPath.values()];
    (options.tools || []).forEach((tool, index) => entries.push({
      key: 'tool:' + index, toolIndex: index, kind: 'tool', title: tool.name, path: tool.sourcePath || tool.zip,
      section: tool.category, content: tool.why + ' ' + (tool.docs || []).join(' '), download: tool.zip
    }));
    (root.REFERENCE_LINKS || []).forEach(link => entries.push({
      key: link.url, kind: 'reference', title: link.label, path: link.url, section: link.purpose,
      content: link.purpose + ' ' + (link.sources || []).join(' ')
    }));
    const prepared = entries.map(prepare);
    documentsByPath = new Map(prepared.filter(entry => entry.kind !== 'tool' && entry.kind !== 'reference').map(entry => [entry.path, entry]));
    const form = document.getElementById('global-search-form');
    const input = document.getElementById('global-search-input');
    const filter = document.getElementById('global-search-kind');
    const status = document.getElementById('global-search-status');
    const results = document.getElementById('global-search-results');
    const more = document.getElementById('global-search-more');
    let timer, composing = false, found = [], limit = 40, activeWords = [];

    function renderResults() {
      if (!activeWords.length) {
        results.innerHTML = '<p class="search-empty">검색어를 입력하면 제목과 본문에서 함께 찾습니다. 예: 키보드 초점, 개인정보 암호화</p>';
      } else if (!found.length) {
        results.innerHTML = '<p class="search-empty">일치하는 자료가 없습니다. 검색어를 줄이거나 자료 종류를 ‘전체’로 바꿔 보세요.</p>';
      } else {
        results.innerHTML = found.slice(0, limit).map((entry, index) => {
          const excerpt = snippet(entry, activeWords);
          const title = highlight(normalize(entry.title), activeWords);
          const opener = entry.kind === 'reference'
            ? '<a class="search-result-title" href="' + escape(entry.path) + '" target="_blank" rel="noopener noreferrer">' + title + ' ↗</a>'
            : '<button class="search-result-title" type="button" data-search-result="' + index + '">' + title + '</button>';
          const download = entry.kind === 'reference' ? '' : '<a href="' + escape(encodeURI(entry.download || entry.path)) + '" download>파일 다운로드</a>';
          return '<article class="search-result"><h3 class="search-result-heading"><span class="search-result-type">' + labels[entry.kind] + '</span>' + opener + '</h3>' +
            '<p class="search-result-snippet"><span class="search-match-label">' + excerpt.label + ' · </span>' + excerpt.html + '</p>' +
            '<p class="search-result-path">' + highlight(entry.path, activeWords) + '</p><div class="search-result-actions">' + download +
            (entry.date ? '<span>수정 ' + escape(entry.date) + '</span>' : '') + '</div></article>';
        }).join('');
      }
      more.hidden = found.length <= limit;
      more.textContent = '결과 더 보기 (' + Math.min(limit, found.length) + ' / ' + found.length + ')';
    }

    function run() {
      clearTimeout(timer);
      activeWords = terms(input.value);
      limit = 40;
      found = search(prepared, input.value, filter.value);
      status.textContent = activeWords.length ? found.length + '개 자료 · 띄어 쓴 검색어 모두 포함' : '검색 대상 ' + prepared.length + '개 자료';
      renderResults();
      options.showResults();
    }
    form.addEventListener('submit', event => { event.preventDefault(); run(); });
    input.addEventListener('compositionstart', () => { composing = true; clearTimeout(timer); });
    input.addEventListener('compositionend', () => { composing = false; timer = setTimeout(run, 180); });
    input.addEventListener('input', () => { clearTimeout(timer); if (!composing) timer = setTimeout(run, 180); });
    form.addEventListener('reset', event => { event.preventDefault(); input.value = ''; filter.value = 'all'; run(); input.focus(); });
    filter.addEventListener('change', run);
    more.addEventListener('click', () => { limit += 40; renderResults(); });
    results.addEventListener('click', event => {
      const button = event.target.closest('[data-search-result]');
      if (button) options.open(found[Number(button.dataset.searchResult)]);
    });
    status.textContent = '검색 대상 ' + prepared.length + '개 자료';
    renderResults();
  }

  const api = {prepare, search, highlight, snippet, terms, flatten, matchesDocument, mount};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DeliverableSearch = api;
})(typeof window !== 'undefined' ? window : globalThis);
