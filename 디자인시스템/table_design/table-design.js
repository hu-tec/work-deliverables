const majorTabs = document.querySelectorAll(".major-tab");
const subTabs = document.querySelectorAll(".sub-tab");
const sections = document.querySelectorAll(".table-section");
let lastDrawerTrigger = null;
const tableCard = document.querySelector(".table-card");
let tableWorkspace = document.querySelector("[data-table-workspace]");

if (tableCard && !tableWorkspace) {
  tableWorkspace = document.createElement("div");
  tableWorkspace.className = "table-workspace";
  tableWorkspace.dataset.tableWorkspace = "";
  tableCard.before(tableWorkspace);
  tableWorkspace.append(tableCard);
}

majorTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    majorTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
  });
});

subTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.target;
    subTabs.forEach((item) => item.classList.remove("active"));
    sections.forEach((section) => {
      section.classList.toggle("active", section.id === target);
    });
    tab.classList.add("active");
  });
});

function renderActiveFilters(filterRoot) {
  const output = filterRoot.querySelector("[data-active-filters], [data-filter-active]");
  const countTarget = filterRoot.querySelector("[data-filter-count]");
  if (!output) return;

  const pressed = [...filterRoot.querySelectorAll('.filter-chip[aria-pressed="true"]')]
    .map((chip) => chip.textContent.trim())
    .filter((label) => label !== "전체");
  const checked = [...filterRoot.querySelectorAll(".dense-check input:checked")]
    .map((input) => input.closest(".dense-check")?.textContent.trim())
    .filter((label) => label && label !== "전체");
  const selected = [...filterRoot.querySelectorAll("select")]
    .map((select) => select.value)
    .filter((value) => value && !["전체", "대분류", "중분류", "소분류"].includes(value));
  const labels = [...pressed, ...checked, ...selected];
  if (countTarget) countTarget.textContent = String(labels.length);

  if (!labels.length) {
    output.innerHTML = "";
    return;
  }

  output.innerHTML = labels
    .map((label) => `<span class="filter-tag">${label} <button type="button" data-filter-remove="${label}" aria-label="${label} 필터 제거">×</button></span>`)
    .join("") + '<button class="filter-clear" type="button" data-filter-clear>필터 전체 해제</button>';
}

document.querySelectorAll("[data-dense-filter], [data-filter-bar]").forEach((filterRoot) => {
  filterRoot.addEventListener("click", (event) => {
    const chip = event.target.closest(".filter-chip");
    const removeButton = event.target.closest("[data-filter-remove]");
    const clearButton = event.target.closest("[data-filter-clear]");

    if (chip) {
      const group = chip.closest("[data-filter-group], .filter-group");
      const isSingleChoice = group?.hasAttribute("data-single-choice") || chip.textContent.trim() === "전체";

      if (isSingleChoice && group) {
        group.querySelectorAll(".filter-chip").forEach((item) => {
          item.setAttribute("aria-pressed", String(item === chip));
        });
      } else {
        chip.setAttribute("aria-pressed", String(chip.getAttribute("aria-pressed") !== "true"));
        const allChip = [...(group?.querySelectorAll(".filter-chip") || [])].find((item) => item.textContent.trim() === "전체");
        if (allChip && chip !== allChip) allChip.setAttribute("aria-pressed", "false");
      }
      renderActiveFilters(filterRoot);
    }

    if (removeButton) {
      const label = removeButton.dataset.filterRemove;
      filterRoot.querySelectorAll(".filter-chip").forEach((item) => {
        if (item.textContent.trim() === label) item.setAttribute("aria-pressed", "false");
      });
      filterRoot.querySelectorAll(".dense-check").forEach((item) => {
        if (item.textContent.trim() === label) item.querySelector("input").checked = false;
      });
      renderActiveFilters(filterRoot);
    }

    if (clearButton) {
      filterRoot.querySelectorAll(".filter-chip").forEach((item) => {
        item.setAttribute("aria-pressed", String(item.textContent.trim() === "전체"));
      });
      filterRoot.querySelectorAll(".dense-check input").forEach((input) => {
        input.checked = false;
      });
      filterRoot.querySelectorAll("select").forEach((select) => {
        select.selectedIndex = 0;
      });
      renderActiveFilters(filterRoot);
    }
  });

  filterRoot.addEventListener("change", () => renderActiveFilters(filterRoot));
  filterRoot.addEventListener("submit", (event) => {
    event.preventDefault();
    renderActiveFilters(filterRoot);
  });
  filterRoot.addEventListener("reset", () => window.setTimeout(() => renderActiveFilters(filterRoot), 0));
  renderActiveFilters(filterRoot);
});

