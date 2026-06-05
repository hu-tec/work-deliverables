const pageId = document.body.dataset.page || "intro";
const site = window.AITE_SITE;
const page = site.pages[pageId] || site.pages.intro;
const linked = { translation: "./aite-translation.html", prompt: "./aite-prompt.html", itt: "./itt.html", ethics: "./ai-ethics.html" };
const boardData = {
  notices: [
    ["aite-exam-1", "공지", true, "AITe 2026년 1차 정기시험 접수 안내", "자격관리팀", "2026.04.05", 2043],
    ["ai-ethics", "신규", true, "AI 윤리 시험 공통 필수 과목 운영 안내", "운영팀", "2026.04.18", 932],
    ["briefing", "안내", false, "시험 설명회 일정 및 오프라인 참석 방법 안내", "행정실", "2026.04.10", 1571],
    ["certificate-change", "안내", false, "자격증·증명서 발급 절차 변경 안내", "행정실", "2026.03.28", 845],
    ["platform-maintenance", "공지", false, "온라인 시험 플랫폼 정기 점검 안내", "시스템팀", "2026.03.20", 612],
    ["group-apply", "접수", false, "단체 접수 및 응시자 명단 제출 안내", "자격관리팀", "2026.03.12", 1109]
  ],
  faqs: [
    ["공통", "과정 수강 없이 자격시험만 응시할 수 있나요?", "일부 급수는 과정 수강 없이 회차별로 응시할 수 있습니다."],
    ["공통", "응시 확인서는 어떻게 발급되나요?", "접수 완료 후 마이페이지 또는 접수 확인 안내를 통해 발급됩니다."],
    ["시험", "재응시가 가능한가요?", "불합격 또는 미응시자는 다음 회차에 다시 접수해 응시할 수 있습니다."],
    ["시험", "AI 윤리 시험은 반드시 봐야 하나요?", "AI 윤리 시험은 모든 AITe 자격 인증의 공통 필수 과목입니다."],
    ["접수", "단체 접수도 가능한가요?", "30명 이상 단체 응시는 고객지원으로 일정과 명단 양식을 문의해 주세요."]
  ],
  qnas: [
    ["exam-ticket", "시험", "AITe 시험 응시 확인서 출력 위치가 궁금합니다.", "김*연", "2026.04.22", "답변 완료"],
    ["group-apply", "접수", "단체 접수 시 명단 양식이 따로 있나요?", "박*훈", "2026.04.16", "답변 완료"],
    ["refund", "접수", "접수 취소와 환불 가능 기간을 알고 싶습니다.", "이*진", "2026.04.09", "답변대기"]
  ],
  materials: [
    ["시험요강", "AITe 2026년 1차 시험요강", "PDF", "920KB"],
    ["신청서", "단체 접수 신청서 양식", "DOCX", "48KB"],
    ["가이드", "온라인 시험 응시 환경 점검 가이드", "PDF", "1.2MB"]
  ]
};

