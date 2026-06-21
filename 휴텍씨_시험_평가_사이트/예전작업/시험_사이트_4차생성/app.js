const views = {
  public: "공개 홈페이지",
  dashboard: "관리자 대시보드",
  auth: "인증 및 계정",
  examinee: "수험생 홈",
  author: "출제자 업무",
  grader: "채점자 업무",
  adminOps: "관리자 운영 메뉴",
  bulk: "회원관리",
  memberDetail: "회원관리 상세 전체",
  mypage: "마이페이지 1920 참고",
  certificateAdmin: "관리자 자격증관리 상세",
  categoryAdmin: "관리자 카테고리 / 코드 관리",
  exam: "시험 운영 플로우",
  expert: "전문가 프로필 관리",
  workspace: "창작작업실",
  translation: "메타-T 번역",
  forms: "양식관리 / 템플릿",
  dataObjects: "데이터 객체 / 통합DB 항목",
  components: "공통 컴포넌트 적용 현황",
  uploadClassification: "파일 업로드 / 분류 검토",
  routePolicy: "라우트 / 정책 / 2025 관리자 개편",
  completionAudit: "완료 체크리스트 / 반복 검증",
  checkout: "장바구니 / 결제",
};

const roleMenus = {
  examinee: ["시험 접수", "접수 변경/취소", "결제", "시험 응시", "결과 확인", "자격증 신청", "마이페이지", "1:1 문의", "창작작업실/구매"],
  author: ["출제자 홈", "출제 업무 목록", "번역형 문제 작성", "프롬프트형 문제 작성", "단답형 문제 작성", "미리보기", "임시저장", "제출", "출제 내역", "반려 문항 재제출"],
  grader: ["채점자 홈", "채점 대상 시험", "개별 답안 채점", "번역형 채점", "프롬프트형 채점", "단답형 채점", "평가서/채점 의견", "임시저장", "채점완료", "채점 내역"],
  admin: ["대시보드", "회원관리", "회원 상세", "그룹관리", "관리자 관리", "전문가 승인/프로필", "시험/일정", "문제/출제 검수", "채점 배정", "결제/정산/환불", "자격증", "코드/카테고리", "양식/템플릿", "문의", "통계", "DB 대량관리", "파일 업로드", "데이터 객체", "공통 컴포넌트", "라우트/정책", "완료 체크리스트"],
};

const roleMenuViews = {
  examinee: "examinee",
  author: "author",
  grader: "grader",
  admin: "adminOps",
};

const roleMenuRoutes = {
  마이페이지: "mypage",
  "자격증 신청": "certificateAdmin",
  "회원 상세": "memberDetail",
  자격증: "certificateAdmin",
  "코드/카테고리": "categoryAdmin",
  "시험 접수": "examinee",
  결제: "checkout",
  "창작작업실/구매": "workspace",
  "전문가 승인/프로필": "expert",
  회원관리: "bulk",
  "DB 대량관리": "bulk",
  "파일 업로드": "uploadClassification",
  "양식/템플릿": "forms",
  "데이터 객체": "dataObjects",
  "공통 컴포넌트": "components",
  "라우트/정책": "routePolicy",
  "완료 체크리스트": "completionAudit",
  "결제/정산/환불": "checkout",
};

const filters = [
  ["회원유형", ["전체", "일반회원", "정식회원", "기업회원", "전문가", "회원탈퇴"]],
  ["성별", ["전체", "M", "F"]],
  ["구독상태", ["전체", "프리미엄", "스탠다드", "베이직", "free"]],
  ["서비스유형", ["전체", "AI번역", "매칭", "설문", "프롬프트", "문서편집", "영상편집", "음악편집"]],
  ["변환방식", ["전체", "STT", "TTS", "TTT", "STS"]],
  ["AI프로그램", ["전체", "GPT-4o", "Claude 3.5", "Gemini Pro", "Llama 3", "DeepL"]],
  ["편집에디터", ["전체", "문서에디터", "영상에디터", "음악에디터"]],
  ["매칭상태", ["전체", "매칭대기", "매칭완료", "진행중", "완료", "취소"]],
  ["전문가레벨", ["전체", "A", "B", "C", "D", "E"]],
  ["시험종목", ["전체", "AI번역", "프롬프트", "윤리시험", "자격시험"]],
  ["결제상태", ["전체", "결제완료", "미결제", "환불", "구독중"]],
  ["가입채널", ["전체", "네이버", "카카오", "구글", "애플", "이메일"]],
  ["기기", ["전체", "PC", "Mobile", "Tablet"]],
  ["카테고리", ["전체", "교육", "비즈니스", "시험", "온라인", "오프라인", "초급", "중급", "고급"]],
  ["기간설정", ["가입일순", "결제일순", "활동일순", "시험일순", "오늘", "1주", "1개월", "3개월", "6개월", "1년"]],
  ["검색어", ["전체", "이름", "이메일", "관리번호", "연락처", "그룹명"]],
];