function createDrawer() {
  const drawer = document.createElement("aside");
  drawer.className = "table-detail-drawer";
  drawer.id = "table-detail-drawer";
  drawer.setAttribute("role", "dialog");
  drawer.setAttribute("aria-modal", "false");
  drawer.setAttribute("aria-labelledby", "table-detail-title");
  drawer.hidden = true;
  drawer.innerHTML = `
    <form class="table-detail-panel" data-table-detail-form>
      <header class="table-detail-head">
        <div>
          <p class="drawer-kicker" data-detail-kicker>Table Detail</p>
          <h2 id="table-detail-title" data-detail-title>상세 정보</h2>
          <p data-detail-summary>선택한 행의 상세 정보를 확인합니다.</p>
        </div>
        <div class="drawer-head-actions">
          <button class="btn" type="button" data-detail-wide aria-pressed="false">넓게보기</button>
          <button class="drawer-close" type="button" data-detail-close aria-label="상세 닫기">×</button>
        </div>
      </header>
      <div class="table-detail-body">
        <div class="drawer-section-stack" data-detail-sections></div>
        <section class="drawer-case-card drawer-case-card--wide" data-detail-memo-section>
          <header class="drawer-case-head">
            <strong>운영 메모</strong>
            <span>처리 상태 기록</span>
          </header>
          <label class="drawer-inline-field drawer-inline-field--stack">
            <span>메모</span>
            <textarea class="field" rows="4" name="memo" placeholder="선택 행에 대한 처리 메모를 입력합니다."></textarea>
          </label>
        </section>
      </div>
      <footer class="table-detail-actions">
        <button class="btn" type="button" data-detail-close>닫기</button>
        <button class="btn primary" type="submit">저장</button>
      </footer>
    </form>
  `;
  (tableWorkspace || document.body).append(drawer);
  return drawer;
}

const detailDrawer = document.querySelector(".table-detail-drawer") || createDrawer();
const detailForm = detailDrawer.querySelector("[data-table-detail-form]");
const detailWideButton = detailDrawer.querySelector("[data-detail-wide]");