function esc(value) {
  return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function navHtml() {
  return site.nav.map((item) => {
    const active = item.pages.includes(pageId) ? "active" : "";
    const children = item.children ? `<div class="sub-menu">${item.children.map((child) => `<a class="${child.page === pageId ? "active" : ""}" href="${child.href}">${esc(child.label)}</a>`).join("")}</div>` : "";
    return `<div class="nav-item"><a class="${active}" href="${item.href}">${esc(item.label)}</a>${children}</div>`;
  }).join("");
}

function renderBoardPage() {
  return `
    <section class="section section--soft"><div class="container">
      <nav class="tabs" id="commTabs" aria-label="게시판 분류">
        <a href="#notice" class="active" data-tab="notice">공지사항</a>
        <a href="#faq" data-tab="faq">자주 묻는 질문</a>
        <a href="#qna" data-tab="qna">Q&amp;A</a>
        <a href="#data" data-tab="data">자료실</a>
      </nav>
      <div class="tab-panel active" id="tab-notice">
        <div class="section-head"><div><span class="section-label">NOTICE</span><h2>공지사항</h2></div><span class="note">협회 공식 안내 게시판</span></div>
        <nav class="subtabs" id="noticeSubtabs" aria-label="공지 분류"></nav>
        <div class="board-bar">
          <div class="board-count">전체 <strong id="noticeTotal">0</strong>건</div>
          <form class="board-search" onsubmit="return false;">
            <span class="search-scope" role="group" aria-label="검색 분류"><button type="button" class="scope-btn active" aria-pressed="true">제목</button><button type="button" class="scope-btn" aria-pressed="false">작성자</button></span>
            <input type="search" placeholder="검색어를 입력하세요" aria-label="검색어">
            <button class="btn btn--outline btn--sm" type="submit">검색</button>
          </form>
        </div>
        <div class="board-scroll"><table class="board"><thead><tr><th class="col-no">번호</th><th class="col-cat">분류</th><th>제목</th><th class="col-writer">작성자</th><th class="col-date">등록일</th><th class="col-views">조회</th></tr></thead><tbody id="noticeBody"></tbody></table></div>
        <nav class="pagination" aria-label="페이지"><span>&laquo;</span><span class="current">1</span><a href="#">2</a><a href="#">3</a><span>&raquo;</span></nav>
      </div>
      <div class="tab-panel" id="tab-faq">
        <div class="section-head"><div><span class="section-label">FAQ</span><h2>자주 묻는 질문</h2></div><span class="note">질문을 누르면 답변이 펼쳐집니다</span></div>
        <nav class="subtabs" id="faqSubtabs" aria-label="FAQ 분류"></nav>
        <div class="board-bar"><div class="board-count">전체 <strong id="faqTotal">0</strong>건</div></div>
        <div class="faq-list" id="faqList"></div>
      </div>
      <div class="tab-panel" id="tab-qna">
        <div class="section-head"><div><span class="section-label">Q&amp;A</span><h2>Q&amp;A</h2></div><span class="note">개별 문의와 답변을 확인할 수 있습니다</span></div>
        <nav class="subtabs" id="qnaSubtabs" aria-label="Q&A 분류"></nav>
        <div class="board-bar"><div class="board-count">전체 <strong id="qnaTotal">0</strong>건</div><a class="btn btn--outline btn--sm" href="./support.html">문의하기</a></div>
        <div class="board-scroll"><table class="board qna-board"><thead><tr><th class="col-no">번호</th><th class="col-cat">분류</th><th>제목</th><th class="col-writer">작성자</th><th class="col-date">등록일</th><th class="col-status">상태</th></tr></thead><tbody id="qnaBody"></tbody></table></div>
      </div>
      <div class="tab-panel" id="tab-data">
        <div class="section-head"><div><span class="section-label">DATA</span><h2>자료실</h2></div><span class="note">요강·신청서 다운로드</span></div>
        <div class="data-list" id="dataList"></div>
      </div>
    </div></section>`;
}

function sectionHtml(section, index) {
  const soft = index % 2 === 0 ? " section--soft" : "";
  if (section.type === "features") {
    return `<section class="section${soft}"><div class="container split"><div class="media-frame ${section.label && section.label.includes("언어") ? "language" : ""}"></div><div><span class="section-label">${esc(section.label)}</span><h2>${esc(section.title)}</h2>${section.copy ? `<p>${esc(section.copy)}</p>` : ""}<ul class="feature-list">${(section.items || []).map((item) => `<li><span class="check">✓</span><span>${esc(item)}</span></li>`).join("")}</ul></div></div></section>`;
  }
  if (section.type === "table") {
    return `<section class="section${soft}"><div class="container"><div class="section-head"><div><span class="section-label">${esc(section.label)}</span><h2>${esc(section.title)}</h2></div></div><div class="table-scroll"><table class="schedule-table"><thead><tr>${section.headers.map((head) => `<th>${esc(head)}</th>`).join("")}</tr></thead><tbody>${section.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div></section>`;
  }
  return `<section class="section${soft}"><div class="container"><div class="section-head"><div><span class="section-label">${esc(section.label)}</span><h2>${esc(section.title)}</h2></div>${section.note ? `<p>${esc(section.note)}</p>` : ""}</div><div class="grid ${section.cards.length > 3 ? "four" : "three"}">${section.cards.map((card, cardIndex) => {
    const href = linked[["translation", "itt", "prompt", "ethics"][cardIndex]];
    const action = href && pageId === "intro" ? `<div class="tag-row"><a class="filter-chip active" href="${href}">바로가기</a></div>` : "";
    return `<article class="card"><div class="card-kicker"><span class="card-index">${String(cardIndex + 1).padStart(2, "0")}</span><span class="status-pill">${esc(card[2] || section.label)}</span></div><h3>${esc(card[0])}</h3><p>${esc(card[1])}</p>${action}</article>`;
  }).join("")}</div></div></section>`;
}

function bindBoardPage() {
  if (pageId !== "board") return;
  const tabs = document.querySelectorAll("#commTabs a");
  function activate(name) {
    tabs.forEach((tab) => {
      const on = tab.dataset.tab === name;
      tab.classList.toggle("active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === "tab-" + name));
  }
  tabs.forEach((tab) => tab.addEventListener("click", (event) => {
    event.preventDefault();
    activate(tab.dataset.tab);
    history.replaceState(null, "", "#" + tab.dataset.tab);
  }));

  const noticeRows = boardData.notices.map(([id, category, pinned, title, writer, date, views], index) => `
    <tr data-cat="${esc(category)}">
      <td class="col-no">${pinned ? '<span class="pin-no">공지</span>' : boardData.notices.length - index}</td>
      <td class="col-cat"><span class="cat-badge">${esc(category)}</span></td>
      <td class="subject"><a href="#">${esc(title)}</a>${pinned ? '<span class="new-dot">N</span>' : ""}</td>
      <td class="col-writer">${esc(writer)}</td>
      <td class="col-date">${esc(date)}</td>
      <td class="col-views">${views.toLocaleString()}</td>
    </tr>`).join("");
  document.getElementById("noticeBody").innerHTML = noticeRows;

  bindFilter("noticeSubtabs", "noticeTotal", "#noticeBody tr", boardData.notices.map(([, category]) => category));

  document.getElementById("faqList").innerHTML = boardData.faqs.map(([category, question, answer]) => `
    <div class="faq-item" data-cat="${esc(category)}">
      <button class="faq-q" type="button" aria-expanded="false"><span class="cat-badge">${esc(category)}</span><span>${esc(question)}</span><span class="arrow">▾</span></button>
      <div class="faq-a"><p>${esc(answer)}</p></div>
    </div>`).join("");
  bindFilter("faqSubtabs", "faqTotal", "#faqList .faq-item", boardData.faqs.map(([category]) => category));
  document.querySelectorAll("#faqList .faq-q").forEach((button) => button.addEventListener("click", () => {
    const item = button.parentElement;
    item.classList.toggle("open");
    button.setAttribute("aria-expanded", item.classList.contains("open") ? "true" : "false");
  }));

  document.getElementById("qnaBody").innerHTML = boardData.qnas.map(([id, category, title, writer, date, status], index) => `
    <tr data-cat="${esc(category)}">
      <td class="col-no">${boardData.qnas.length - index}</td>
      <td class="col-cat"><span class="cat-badge">${esc(category)}</span></td>
      <td class="subject"><a href="#">${esc(title)}</a></td>
      <td class="col-writer">${esc(writer)}</td>
      <td class="col-date">${esc(date)}</td>
      <td class="col-status"><span class="status-pill ${status === "답변 완료" ? "done" : "wait"}">${esc(status)}</span></td>
    </tr>`).join("");
  bindFilter("qnaSubtabs", "qnaTotal", "#qnaBody tr", boardData.qnas.map(([, category]) => category));

  document.getElementById("dataList").innerHTML = boardData.materials.map(([category, title, type, size]) => `
    <a class="data-item" href="#"><span class="cat-badge">${esc(category)}</span><strong>${esc(title)}</strong><span>${esc(type)} · ${esc(size)}</span></a>`).join("");

  document.querySelectorAll(".scope-btn").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll(".scope-btn").forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
  }));

  const hash = (location.hash || "").replace("#", "");
  if (["notice", "faq", "qna", "data"].includes(hash)) activate(hash);
}

function bindFilter(subtabsId, totalId, selector, categories) {
  const subtabs = document.getElementById(subtabsId);
  const rows = document.querySelectorAll(selector);
  const unique = ["전체", ...Array.from(new Set(categories))];
  subtabs.innerHTML = unique.map((category, index) => `<button type="button" class="${index === 0 ? "active" : ""}" data-cat="${esc(category)}" aria-pressed="${index === 0}">${esc(category)}<span class="cnt">${category === "전체" ? rows.length : categories.filter((item) => item === category).length}</span></button>`).join("");
  function filter(category) {
    let shown = 0;
    rows.forEach((row) => {
      const match = category === "전체" || row.dataset.cat === category;
      row.style.display = match ? "" : "none";
      if (match) shown++;
    });
    document.getElementById(totalId).textContent = shown;
  }
  subtabs.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    subtabs.querySelectorAll("button").forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    filter(button.dataset.cat);
  }));
  filter("전체");
}