const members = [
  ["1", "UI24980029", "시험", "정식회원", "베이직", "오승우(F)", "26세", "user29@kakao.com", "010-6155-7303", "광주 해운대구", "현대", "24.02.25 카카오", "Mobile", "24.01.14 수 / 104m 24s", "-", "문자 / 동의", "프롬프트", "TTS", "한→중", "완료", "-", "-", "환불", "시험응시료", "-", "0", "-"],
  ["2", "UI24970020", "통독", "기업회원", "프리미엄", "조하린(F)", "56세", "user20@naver.com", "010-7538-2606", "인천 남동구", "현대 224-69-28276", "24.01.20 카카오", "Mobile", "24.06.10 일 / 76m 48s", "-", "문자/메일 / 미동의", "영상편집", "TTS", "한→일", "취소", "-", "-", "결제완료", "구독", "150,000원 -15%", "0", "-"],
  ["3", "UI24970015", "교육", "일반회원", "", "홍길동(M)", "46세", "user15@kakao.com", "010-7035-4601", "부산 수성구", "-", "24.05.20 네이버", "Mobile", "24.12.19 금 / 6m 23s", "-", "문자/메일 / 미동의", "매칭", "STT", "영→한", "진행중", "-", "-", "구독중", "시험응시료", "680,000원", "1", "기타"],
  ["4", "UI24960037", "통독", "전문가", "베이직", "한지우(F)", "34세", "user37@naver.com", "010-7356-9406", "인천 강남구", "-", "24.12.11 애플", "Mobile", "24.10.13 토 / 43m 30s", "Lv.D 대기 3.6", "메일 / 미동의", "영상편집", "TTT", "한→영", "매칭완료", "윤리시험", "교육2급", "미결제", "포인트충전", "-", "12", "시험문의"],
  ["5", "UI24900001", "통독", "일반회원", "프리미엄", "홍길동(F)", "28세", "user1@naver.com", "010-4763-8609", "인천 용산구", "-", "24.06.10 구글", "Mobile", "24.11.20 토 / 72m 51s", "-", "문자/메일 / 미동의", "AI번역", "STT", "다국어", "진행중", "자격시험", "전문2급", "구독중", "포인트충전", "900,000원", "12", "서비스문의"],
  ["6", "UI24890038", "통독", "전문가", "프리미엄", "서동현(M)", "42세", "user38@naver.com", "010-4486-6478", "대전 서구", "-", "24.08.28 구글", "Mobile", "24.01.12 수 / 48m 23s", "Lv.A 대기 4.7", "메일 / 미동의", "매칭", "STS", "한→중", "매칭완료", "-", "-", "구독중", "포인트충전", "770,000원", "0", "-"],
  ["7", "UI24870021", "통독", "일반회원", "", "이수진(M)", "41세", "user21@daum.net", "010-8465-9685", "경기 강남구", "-", "24.02.09 네이버", "PC", "24.01.26 수 / 10m 36s", "-", "문자 / 미동의", "문서편집", "STT", "한→일", "취소", "-", "-", "결제완료", "포인트충전", "960,000원", "8", "오류신고"],
  ["8", "UI24850034", "전시", "일반회원", "스탠다드", "정서연(M)", "21세", "user34@gmail.com", "010-1310-2991", "부산 성남시", "카카오", "24.04.15 구글", "Tablet", "24.07.16 금 / 6m 11s", "-", "문자/메일 / 동의", "매칭", "STT", "영→한", "매칭대기", "윤리시험", "교육1급", "구독중", "포인트충전", "40,000원 -5%", "0", "-"],
  ["9", "UI24840042", "교육", "회원탈퇴", "", "한지우(F)", "56세", "user42@kakao.com", "010-1031-8899", "부산 남동구", "-", "24.11.15 구글", "Mobile", "24.07.08 수 / 95m 8s", "-", "문자 / 미동의", "AI번역", "STS", "한→영", "취소", "윤리시험", "전문2급", "-", "-", "-", "5", "시험문의"],
  ["10", "UI24840028", "교육", "일반회원", "스탠다드", "임수아(F)", "57세", "user28@naver.com", "010-2245-2996", "인천 강남구", "CJ", "24.02.05 이메일", "Tablet", "24.07.24 일 / 32m 55s", "-", "메일 / 동의", "영상편집", "TTT", "다국어", "완료", "-", "-", "미결제", "포인트충전", "-", "13", "시험문의"],
  ["11", "UI24840017", "교육", "회원탈퇴", "", "박민수(F)", "57세", "user17@daum.net", "010-8617-4957", "서울 강남구", "-", "24.03.19 이메일", "Mobile", "24.06.04 일 / 98m 1s", "-", "문자/메일 / 미동의", "영상편집", "STS", "한→영", "매칭완료", "-", "-", "-", "-", "-", "15", "기타"],
  ["12", "UI24820026", "시험", "기업회원", "베이직", "홍길동(M)", "25세", "user26@naver.com", "010-5853-8107", "인천 수성구", "삼성 757-37-79491", "24.09.07 이메일", "Mobile", "24.01.17 수 / 96m 24s", "-", "문자/메일 / 동의", "프롬프트", "STS", "한→중", "진행중", "자격시험", "전문1급", "구독중", "구독", "110,000원", "0", "-"],
  ["13", "UI24810041", "통독", "정식회원", "", "임수아(M)", "25세", "user41@daum.net", "010-4006-3524", "인천 마포구", "-", "24.08.22 카카오", "Tablet", "24.02.04 금 / 88m 38s", "-", "문자/메일 / 동의", "매칭", "TTS", "다국어", "진행중", "윤리시험", "교육1급", "구독중", "포인트충전", "540,000원", "2", "서비스문의"],
  ["14", "UI24740035", "시험", "전문가", "", "서동현(M)", "23세", "user35@naver.com", "010-1527-3630", "대전 해운대구", "-", "24.11.12 이메일", "PC", "24.05.27 화 / 92m 14s", "Lv.C 반려 4.7", "문자 / 미동의", "설문", "TTS", "한→영", "취소", "-", "-", "구독중", "시험응시료", "230,000원 -10%", "0", "-"],
  ["15", "UI24740027", "시험", "기업회원", "프리미엄", "조하린(M)", "35세", "user27@naver.com", "010-2025-5668", "서울 해운대구", "LG 948-18-67405", "24.07.24 네이버", "PC", "24.04.04 월 / 50m 20s", "-", "- / 동의", "음악편집", "STT", "한→중", "진행중", "-", "-", "환불", "시험응시료", "-", "6", "시험문의"],
];

