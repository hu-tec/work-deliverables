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
      filterRoot.querySelectorAll("select").forEach((select) => {
        if (select.value === label) select.selectedIndex = 0;
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
          <span class="status ok drawer-member-status" data-detail-member-status hidden>상담중</span>
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

function normalizeFullDate(value) {
  const trimmed = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed) && trimmed !== "0000-00-00") return trimmed;
  if (/^\d{2}-\d{2}-\d{2}$/.test(trimmed)) return `20${trimmed}`;
  return "";
}

function formatYYDate(value) {
  const fullDate = normalizeFullDate(value);
  return fullDate ? fullDate.slice(2) : "";
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
  const attr = (value) => escapeHtml(value).replace(/'/g, '&#39;');
  const dateAttr = (value) => value === '0000-00-00' ? '' : attr(value);
  const datePickerField = (value, label) => {
    const fullDate = normalizeFullDate(value);
    const displayDate = formatYYDate(fullDate);
    return `
      <span class='yy-date-control' data-yy-date-control>
        <input class='field yy-date-display' type='text' inputmode='numeric' placeholder='YY-MM-DD' value='${attr(displayDate)}' aria-label='${escapeHtml(label)} 표시일'>
        <button class='yy-date-trigger' type='button' aria-label='${escapeHtml(label)} 달력 열기'><i class='fa-solid fa-calendar-days'></i></button>
        <input class='yy-date-native' type='date' value='${attr(fullDate)}' aria-label='${escapeHtml(label)} 달력'>
      </span>
    `;
  };
  const id = detailValue(details, ['회원 관리번호', '회원관리번호', '관리번호']);
  const name = detailValue(details, '이름');
  const email = detailValue(details, '이메일');
  const phone = detailValue(details, ['휴대폰', '연락처']);
  const address = detailValue(details, '주소', '서울 강남구');
  const country = detailValue(details, '국가', '대한민국');
  const memberType = detailValue(details, '회원유형', '일반회원');
  const subscription = detailValue(details, '구독상태', 'free');
  const joinedAt = detailValue(details, '가입일', '26-01-15');
  const channel = detailValue(details, '가입채널', '홈페이지');
  const matching = detailValue(details, '매칭상태', '대기');
  const payment = detailValue(details, '결제상태', '정상');
  const expertLevel = detailValue(details, '전문가 레벨', 'Lv.B');
  const rating = detailValue(details, '평점', '4.6');
  const title = `${name} 회원 작업 상세`;
  const field = ([label, value]) => `
    <label class='member-mini-field'>
      <span title='${attr(label)}'>${escapeHtml(label)}</span>
      <input class='field' value='${attr(value)}'>
    </label>
  `;
  const compactSection = (titleText, fields, modifier = '') => `
    <section class='member-profile-group ${modifier}'>
      <strong>${escapeHtml(titleText)}</strong>
      <div class='member-profile-fields'>${fields.map(field).join('')}</div>
    </section>
  `;
  const opsField = ([label, value]) => {
    const isDateTime = ['다음통화 예정일시', 'LT예정일시', '상담일'].includes(label);
    const inputValue = isDateTime ? value.replace(' ', 'T') : value;
    return `
      <label class='member-ops-field'>
        <span>${escapeHtml(label)}</span>
        <input class='field' type='${isDateTime ? 'datetime-local' : 'text'}' value='${attr(inputValue)}'>
      </label>
    `;
  };
  const paymentRows = [
    { item: '전형료', date: '0000-00-00', center: '강남', status: '미납', method: '방식', amount: '50,000', discount: '', month: '', card: '-', approval: '', deposit: '0000-00-00', accountStatus: '미정', fee: '1,500', net: '48,500', memo: '응시 상태 확인', note: '서류 확인 후 정산' },
    { item: '입학금', date: '0000-00-00', center: '강남', status: '미납', method: '방식', amount: '500,000', discount: '', month: '', card: '-', approval: '', deposit: '0000-00-00', accountStatus: '미정', fee: '0', net: '500,000', memo: '등록 확인 필요', note: '입금자명 대조' },
    { item: '수업료', date: '0000-00-00', center: '강남', status: '미납', method: '방식', amount: '1,980,000', discount: '장기 수강', month: '3', card: '-', approval: '', deposit: '0000-00-00', accountStatus: '미정', fee: '0', net: '1,980,000', memo: '수강정보와 연결', note: '분납 여부 확인' },
    { item: '교재비', date: '0000-00-00', center: '강남', status: '미납', method: '방식', amount: '62,500', discount: '', month: '', card: '-', approval: '', deposit: '0000-00-00', accountStatus: '미정', fee: '0', net: '62,500', memo: '교재 발송 전 확인', note: '증명서/교재비 분리' },
  ];
  const basicFields = [
    ['성명 / 영문', `${name} / ${name === '-' ? '-' : 'Sury Jo'}`],
    ['아이디', email.split('@')[0] || id],
    ['관리번호', id],
    ['이메일', email],
    ['휴대폰', phone],
    ['집전화', '02-777-9012'],
    ['거주지 / 국가', `${address} / ${country}`],
    ['회원유형', `${memberType} / ${subscription}`],
    ['가입일 / 채널', `${joinedAt} / ${channel}`],
    ['전문가 레벨', `${expertLevel} / 평점 ${rating}`],
  ];
  const schoolFields = [
    ['해외 국가', '미국'],
    ['해외 기간', '2년 6개월'],
    ['해외 목적', '어학연수'],
    ['고교', '서울외국어고등학교'],
    ['대학교', '한국대학교 영어영문학과'],
    ['대학원', '통번역대학원 석사'],
  ];
  const scoreFields = [
    ['TOEIC', '940'],
    ['TOEFL', '105'],
    ['TESOL', '수료'],
    ['기타', 'OPIc AL'],
  ];
  const careerFields = [
    ['이력 1', '전시 통번역 현장 지원'],
    ['이력 2', '기업문서 번역 PM 보조'],
    ['이력 3', '교육 수강 및 시험 응시 예정'],
  ];
  const opsFields = [
    ['첫상담', '강남 이수율(2012-10-30)'],
    ['최종상담', '연세대매니저(최혜원)(2026-04-09)'],
    ['부재횟수', '8/12'],
    ['최근부재', '강남 매니저(2024-01-10)'],
    ['교육장', '강남'],
    ['수정정보', '미등록 / 주중1'],
    ['다음통화 예정일시', '2026-04-15 14:00'],
    ['LT예정일시', '2026-04-17 11:00'],
    ['강사명', '강사선택'],
    ['상담자', '연세대매니저'],
    ['상담일', '2026-04-09 17:46'],
    ['결과', '다음혜통화'],
  ];

  return `
    <section class='member-master-detail' aria-label='회원 상세 작업영역'>

      <div class='member-master-grid'>
        <aside class='member-profile-panel' aria-label='A 회원 기본정보와 학력 이력'>
          <header class='member-profile-head'>
            <strong>A 회원 기본정보 마스터</strong>
            <span class='member-profile-actions'>
              <button class='btn' type='button' data-profile-edit>수정</button>
              <button class='btn primary' type='button' data-profile-save>저장</button>
            </span>
          </header>
          <div class='member-profile-fields member-profile-fields--base'>${basicFields.map(field).join('')}</div>
          <div class='member-radio-row'>
            <label><input type='radio' checked> 내국인</label>
            <label><input type='radio'> 외국인</label>
          </div>
          ${compactSection('학력·해외 체류', schoolFields)}
          ${compactSection('어학점수', scoreFields, 'member-profile-group--scores')}
          ${compactSection('이력사항', careerFields)}
          <div class='member-note-box'>
            <strong>[회원 사용 목적]</strong>
            <textarea class='field' rows='3'>AI번역과 통독문서 이용, 시험 응시 이력 및 상담 내용을 함께 관리합니다.</textarea>
          </div>
          <div class='member-check-grid'>
            <label><input type='checkbox' checked> 출제/번역</label>
            <label><input type='checkbox'> 수강등록</label>
            <label><input type='checkbox'> 시험접수</label>
            <label><input type='checkbox'> 전문가매칭</label>
          </div>
        </aside>

        <div class='member-work-panel'>
          <div class='member-dark-strip'>
            <strong>상담내용 [${escapeHtml(name)} : ${escapeHtml(id)}]</strong>
            <button class='btn primary' type='button'>저장</button>
            <button class='btn' type='button'>상담이력</button>
            <button class='btn' type='button'>전환</button>
            <span class='status fail'>FAIL</span>
          </div>
          <div class='member-status-line'>
            <span>완료 상담일시: 2024-01-02</span>
            <span>최근 상담일시: 2026-04-14</span>
            <strong>총 3회 내역 보관중</strong>
          </div>

          <div class='member-consult-toolbar' aria-label='B 상담 운영 빠른 입력'>
            <label class='member-inline-select member-inline-select--course'>수강정보<select><option>중기</option><option>단기</option><option>장기</option></select></label>
            <details class='member-counsel-state-card'>
              <summary>상담결과 <strong data-counsel-state-value>다음등록</strong></summary>
              <nav class='member-counsel-tabs member-counsel-tabs--top' aria-label='상담 상태'>
                <button type='button' data-counsel-state-option aria-pressed='false'>미상담</button>
                <button type='button' data-counsel-state-option aria-pressed='false'>완료</button>
                <button type='button' data-counsel-state-option aria-pressed='false'>LT예약</button>
                <button type='button' data-counsel-state-option class='active' aria-pressed='true'>다음등록</button>
                <button type='button' data-counsel-state-option aria-pressed='false'>실종</button>
                <button type='button' data-counsel-state-option aria-pressed='false'>부재</button>
                <button type='button' data-counsel-state-option aria-pressed='false'>기타</button>
              </nav>
            </details>
            <label class='member-inline-select'>상담종목<select><option>AI번역 상담</option><option>시험 접수 상담</option><option>전문가 매칭</option><option>수강 등록 상담</option></select></label>
            <label class='member-inline-select'>교육<select><option>강의 보일</option><option>온라인</option><option>오프라인</option></select></label>
            <label class='member-inline-select'>수정정보<select><option>중기</option><option>주중1</option><option>주말</option><option>미등록</option></select></label>
            <fieldset class='member-toolbar-interview'>
              <legend>LT 인터뷰 결과</legend>
              <div>
                <label><input type='radio' name='ltInterviewResult'> P</label>
                <label><input type='radio' name='ltInterviewResult'> F</label>
                <label><input type='radio' name='ltInterviewResult' checked> 미</label>
              </div>
            </fieldset>
          </div>

          <section class='member-ops-panel' aria-label='B 상담 일정과 담당 정보'>
            <header>B 상담 운영정보</header>
            <div class='member-ops-grid'>${opsFields.map(opsField).join('')}</div>
          </section>
          <div class='member-work-columns'>
            <section class='member-case-box member-note-composer'>
              <header>상담내용 정리</header>
              <textarea class='field' rows='5'>다음 상담 예정 내용을 여기에 메모합니다. 시험 응시 여부, 서비스 사용 목적, 결제 확인 상태를 함께 기록합니다.</textarea>
              <div class='member-next-grid'>
                <label class='member-next-field member-next-field--call'><span>다음통화 예정일시</span><input class='field' type='datetime-local' value='2026-04-15T14:00'></label>
                <label class='member-next-field member-next-field--lt'><span>LT예정일시</span><input class='field' type='datetime-local' value='2026-04-17T11:00'></label>
                <label class='member-next-field member-next-field--teacher'><span>강사명</span><select><option>강사선택</option><option>강남 전담강사</option><option>온라인 튜터</option></select></label>
              </div>

            </section>
            <section class='member-case-box member-history-box'>
              <header>상담이력 내역 피드 로그</header>
              <div class='member-log-list'>
                <article><time>260414 17:58</time><p>베타 4, 5급 과정상담 완료. 다음 상담 일정 확인 필요.</p></article>
                <article><time>240106 12:03</time><p>시험 안내 및 결제 상태 확인. 추가 서류 보완 요청.</p></article>
                <article><time>140310 12:04</time><p>다음혜통화 예정. 부재중 안내 문자 남김.</p></article>
              </div>
            </section>
          </div>

          <section class='member-payment-card' aria-label='C 회원 납부 상세정보와 회계 정산'>
            <header>
              <strong>C 회원 납부 상세정보 및 증명서 실시간 결제·규칙 정산 현황</strong>
              <span>센터 입력 영역과 회계 영역을 분리해 전형료부터 교재비까지 관리</span>
            </header>
            <div class='member-payment-split'>
              <section class='member-payment-zone member-payment-zone--center'>
                <h4>센터 입력 영역</h4>
                <table class='member-payment-table member-payment-table--center'>
                  <thead>
                    <tr><th>항목</th><th>납입일자</th><th>수납센터</th><th>상태</th><th>방식</th><th>금액</th><th>할인이유</th><th>개월</th><th>카드사</th><th>승인번호</th></tr>
                  </thead>
                  <tbody>
                    ${paymentRows.map((row) => `
                      <tr>
                        <td><strong>${escapeHtml(row.item)}</strong></td>
                        <td>${datePickerField(row.date, `${row.item} 납입일자`)}</td>
                        <td>${escapeHtml(row.center)}</td>
                        <td><select><option>${escapeHtml(row.status)}</option><option>완납</option><option>부분</option></select></td>
                        <td><select><option>${escapeHtml(row.method)}</option><option>카드</option><option>현금</option><option>계좌</option></select></td>
                        <td><input class='field is-money' value='${attr(row.amount)}'></td>
                        <td><input class='field' value='${attr(row.discount)}'></td>
                        <td><input class='field is-short' value='${attr(row.month)}'></td>
                        <td><select><option>${escapeHtml(row.card)}</option><option>신한</option><option>국민</option><option>현대</option></select></td>
                        <td><input class='field' value='${attr(row.approval)}'></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </section>
              <section class='member-payment-zone member-payment-zone--account'>
                <h4>회계 영역 (본부에서 정리하는 내용)</h4>
                <table class='member-payment-table member-payment-table--account'>
                  <thead>
                    <tr><th>항목</th><th>회사입금일</th><th>회계상태</th><th>수수료</th><th>실입금액</th><th>비고</th><th>회계특이사항</th></tr>
                  </thead>
                  <tbody>
                    ${paymentRows.map((row) => `
                      <tr>
                        <td><strong>${escapeHtml(row.item)}</strong></td>
                        <td>${datePickerField(row.deposit, `${row.item} 회사입금일`)}</td>
                        <td><select><option>${escapeHtml(row.accountStatus)}</option><option>확인</option><option>보류</option></select></td>
                        <td><input class='field is-money' value='${attr(row.fee)}'></td>
                        <td><input class='field is-money' value='${attr(row.net)}'></td>
                        <td><input class='field' value='${attr(row.memo)}'></td>
                        <td><input class='field' value='${attr(row.note)}'></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </section>
            </div>
          </section>


          <section class='member-settlement-box'>
            <div>
              <span>환급 진행 수수료 총액</span>
              <strong>3,000 KRW</strong>
            </div>
            <textarea class='field' rows='3'>수강권 연장기에 대한 수강확인서 1부 발급 상담 접수 완료. 회계 입금일과 실입금액 대조 필요.</textarea>
          </section>

          <section class='member-memo-box'>
            <header>운영 메모</header>
            <textarea class='field' rows='4' name='memberMemo'>회원 상세 처리 메모를 입력합니다. 상담, 결제, 시험, 정산 이슈를 한 곳에 기록합니다.</textarea>
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
  detailDrawer.querySelector("[data-detail-member-status]").hidden = !isMemberDetail;
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

document.addEventListener("click", (event) => {
  const yyControlTrigger = event.target.closest("[data-yy-date-control] .yy-date-display, [data-yy-date-control] .yy-date-trigger");
  if (yyControlTrigger) {
    const nativePicker = yyControlTrigger.closest("[data-yy-date-control]")?.querySelector(".yy-date-native");
    if (nativePicker && typeof nativePicker.showPicker === "function") {
      try {
        nativePicker.showPicker();
      } catch (error) {
        nativePicker.focus();
      }
    } else {
      nativePicker?.focus();
    }
  }

  const picker = event.target.closest(".member-master-detail input[type='date'], .member-master-detail input[type='datetime-local']");
  if (picker && !picker.classList.contains("yy-date-native") && typeof picker.showPicker === "function") {
    try {
      picker.showPicker();
    } catch (error) {
      // The browser's native calendar icon still provides the fallback picker.
    }
  }

  const option = event.target.closest("[data-counsel-state-option]");
  if (!option) return;

  const stateCard = option.closest(".member-counsel-state-card");
  stateCard.querySelectorAll("[data-counsel-state-option]").forEach((button) => {
    const selected = button === option;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  stateCard.querySelector("[data-counsel-state-value]").textContent = option.textContent.trim();
  stateCard.open = false;
});

document.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-profile-edit]");
  if (editButton) {
    const panel = editButton.closest(".member-profile-panel");
    panel?.querySelector("input.field, textarea.field")?.focus();
    return;
  }

  const saveButton = event.target.closest("[data-profile-save]");
  if (saveButton) {
    const originalText = saveButton.textContent;
    saveButton.textContent = "저장됨";
    window.setTimeout(() => {
      saveButton.textContent = originalText;
    }, 900);
  }
});
document.addEventListener("change", (event) => {
  const nativeDate = event.target.closest?.(".yy-date-native");
  if (nativeDate) {
    const display = nativeDate.closest("[data-yy-date-control]")?.querySelector(".yy-date-display");
    if (display) display.value = formatYYDate(nativeDate.value);
    return;
  }

  const displayDate = event.target.closest?.(".yy-date-display");
  if (displayDate) {
    const fullDate = normalizeFullDate(displayDate.value);
    const native = displayDate.closest("[data-yy-date-control]")?.querySelector(".yy-date-native");
    if (native) native.value = fullDate;
    displayDate.value = formatYYDate(fullDate) || displayDate.value.trim();
  }
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