document.getElementById("app").innerHTML = `
  <a class="skip-link" href="#main">본문으로 이동</a>
  <header class="site-header">
    <div class="header-top"><div class="container header-top-inner"><a href="#">로그인</a><span class="sep">·</span><a href="#">회원가입</a></div></div>
    <div class="container header-inner">
      <a class="brand" href="./association.html"><img src="./assets/logo.png" alt="IITA 협회"><span>IITA 협회<small>국제통번역협회</small></span></a>
      <nav class="gnb" aria-label="주요 메뉴">${navHtml()}</nav>
      <div class="header-actions"><button class="mobile-menu" type="button" aria-expanded="false">MENU</button><a class="btn btn--primary btn--sm" href="./association.html">협회 소개</a></div>
    </div>
  </header>
  <main id="main">
    <section class="hero"><div class="container hero-inner"><div><span class="eyebrow">${esc(page.eyebrow)}</span><h1>${esc(page.title)}</h1><p class="hero-copy">${esc(page.copy)}</p><div class="hero-actions"><a class="btn btn--primary btn--lg" href="./association.html">협회 소개</a><a class="btn btn--outline btn--lg" href="#detail">상세 보기</a></div></div><div class="hero-panel"><strong>${esc(page.stat[0])}</strong><span>${esc(page.stat[1])}</span></div></div></section>
    <div id="detail"></div>
    ${pageId === "board" ? renderBoardPage() : page.sections.map(sectionHtml).join("")}
  </main>
  <section class="cta"><div class="container cta-inner"><div><h2>${esc(page.cta)}</h2></div><a class="btn btn--primary btn--lg" href="./association.html">협회 소개</a></div></section>
  <footer class="site-footer"><div class="container"><div class="footer-grid"><div><img src="./assets/logo.png" alt="AITe자격시험"><p>AITe자격시험</p></div><div><h2>Phone Call</h2><p>02-6207-9090</p><p>월요일 - 금요일 : 09:00 - 18:00</p><p>주말 / 공휴일 휴일</p></div><div><h2>Company Info</h2><p>상호명 : 주식회사 아이티티</p><p>대표이사 : 김태경</p><p>주소 : 서울 서초구 양재천로 19길 26,6층(양재동)</p><p>사업자번호 : 101-86-40065</p><p>문의 : hutechc01@gmail.com</p></div></div><div class="copyright">© 휴텍씨. ALL RIGHTS RESERVED.</div></div></footer>
`;

document.querySelector(".mobile-menu").addEventListener("click", (event) => {
  const open = document.body.classList.toggle("menu-open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});

bindBoardPage();