const workTypes = ["Youtube", "문서", "리서치&분석", "프로그래밍", "이미지,디자인", "음악", "음성", "기타"];

const dialogContent = {
  examinee: ["시험 접수 목록", "신청 팝업", "접수 변경/취소", "결제", "시험 시작 전 안내", "응시/자동저장", "제출 확인", "결과/자격증 신청"],
  author: ["번역형 문제", "프롬프트형 문제", "단답형 문제", "평가요소", "답변 예시", "미리보기", "반려 문항 재제출"],
  grader: ["배정 답안", "평가 기준", "점수 입력", "코멘트", "평가서 팝업", "임시저장", "채점완료"],
  admin: ["회원 상세", "전문가 승인", "시험 등록", "채점 배정", "결제/정산/환불", "자격증 발급", "양식/템플릿", "DB 대량관리"],
};

let currentSite = "전체";
let currentSearch = "";

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function switchView(name) {
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  document.querySelector(`#view-${name}`)?.classList.add("active");
  document.querySelectorAll("[data-view]").forEach((btn) => btn.classList.toggle("active", btn.dataset.view === name));
  document.querySelector("#currentCrumb").textContent = views[name] || name;
}

function renderRoleMenu() {
  const role = document.querySelector("#roleSelect").value;
  const titleMap = {
    examinee: "수험생 메뉴",
    author: "출제자 메뉴",
    grader: "채점자 메뉴",
    admin: "관리자 메뉴",
  };
  document.querySelector("#roleMenuTitle").textContent = titleMap[role];
  document.querySelector("#roleMenuChips").innerHTML = roleMenus[role].map((item) => (
    `<button class="chip-button" data-role-view="${roleMenuRoutes[item] || roleMenuViews[role]}" aria-pressed="false">${item}</button>`
  )).join("");
}

