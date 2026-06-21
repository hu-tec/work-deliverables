/* 공통 스크립트 — 로그인/회원가입 모달 + 회사 정보 푸터
 * 모든 페이지에서 <script src="./site.js"></script> 로 로드.
 * (회사 정보는 플레이스홀더 — 실제 값으로 교체하세요) */
(function () {
  if (window.__siteInit) return;
  window.__siteInit = true;

  /* ============ 1) 로그인 / 회원가입 모달 ============ */
  const modalHTML = `
  <div class="modal-backdrop" id="authModal" role="dialog" aria-modal="true" aria-labelledby="authTitle">
    <div class="modal">
      <div class="modal-head"><h2 id="authTitle">로그인</h2><button class="modal-close" type="button" aria-label="닫기" data-auth-close>&times;</button></div>
      <div class="auth-tabs" role="tablist">
        <button class="auth-tab active" type="button" data-tab="login" role="tab" aria-selected="true">로그인</button>
        <button class="auth-tab" type="button" data-tab="signup" role="tab" aria-selected="false">회원가입</button>
      </div>
      <div class="auth-body">
        <!-- 로그인 -->
        <form class="auth-form" data-form="login" data-kind="login">
          <div><label class="label" for="li-id">이메일(아이디)</label><input class="field" id="li-id" type="text" autocomplete="username" value="demo@timesedu.co.kr" required></div>
          <div><label class="label" for="li-pw">비밀번호</label><input class="field" id="li-pw" type="password" autocomplete="current-password" value="1234" required></div>
          <div class="auth-row">
            <label class="auth-check"><input type="checkbox"> 로그인 상태 유지</label>
            <span class="auth-links"><a href="#">아이디 찾기</a><span>·</span><a href="#">비밀번호 찾기</a></span>
          </div>
          <button class="btn btn--primary btn--lg" type="submit">로그인</button>
          <div class="auth-divider">간편 로그인</div>
          <div class="social-row">
            <button class="social-btn kakao" type="button">카카오로 시작하기</button>
            <button class="social-btn naver" type="button">네이버로 시작하기</button>
            <button class="social-btn" type="button">Google로 시작하기</button>
          </div>
        </form>
        <!-- 회원가입 -->
        <form class="auth-form hidden" data-form="signup" data-kind="signup">
          <div><label class="label" for="su-email">이메일</label><input class="field" id="su-email" type="email" autocomplete="email" required></div>
          <div><label class="label" for="su-pw">비밀번호</label><input class="field" id="su-pw" type="password" autocomplete="new-password" required></div>
          <div><label class="label" for="su-pw2">비밀번호 확인</label><input class="field" id="su-pw2" type="password" autocomplete="new-password" required></div>
          <div><label class="label" for="su-name">이름</label><input class="field" id="su-name" type="text" required></div>
          <div><label class="label" for="su-phone">연락처</label><input class="field" id="su-phone" type="tel" placeholder="010-0000-0000"></div>
          <label class="auth-agree"><input type="checkbox" required> <a href="#">이용약관</a> 및 <a href="#">개인정보처리방침</a>에 동의합니다.</label>
          <button class="btn btn--primary btn--lg" type="submit">회원가입</button>
        </form>
      </div>
    </div>
  </div>`;

  const host = document.createElement("div");
  host.innerHTML = modalHTML;
  document.body.appendChild(host.firstElementChild);

  const backdrop = document.getElementById("authModal");
  const titleEl = document.getElementById("authTitle");
  let lastFocus = null;

  function switchTab(mode) {
    backdrop.querySelectorAll(".auth-tab").forEach((t) => {
      const on = t.dataset.tab === mode;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    backdrop.querySelectorAll(".auth-form").forEach((f) => f.classList.toggle("hidden", f.dataset.form !== mode));
    titleEl.textContent = mode === "signup" ? "회원가입" : "로그인";
  }
  function open(mode) {
    lastFocus = document.activeElement;
    switchTab(mode || "login");
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    const first = backdrop.querySelector(".auth-form:not(.hidden) input");
    if (first) first.focus();
  }
  function close() {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  backdrop.querySelectorAll(".auth-tab").forEach((t) => t.addEventListener("click", () => switchTab(t.dataset.tab)));
  backdrop.querySelector("[data-auth-close]").addEventListener("click", close);
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && backdrop.classList.contains("open")) close(); });
  backdrop.querySelectorAll("form").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    if (f.dataset.kind === "signup") {
      const pw = f.querySelector("#su-pw").value, pw2 = f.querySelector("#su-pw2").value;
      if (pw !== pw2) { alert("비밀번호가 일치하지 않습니다."); return; }
      alert("회원가입이 완료되었습니다. (데모)");
    } else {
      alert("로그인되었습니다. (데모)");
      location.href = "./mypage.html";
      return;
    }
    close();
  }));

  // 헤더 상단 로그인/회원가입 링크 바인딩 (.header-top a 순서: 로그인, 회원가입)
  const topLinks = document.querySelectorAll(".header-top a");
  if (topLinks[0] && topLinks[0].textContent.trim() === "로그인") topLinks[0].addEventListener("click", (e) => { e.preventDefault(); open("login"); });
  if (topLinks[1] && topLinks[1].textContent.trim() === "회원가입") topLinks[1].addEventListener("click", (e) => { e.preventDefault(); open("signup"); });
  // data-auth="login|signup" 속성으로도 열 수 있음
  document.querySelectorAll("[data-auth]").forEach((el) => el.addEventListener("click", (e) => { e.preventDefault(); open(el.getAttribute("data-auth")); }));

  window.Auth = { open, close };

  /* ============ 2) 수강안내 헤더/페이지 메뉴 ============ */
  const guidePages = [
    { key: "registration", id: "registration", label: "등록안내", href: "./apply-registration.html", title: "등록 안내", desc: "수강 신청 절차와 접수 방법을 확인하세요." },
    { key: "schedule", id: "schedule", label: "학사일정", href: "./apply.html", title: "학사일정", desc: "교육장소, 과정구분, 과목으로 강좌 일정을 찾고 신청할 수 있습니다." },
    { key: "benefits", id: "benefits", label: "수강혜택", href: "./apply-benefits.html", title: "수강혜택", desc: "수강생에게 제공되는 할인, 자료, 사후관리 혜택을 확인하세요." },
    { key: "refund", id: "refund", label: "수강료 환불", href: "./apply-refund.html", title: "수강료 환불", desc: "학습비 반환 기준과 환불 처리 방법을 안내합니다." },
    { key: "certificates", id: "certificates", label: "증명서 출력", href: "./apply-certificates.html", title: "증명서 출력", desc: "수료증명서, 성적증명서 등 온라인 증명서 발급 절차를 확인하세요." }
  ];
  const fileName = decodeURIComponent(location.pathname.split("/").pop() || "index.html");
  const currentGuide = guidePages.find((page) => page.href.replace("./", "") === fileName);
  const inApplyArea = currentGuide || /^apply/.test(fileName) || fileName === "course-apply-detail.html";

  function enhanceGuideHeader() {
    const gnb = document.querySelector(".gnb");
    if (!gnb || gnb.querySelector(".nav-dropdown--guide")) return;
    const applyLink = Array.from(gnb.querySelectorAll("a")).find((link) => {
      const text = link.textContent.trim();
      return text === "수강신청" || text === "수강안내" || link.getAttribute("href") === "./apply.html";
    });
    if (!applyLink) return;

    const wrapper = document.createElement("div");
    wrapper.className = "nav-dropdown nav-dropdown--guide";
    const parent = document.createElement("a");
    parent.className = `nav-parent${inApplyArea ? " active" : ""}`;
    parent.href = "./apply.html";
    parent.textContent = "수강안내";
    parent.setAttribute("aria-haspopup", "true");
    const menu = document.createElement("div");
    menu.className = "nav-dropdown-menu";
    menu.setAttribute("role", "menu");
    menu.innerHTML = guidePages.map((page) =>
      `<a class="${currentGuide?.key === page.key ? "active" : ""}" href="${page.href}" role="menuitem">${page.label}</a>`
    ).join("");
    wrapper.append(parent, menu);
    applyLink.replaceWith(wrapper);
  }

  function activateGuidePage() {
    if (!document.querySelector(".apply-guide-page")) return;
    const active = currentGuide || guidePages.find((page) => page.key === "schedule");

    document.title = `${active.title} | A. TESOL`;
    const title = document.querySelector(".page-title h1");
    const desc = document.querySelector(".page-title p");
    const breadcrumb = document.querySelector(".page-title .breadcrumb");
    if (title) title.textContent = active.title;
    if (desc) desc.textContent = active.desc;
    if (breadcrumb) breadcrumb.textContent = `Home / 수강안내 / ${active.label}`;

    document.querySelectorAll(".guide-anchor").forEach((section) => {
      section.hidden = section.id !== active.id;
    });
    document.querySelectorAll("main.apply-guide-page > section.section").forEach((section) => {
      const anchors = Array.from(section.querySelectorAll(".guide-anchor"));
      section.hidden = anchors.length > 0 && anchors.every((anchor) => anchor.hidden);
    });
  }

  enhanceGuideHeader();
  activateGuidePage();

  /* ============ 2) 회사 정보 푸터 ============ */
  const footerContainer = document.querySelector(".site-footer .container");
  if (footerContainer) {
    footerContainer.innerHTML = `
      <div class="footer-cols">
        <div class="f-brand">
          <h2>A. TESOL</h2>
          <p>국제 영어교사 양성과정</p>
          <div class="f-policy">
            <a href="#">이용약관</a>
            <a href="#">개인정보처리방침</a>
            <a href="./contact.html">1:1문의</a>
        <a href="./about.html">교육원소개</a>
          </div>
        </div>
        <div class="f-info">
          <p class="f-call">고객센터 02-6207-9090</p>
          <p>주식회사 타임스미디어  |  대표이사 김국진</p>
          <p>사업자번호 101-86-07479</p>
          <p>주소 서울 서초구 양재천로 19길 26, 6층(양재동)</p>
          <p>문의 hutechc01@gmail.com  |  운영시간 평일 10:00 ~ 18:00</p>
        </div>
      </div>
      <div class="copyright">© 2026 Times Media Inc. All rights reserved. — A. TESOL</div>`;
  }
})();