function normalizeText(element) {
  return element?.innerText.replace(/\s+/g, " ").trim() || "-";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getCellParts(cell) {
  const main = cell.querySelector(".main");
  const sub = cell.querySelector(".sub");
  const parts = [main?.innerText, sub?.innerText]
    .map((part) => part?.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  if (parts.length) return parts;
  return normalizeText(cell).split(/\s*[\n/]\s*/).filter(Boolean);
}

function getHeaderLabels(table) {
  return [...table.querySelectorAll("thead th")].map((header, index) => {
    const label = normalizeText(header).replace(/\s*선택\s*/g, "").trim();
    return label || `항목 ${index + 1}`;
  });
}

function splitCompoundDetail(label, value, parts) {
  const normalizedLabel = label.replace(/\s+/g, " ");
  const normalizedParts = parts.length ? parts : [value];
  const first = normalizedParts[0] || value;
  const second = normalizedParts[1] || "";

  if (normalizedLabel.includes("이름") && normalizedLabel.includes("나이")) {
    const [age = "", gender = ""] = second.split("·").map((item) => item.trim());
    return [
      { label: "이름", value: first },
      { label: "나이", value: age },
      { label: "성별", value: gender },
    ].filter((item) => item.value);
  }

  if (normalizedLabel.includes("이메일") && normalizedLabel.includes("휴대폰")) {
    return [
      { label: "이메일", value: first },
      { label: "휴대폰", value: second },
    ].filter((item) => item.value);
  }

  if (normalizedLabel.includes("주소") && normalizedLabel.includes("국가")) {
    return [
      { label: "주소", value: first },
      { label: "국가", value: second },
    ].filter((item) => item.value);
  }

  if (normalizedLabel.includes("회원유형") && normalizedLabel.includes("구독")) {
    return [
      { label: "회원유형", value: first },
      { label: "구독상태", value: second },
    ].filter((item) => item.value);
  }

  if (normalizedLabel.includes("가입일") && normalizedLabel.includes("채널")) {
    return [
      { label: "가입일", value: first },
      { label: "가입채널", value: second },
    ].filter((item) => item.value);
  }

  if (normalizedLabel.includes("최근 로그인") && normalizedLabel.includes("체류시간")) {
    return [
      { label: "최근 로그인", value: first },
      { label: "체류시간", value: second },
    ].filter((item) => item.value);
  }

  if (normalizedLabel.includes("전문가") && normalizedLabel.includes("레벨")) {
    return [
      { label: "전문가 레벨", value: first },
      { label: "평점", value: second },
    ].filter((item) => item.value && item.value !== "-");
  }

  if (normalizedLabel.includes("매칭") && normalizedLabel.includes("상태")) {
    return [{ label: "매칭상태", value }];
  }

  if (normalizedLabel.includes("결제") && normalizedLabel.includes("상태")) {
    return [{ label: "결제상태", value }];
  }

  return [{ label, value }];
}

function getRowDetails(row) {
  const table = row.closest("table");
  const labels = getHeaderLabels(table);
  return [...row.children]
    .flatMap((cell, index) => {
      const label = labels[index] || `항목 ${index + 1}`;
      const value = normalizeText(cell);
      const parts = getCellParts(cell);
      return splitCompoundDetail(label, value, parts);
    })
    .filter((item) => item.value !== "-" && item.label !== "항목 1");
}

function groupDrawerDetails(details) {
  const groups = [
    {
      title: "기본 정보",
      labels: ["회원 관리번호", "회원관리번호", "관리번호", "이름", "나이", "성별", "등급"],
      items: [],
    },
    {
      title: "연락처",
      labels: ["이메일", "휴대폰", "연락처", "주소", "국가"],
      items: [],
    },
    {
      title: "이용 상태",
      labels: ["회원유형", "구독상태", "가입일", "가입채널", "최근 로그인", "체류시간", "전문가 레벨", "평점", "매칭상태", "결제상태"],
      items: [],
    },
    {
      title: "운영 정보",
      labels: [],
      items: [],
    },
  ];

  details.forEach((item) => {
    const group = groups.find((candidate) => candidate.labels.some((label) => item.label.includes(label))) || groups[groups.length - 1];
    group.items.push(item);
  });

  return groups.filter((group) => group.items.length);
}

function detailValue(details, labels, fallback = "-") {
  const labelList = Array.isArray(labels) ? labels : [labels];
  const item = details.find((detail) => labelList.some((label) => detail.label.includes(label)));
  return item?.value || fallback;
}

function renderDetailSection(group) {
  return `
    <section class="drawer-case-card drawer-case-card--wide">
      <header class="drawer-case-head">
        <strong>${escapeHtml(group.title)}</strong>
      </header>
      <div class="drawer-form-grid">
        ${group.items
          .map((item) => `
            <label class="drawer-inline-field">
              <span title="${escapeHtml(item.label)}">${escapeHtml(item.label)}</span>
              <input class="field" value="${escapeHtml(item.value)}" />
            </label>
          `)
          .join("")}
      </div>
    </section>
  `;
}

function renderMemberMasterDetail(details) {
  const id = detailValue(details, ["회원 관리번호", "회원관리번호", "관리번호"]);
  const name = detailValue(details, "이름");
  const age = detailValue(details, "나이");
  const gender = detailValue(details, "성별");
  const email = detailValue(details, "이메일");
  const phone = detailValue(details, ["휴대폰", "연락처"]);
  const address = detailValue(details, "주소", "서울");
  const country = detailValue(details, "국가", "대한민국");
  const memberType = detailValue(details, "회원유형", "일반회원");
  const subscription = detailValue(details, "구독상태", "free");
  const joinedAt = detailValue(details, "가입일", "26-01-15");
  const channel = detailValue(details, "가입채널", "홈페이지");
  const matching = detailValue(details, "매칭상태", "대기");
  const payment = detailValue(details, "결제상태", "정상");
  const expertLevel = detailValue(details, "전문가 레벨", "Lv.B");
  const rating = detailValue(details, "평점", "4.6");
  const title = `${name} 회원 작업 상세`;
  const profileFields = [
    ["성명 / 영문", `${name} / ${name === "-" ? "-" : "Sury Jo"}`],
    ["아이디", email.split("@")[0] || id],
    ["관리번호", id],
    ["이메일", email],
    ["휴대폰", phone],
    ["거주지 / 국가", `${address} / ${country}`],
    ["회원유형", `${memberType} / ${subscription}`],
    ["가입일 / 채널", `${joinedAt} / ${channel}`],
    ["전문가 레벨", `${expertLevel} / 평점 ${rating}`],
  ];

  return `
    <section class="member-master-detail" aria-label="회원 상세 작업영역">
      <header class="member-master-titlebar">
        <div>
          <strong>${escapeHtml(title)}</strong>
          <span>상담, 시험, 결제, 정산을 한 화면에서 처리</span>
        </div>
        <div class="member-master-status">
          <span class="status ok">상담중</span>
          <span class="status">${escapeHtml(matching)}</span>
          <span class="status">${escapeHtml(payment)}</span>
        </div>
      </header>
      <div class="member-master-grid">
        <aside class="member-profile-panel">
          <header>회원기본정보 마스터</header>
          <div class="member-profile-fields">
            ${profileFields
              .map(([label, value]) => `
                <label class="member-mini-field">
                  <span>${escapeHtml(label)}</span>
                  <input class="field" value="${escapeHtml(value)}">
                </label>
              `)
              .join("")}
          </div>
          <div class="member-radio-row">
            <label><input type="radio" checked> 내국인</label>
            <label><input type="radio"> 외국인</label>
          </div>
          <div class="member-note-box">
            <strong>[회원 사용 목적]</strong>
            <textarea class="field" rows="4">AI번역과 통독문서 이용, 시험 응시 이력 및 상담 내용을 함께 관리합니다.</textarea>
          </div>
          <div class="member-check-grid">
            <label><input type="checkbox" checked> 출제/번역</label>
            <label><input type="checkbox"> 수강등록</label>
            <label><input type="checkbox"> 시험접수</label>
            <label><input type="checkbox"> 전문가매칭</label>
          </div>
        </aside>

        <div class="member-work-panel">
          <div class="member-dark-strip">
            <strong>상담내용 [${escapeHtml(name)} : ${escapeHtml(id)}]</strong>
            <button class="btn primary" type="button">저장</button>
            <button class="btn" type="button">상담이력</button>
            <button class="btn" type="button">전환</button>
            <span class="status fail">FAIL</span>
          </div>
          <div class="member-status-line">
            <span>완료 상담일시: 2024-01-02</span>
            <span>최근 상담일시: 2026-04-14</span>
            <strong>총 3회 내역 보관중</strong>
          </div>
          <div class="member-control-row">
            <label>상담종목<select><option>AI번역 상담</option><option>시험 접수 상담</option><option>전문가 매칭</option></select></label>
            <label>교육<select><option>강의 보일</option><option>온라인</option><option>오프라인</option></select></label>
            <label>수강정보<select><option>중기</option><option>단기</option><option>장기</option></select></label>
          </div>

          <div class="member-work-columns">
            <section class="member-case-box">
              <header>상담결과 선택</header>
              <div class="member-counsel-grid">
                <nav class="member-counsel-tabs" aria-label="상담 상태">
                  <button type="button">미상담</button>
                  <button type="button">완료</button>
                  <button type="button">LT예약</button>
                  <button type="button" class="active">다음등록</button>
                  <button type="button">실종</button>
                  <button type="button">부재</button>
                  <button type="button">기타</button>
                </nav>
                <textarea class="field" rows="8">다음 상담 예정 내용을 여기에 메모합니다. 시험 응시 여부, 서비스 사용 목적, 결제 확인 상태를 함께 기록합니다.</textarea>
              </div>
            </section>
            <section class="member-case-box">
              <header>상담이력 내역 피드 로그</header>
              <div class="member-log-list">
                <article><time>2026-04-14 17:58</time><p>베타 4, 5급 과정상담 완료. 다음 상담 일정 확인 필요.</p></article>
                <article><time>2024-01-06 12:03</time><p>시험 안내 및 결제 상태 확인. 추가 서류 보완 요청.</p></article>
              </div>
              <div class="member-lt-row">
                <span>LT 인터뷰 결과</span>
                <label><input type="radio"> P</label>
                <label><input type="radio"> F</label>
                <label><input type="radio" checked> 미</label>
              </div>
            </section>
          </div>

          <section class="member-case-box">
            <header>회원 납부 상세정보 및 증명서 실시간 결제·규칙 정산 현황</header>
            <div class="member-data-table-wrap">
              <table class="member-data-table">
                <thead>
                  <tr><th>구분</th><th>난이도</th><th>수험일</th><th>상태</th><th>결제금액</th><th>응시일</th><th>평가상태</th><th>수수료</th><th>처리메모</th></tr>
                </thead>
                <tbody>
                  <tr><td>정규</td><td>일반</td><td>26-05-18</td><td>강남</td><td>50,000</td><td>26-05-19</td><td>완료</td><td>1,500</td><td><input class="field" value="응시 상태 확인"></td></tr>
                  <tr><td>환불</td><td>중급</td><td>00-00-00</td><td>대기</td><td>50,000</td><td>00-00-00</td><td>미결제</td><td>0</td><td><input class="field" value="추가 상담 필요"></td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="member-settlement-box">
            <div>
              <span>환급 진행 수수료 총액</span>
              <strong>3,000 KRW</strong>
            </div>
            <textarea class="field" rows="3">수강권 연장기에 대한 수강확인서 1부 발급 상담 접수 완료. 결제 대기중.</textarea>
          </section>

          <section class="member-memo-box">
            <header>운영 메모</header>
            <textarea class="field" rows="4" name="memberMemo">회원 상세 처리 메모를 입력합니다. 상담, 결제, 시험, 정산 이슈를 한 곳에 기록합니다.</textarea>
          </section>
        </div>
      </div>
    </section>
  `;
}

function shouldRenderMemberMaster(row, details) {
  const sectionId = row.closest(".table-section")?.id || "";
  return sectionId.includes("member") || details.some((item) => item.label === "이름") && details.some((item) => item.label === "이메일");
}

function setOpenRow(row) {
  document.querySelectorAll("tbody tr.is-open").forEach((item) => {
    item.classList.toggle("is-open", item === row);
  });
}

function fillDetailDrawer(row) {
  const details = getRowDetails(row);
  const sectionTitle = normalizeText(row.closest(".table-section")?.querySelector(".table-title"));
  const nameItem = details.find((item) => item.label === "이름");
  const idItem = details.find((item) => item.label.includes("관리번호")) || details[0];
  const primary = nameItem ? `${nameItem.value} 회원 상세` : `${idItem?.value || "상세 정보"} 상세`;
  const secondary = [idItem?.value, sectionTitle].filter(Boolean).join(" · ") || "선택한 행";
  const sections = detailDrawer.querySelector("[data-detail-sections]");

  detailDrawer.querySelector("[data-detail-kicker]").textContent = sectionTitle || "Table Detail";
  detailDrawer.querySelector("[data-detail-title]").textContent = primary;
  detailDrawer.querySelector("[data-detail-summary]").textContent = secondary;
  const isMemberDetail = shouldRenderMemberMaster(row, details);
  detailDrawer.classList.toggle("is-member-detail", isMemberDetail);
  sections.innerHTML = isMemberDetail
    ? renderMemberMasterDetail(details)
    : groupDrawerDetails(details).map(renderDetailSection).join("");
}

function openDetailDrawer(row, trigger) {
  lastDrawerTrigger = trigger;
  fillDetailDrawer(row);
  detailDrawer.hidden = false;
  tableWorkspace?.classList.add("is-drawer-open");
  setOpenRow(row);
  detailDrawer.querySelector("[data-detail-close]")?.focus();
}

function closeDetailDrawer() {
  detailDrawer.hidden = true;
  tableWorkspace?.classList.remove("is-drawer-open");
  tableWorkspace?.classList.remove("is-drawer-wide");
  if (detailWideButton) {
    detailWideButton.setAttribute("aria-pressed", "false");
    detailWideButton.textContent = "넓게보기";
  }
  document.querySelectorAll("tbody tr.is-open").forEach((row) => row.classList.remove("is-open"));
  lastDrawerTrigger?.focus();
  lastDrawerTrigger = null;
}

document.querySelectorAll(".table-card tbody tr").forEach((row) => {
  row.tabIndex = 0;
  row.setAttribute("role", "button");
  row.setAttribute("aria-controls", "table-detail-drawer");
  row.setAttribute("aria-label", `${normalizeText(row.children[1] || row.children[0])} 상세 열기`);
});

document.addEventListener("click", (event) => {
  const row = event.target.closest(".table-card tbody tr");
  if (!row || event.target.closest("button, input, select, textarea, a")) return;
  openDetailDrawer(row, row);
});

document.addEventListener("keydown", (event) => {
  const row = event.target.closest?.(".table-card tbody tr");
  if (row && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openDetailDrawer(row, row);
  }

  if (event.key === "Escape" && !detailDrawer.hidden) {
    closeDetailDrawer();
  }
});

detailDrawer.querySelectorAll("[data-detail-close]").forEach((button) => {
  button.addEventListener("click", closeDetailDrawer);
});

detailWideButton?.addEventListener("click", () => {
  const expanded = !tableWorkspace?.classList.contains("is-drawer-wide");
  tableWorkspace?.classList.toggle("is-drawer-wide", expanded);
  detailWideButton.setAttribute("aria-pressed", String(expanded));
  detailWideButton.textContent = expanded ? "기본보기" : "넓게보기";
});

detailForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  closeDetailDrawer();
});