function renderFilters() {
  const grid = document.querySelector("#filterGrid");
  grid.innerHTML = filters.map(([title, values]) => `
    <div class="filter-group">
      <span>${title}</span>
      <div class="check-list">
        ${values.map((value, index) => `
          <label>
            <input type="checkbox" ${index === 0 ? "checked" : ""} data-filter="${title}" value="${value}">
            ${value}
          </label>
        `).join("")}
      </div>
    </div>
  `).join("");

  grid.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    const group = [...grid.querySelectorAll(`input[data-filter="${input.dataset.filter}"]`)];
    if (input.value === "전체" || ["가입일순", "전체"].includes(input.value)) {
      group.forEach((item) => {
        if (item !== input && input.checked) item.checked = false;
      });
    } else {
      const all = group.find((item) => item.value === "전체");
      if (all) all.checked = false;
    }
    updateActiveFilterCount();
  });
}

function updateActiveFilterCount() {
  const checked = [...document.querySelectorAll("#filterGrid input:checked")]
    .filter((item) => !["전체", "가입일순"].includes(item.value));
  document.querySelector("#activeFilterCount").textContent = checked.length;
}

function statusClass(value) {
  if (["환불", "취소", "반려", "미결제"].some((word) => value.includes(word))) return "red";
  if (["구독중", "완료", "결제완료", "매칭완료"].some((word) => value.includes(word))) return "green";
  if (["진행중", "전문가", "Lv."].some((word) => value.includes(word))) return "purple";
  return "blue";
}

function renderMembers() {
  const tbody = document.querySelector("#memberRows");
  const query = currentSearch.trim().toLowerCase();
  const rows = members.filter((row) => {
    const siteMatch = currentSite === "전체" || row[2] === currentSite;
    const queryMatch = !query || row.join(" ").toLowerCase().includes(query);
    return siteMatch && queryMatch;
  });

  tbody.innerHTML = rows.map((row) => `
    <tr>
      <td>${row[0]}</td>
      <td><span class="linkish">${row[1]}</span></td>
      <td>${row[2]}</td>
      <td><div>${row[3]}</div><div class="status ${statusClass(row[4] || row[3])}">${row[4] || "-"}</div></td>
      <td><div>${row[5]}</div><div>${row[6]}</div></td>
      <td><div>${row[7]}</div><div>${row[8]}</div></td>
      <td>${row[9]}</td>
      <td>${row[10]}</td>
      <td>${row[11]}</td>
      <td>${row[12]}</td>
      <td>${row[13]}</td>
      <td><span class="state-pill ${statusClass(row[14])}">${row[14]}</span></td>
      <td>${row[15]}</td>
      <td>${row[16]}</td>
      <td><span class="chip fixed">${row[17]}</span></td>
      <td><span class="chip fixed">${row[18]}</span></td>
      <td><span class="state-pill ${statusClass(row[19])}">${row[19]}</span></td>
      <td>${row[20]}</td>
      <td>${row[21]}</td>
      <td><span class="state-pill ${statusClass(row[22])}">${row[22]}</span></td>
      <td>${row[23]}</td>
      <td>${row[24]}</td>
      <td><div>${row[25]}</div><div>${row[26]}</div></td>
    </tr>
  `).join("");
  document.querySelector("#rowCount").textContent = rows.length;
}

function renderWorkTypes() {
  const chips = document.querySelector("#workTypeChips");
  chips.innerHTML = workTypes.map((type, index) => `<button class="${index === 1 ? "active" : ""}">${type}</button>`).join("");
  chips.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    chips.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
}

function openDetail(type) {
  const titleMap = { examinee: "수험생 플로우", author: "출제자 플로우", grader: "채점자 플로우", admin: "관리자 플로우" };
  document.querySelector("#dialogTitle").textContent = titleMap[type] || "상세";
  document.querySelector("#dialogBody").innerHTML = `<ul class="tight-list">${dialogContent[type].map((item) => `<li>${item}</li>`).join("")}</ul>`;
  document.querySelector("#detailDialog").showModal();
}

function openRoleFlow() {
  const role = document.querySelector("#roleSelect").value;
  document.querySelector("#dialogTitle").textContent = "역할별 메뉴 점검";
  document.querySelector("#dialogBody").innerHTML = `
    <p>현재 역할의 메뉴만 노출됩니다.</p>
    <ul class="tight-list">${roleMenus[role].map((item) => `<li>${item}</li>`).join("")}</ul>
  `;
  document.querySelector("#detailDialog").showModal();
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  document.querySelector("#siteChips").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-site]");
    if (!button) return;
    currentSite = button.dataset.site;
    document.querySelectorAll("#siteChips button").forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    renderMembers();
  });

  document.querySelector("#globalSearch").addEventListener("input", (event) => {
    currentSearch = event.target.value;
    renderMembers();
  });

  document.querySelector("#roleSelect").addEventListener("change", () => {
    renderRoleMenu();
    switchView(roleMenuViews[document.querySelector("#roleSelect").value]);
  });

  document.querySelector("#roleMenuChips").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-role-view]");
    if (!button) return;
    document.querySelectorAll("#roleMenuChips button").forEach((item) => item.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
    switchView(button.dataset.roleView);
  });

  document.querySelector("#resetFilters").addEventListener("click", () => {
    document.querySelectorAll("#filterGrid input").forEach((input) => {
      input.checked = ["전체", "가입일순"].includes(input.value);
    });
    currentSearch = "";
    document.querySelector("#globalSearch").value = "";
    updateActiveFilterCount();
    renderMembers();
    showToast("검색 조건을 초기화했습니다.");
  });

  document.querySelector("#applyFilters").addEventListener("click", () => {
    showToast("검색 조건을 적용했습니다.");
    renderMembers();
  });

  document.querySelector("#toggleFilters").addEventListener("click", () => {
    const grid = document.querySelector("#filterGrid");
    grid.hidden = !grid.hidden;
  });

  document.querySelector("#uploadBtn").addEventListener("click", () => {
    const state = document.querySelector("#uploadState");
    state.hidden = !state.hidden;
    showToast("파일 업로드 처리 결과를 표시했습니다.");
  });

  ["saveBulkBtn", "colorBtn", "exportSelectedBtn", "mailBtn", "smsBtn", "excelBtn", "startExamBtn", "applyWorkBtn", "tempSaveBtn", "saveTranslationBtn", "newFormBtn", "payBtn", "openToastBtn", "emptyStateBtn", "errorStateBtn", "permissionBtn", "auditBtn", "authSaveBtn", "submitQuestionBtn", "completeGradeBtn", "approveExpertBtn", "syncDataBtn", "dataAuditBtn", "componentCheckBtn", "uploadReviewBtn", "selectAllCartBtn", "deleteCartBtn", "routeAuditBtn", "admin2025Btn", "saveMemberDetailBtn", "memberAuditBtn", "memberHistoryBtn", "saveMypageBtn", "saveCertificateBtn", "certificateFileBtn", "saveCategoryBtn", "addCategoryBtn", "runChecklistBtn", "syntaxCheckBtn", "viewCheckBtn", "chipCheckBtn"].forEach((id) => {
    document.querySelector(`#${id}`)?.addEventListener("click", () => {
      const messages = {
        saveBulkBtn: "회원관리 변경사항을 저장했습니다.",
        colorBtn: "선택/비선택 색상표를 생성했습니다.",
        exportSelectedBtn: "선택한 회원 정보를 내보내기 대기 상태로 만들었습니다.",
        mailBtn: "선택 회원에게 이메일 발송 대기 상태를 만들었습니다.",
        smsBtn: "선택 회원에게 SMS 발송 대기 상태를 만들었습니다.",
        excelBtn: "엑셀 다운로드 파일을 생성했습니다.",
        startExamBtn: "시험 시작 전 안내와 전체화면 상태를 준비했습니다.",
        applyWorkBtn: "작업 요청을 적용하고 편집 화면으로 연결했습니다.",
        tempSaveBtn: "작업 내용을 임시저장했습니다.",
        saveTranslationBtn: "번역/편집 결과를 저장했습니다.",
        newFormBtn: "신규 양식 편집 상태를 열었습니다.",
        payBtn: "결제 완료 상태로 변경했습니다.",
        openToastBtn: "읽지 않은 알림 3건이 있습니다.",
        emptyStateBtn: "결과 없음/파일 없음 빈 상태를 확인했습니다.",
        errorStateBtn: "저장 실패/업로드 실패/결제 실패 오류 상태를 확인했습니다.",
        permissionBtn: "현재 역할 기준 접근 권한을 점검했습니다.",
        auditBtn: "변경 이력을 감사 로그에 기록했습니다.",
        authSaveBtn: "계정 상태와 권한 이동 설정을 저장했습니다.",
        submitQuestionBtn: "출제 문항을 관리자 검수 대기로 제출했습니다.",
        completeGradeBtn: "평가서와 점수를 채점완료 상태로 저장했습니다.",
        approveExpertBtn: "전문가 프로필 승인 상태를 기록했습니다.",
        syncDataBtn: "데이터 객체와 화면 연결 상태를 동기화했습니다.",
        dataAuditBtn: "통합DB 항목 누락 점검을 실행했습니다.",
        componentCheckBtn: "공통 컴포넌트 적용 상태를 점검했습니다.",
        uploadReviewBtn: "업로드 분류 검토를 완료 처리했습니다.",
        selectAllCartBtn: "장바구니 작업을 전체 선택했습니다.",
        deleteCartBtn: "선택한 장바구니 항목 삭제 확인 팝업을 준비했습니다.",
        routeAuditBtn: "권장 라우트와 정적 화면 연결을 점검했습니다.",
        admin2025Btn: "2025 관리자 개편 항목 반영 상태를 확인했습니다.",
        saveMemberDetailBtn: "회원 상세 전체 정보를 저장했습니다.",
        memberAuditBtn: "회원 감사 로그를 확인했습니다.",
        memberHistoryBtn: "회원 상세 이력 추가 상태를 열었습니다.",
        saveMypageBtn: "마이페이지 표시 정보를 저장했습니다.",
        saveCertificateBtn: "자격증 상태와 파일 정보를 저장했습니다.",
        certificateFileBtn: "자격증 발급 파일 목록을 확인했습니다.",
        saveCategoryBtn: "카테고리와 코드값을 저장했습니다.",
        addCategoryBtn: "신규 코드 추가 상태를 열었습니다.",
        runChecklistBtn: "완료 체크리스트와 화면 증거를 점검했습니다.",
        syntaxCheckBtn: "app.js 문법 확인 항목을 기록했습니다.",
        viewCheckBtn: "선언된 view와 화면 section 연결을 확인했습니다.",
        chipCheckBtn: "DB 고정값 Chip 적용 상태를 확인했습니다.",
      };
      showToast(messages[id] || "처리되었습니다.");
    });
  });

  document.querySelector("#openFlowBtn").addEventListener("click", openRoleFlow);

  document.querySelectorAll("[data-modal]").forEach((button) => {
    button.addEventListener("click", () => openDetail(button.dataset.modal));
  });

  document.querySelector("#bulkTabs").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    document.querySelectorAll("#bulkTabs button").forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    showToast(`${button.dataset.tab} 탭으로 전환했습니다.`);
  });
}

renderFilters();
renderMembers();
renderWorkTypes();
renderRoleMenu();
bindEvents();
switchView("dashboard");
