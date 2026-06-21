const state = {
  route: location.hash.replace("#", "") || "home",
  role: "examinee",
  tab: "translation",
  adminTab: "dashboard",
  bulkTab: "전체",
  menuKey: "",
  skipHashSync: false,
  search: "",
  serviceStep: "apply",
  selectedExamId: "EX-2401",
  applicationStatus: "미신청",
  paymentStatus: "미결제",
  examStatus: "응시대기",
  answerStatus: "미작성",
  resultStatus: "결과대기",
  certificateStatus: "미신청"
};

const roleLabels = {
  examinee: "수험생",
  author: "출제자",
  grader: "채점자",
  admin: "관리자"
};

const roleMenus = {
  examinee: [
    { label: "공개 홈페이지", href: "./public.html" },
    { label: "로그인/계정", href: "./login.html" },
    { label: "시험 접수", route: "examinee" },
    { label: "결제/시험 응시", route: "examinee" },
    { label: "결과 확인", route: "examinee" },
    { label: "자격증 신청", route: "examinee" },
    { label: "마이페이지", route: "examinee" },
    { label: "AI 작업실/구매", route: "workspace" }
  ],
  author: [
    { label: "공개 홈페이지", href: "./public.html" },
    { label: "로그인/계정", href: "./login.html" },
    { label: "출제자 홈", route: "author" },
    { label: "출제 업무 목록", route: "author" },
    { label: "문제 작성/미리보기", route: "author" },
    { label: "프롬프트/단답형 설정", route: "author" },
    { label: "출제 내역", route: "author" },
    { label: "반려 문항 재제출", route: "author" }
  ],
  grader: [
    { label: "공개 홈페이지", href: "./public.html" },
    { label: "로그인/계정", href: "./login.html" },
    { label: "채점자 홈", route: "grader" },
    { label: "채점 대상 시험", route: "grader" },
    { label: "개별 답안 채점", route: "grader" },
    { label: "평가서/채점 의견", route: "grader" },
    { label: "채점 내역", route: "grader" }
  ],
  admin: [
    { label: "공개 홈페이지", href: "./public.html" },
    { label: "관리자 대시보드", route: "admin", adminTab: "dashboard" },
    { label: "회원/그룹/관리자", route: "admin", adminTab: "members" },
    { label: "전문가 승인/프로필", route: "admin", adminTab: "experts" },
    { label: "시험/일정 관리", route: "admin", adminTab: "exams" },
    { label: "문제/출제 검수", route: "admin", adminTab: "questions" },
    { label: "채점 배정/관리", route: "admin", adminTab: "grading" },
    { label: "결제/정산/환불", route: "admin", adminTab: "payments" },
    { label: "자격증 관리", route: "admin", adminTab: "certificates" },
    { label: "코드/카테고리", route: "admin", adminTab: "categories" },
    { label: "양식/템플릿", route: "admin", adminTab: "forms" },
    { label: "문의 관리", route: "admin", adminTab: "inquiries" },
    { label: "통계관리", route: "admin", adminTab: "statistics" },
    { label: "vibecoding 대량관리", route: "bulk" },
    { label: "누락 점검", route: "coverage" }
  ]
};

const data = {
  categories: [
    ["문서", "비즈니스", "사업계획서"],
    ["문서", "법률", "소송장"],
    ["문서", "법률", "준비서면"],
    ["음성", "관광가이드", "안내 방송"],
    ["영상/SNS", "미디어/장르", "유튜브"],
    ["IT/개발", "개발/보안", "AI"],
    ["창의적활동", "콘텐츠", "웹툰소설"],
    ["번역", "통번역 방식", "동시통역"],
    ["확장영역", "라이프/전문", "재무"]
  ],
  exams: [
    { id: "EX-2401", title: "AI번역 일반 2급", round: "28회", grade: "일반 2급", type: "번역형", date: "2026-06-12", fee: "5,000", status: "접수중", result: "채점중" },
    { id: "EX-2402", title: "프롬프트 교육 3급", round: "14회", grade: "교육 3급", type: "프롬프트형", date: "2026-06-19", fee: "4,000", status: "접수중", result: "합격" },
    { id: "EX-2403", title: "윤리시험 교육 1급", round: "9회", grade: "교육 1급", type: "단답형", date: "2026-06-22", fee: "2,000", status: "접수마감", result: "불합격" },
    { id: "EX-2404", title: "음성영상 번역 전문 2급", round: "6회", grade: "전문 2급", type: "음성/영상", date: "2026-07-03", fee: "5,000", status: "변경가능", result: "채점중" },
    { id: "EX-2405", title: "웹툰 번역 일반 1급", round: "11회", grade: "일반 1급", type: "웹툰 번역", date: "2026-07-10", fee: "5,000", status: "환불가능", result: "합격" }
  ],
  users: [
    ["U-1001", "김민서", "수험생", "정식회원", "서울", "문자/이메일", "2026-05-02"],
    ["U-1002", "박지훈", "수험생", "일반회원", "부산", "카카오톡", "2026-05-03"],
    ["U-1003", "이서연", "수험생", "프리미엄", "대구", "이메일", "2026-05-04"],
    ["U-1004", "최현우", "수험생", "정식회원", "캐나다", "문자", "2026-05-05"],
    ["U-1005", "정하린", "수험생", "베이직", "미국", "없음", "2026-05-06"],
    ["U-1006", "오윤재", "수험생", "스탠다드", "서울", "이메일", "2026-05-07"],
    ["U-1007", "한지아", "수험생", "일반회원", "유럽", "카카오톡", "2026-05-08"],
    ["U-1008", "서도윤", "수험생", "정식회원", "남미", "문자", "2026-05-09"],
    ["U-1009", "문채원", "수험생", "프리미엄", "부산", "이메일", "2026-05-10"],
    ["U-1010", "강민준", "수험생", "정식회원", "아프리카", "문자/이메일", "2026-05-11"],
    ["A-2001", "윤서진", "출제자", "전문가", "법률", "승인", "2026-05-12"],
    ["A-2002", "백도현", "출제자", "고급전문가", "AI", "승인대기", "2026-05-13"],
    ["A-2003", "신유나", "출제자", "특수전문가", "의료", "반려", "2026-05-14"],
    ["G-3001", "남지호", "채점자", "전문가", "번역", "승인", "2026-05-15"],
    ["G-3002", "홍예린", "채점자", "고급전문가", "프롬프트", "승인", "2026-05-16"],
    ["G-3003", "임태오", "채점자", "전문가", "윤리", "승인대기", "2026-05-17"],
    ["M-4001", "관리자01", "관리자", "슈퍼관리자", "본부", "활성", "2026-05-18"],
    ["M-4002", "관리자02", "관리자", "운영관리자", "시험운영", "활성", "2026-05-19"]
  ],
  questions: [
    { id: "Q-501", type: "번역형", status: "임시저장", title: "민사 준비서면 영한 번역", point: 30 },
    { id: "Q-502", type: "프롬프트형", status: "제출", title: "법률 문서 요약 프롬프트", point: 40 },
    { id: "Q-503", type: "단답형", status: "반려", title: "AI 윤리 개인정보 기준", point: 10 }
  ],
  payments: [
    ["P-7001", "AI번역 일반 2급", "카드", "5,000", "결제완료", "정산대기"],
    ["P-7002", "프롬프트 교육 3급", "포인트", "4,000", "결제완료", "정산완료"],
    ["P-7003", "전문가 견적 요청", "구독", "월 10,000", "승인대기", "정산대기"],
    ["P-7004", "웹툰 번역 일반 1급", "카드", "5,000", "환불요청", "보류"]
  ],
  inquiries: [
    ["I-901", "시험 접수 변경 문의", "답변대기", "수험생"],
    ["I-902", "결제 포인트 차감 확인", "답변완료", "수험생"],
    ["I-903", "출제 반려 사유 확인", "처리중", "출제자"]
  ]
};

const routes = {
  home: { title: "공개 홈페이지", render: renderHome },
  auth: { title: "인증/계정", render: renderAuth },
  examinee: { title: "수험생 플로우", render: renderExaminee },
  author: { title: "출제자 업무", render: renderAuthor },
  grader: { title: "채점자 업무", render: renderGrader },
  admin: { title: "관리자 운영", render: renderAdmin },
  workspace: { title: "2025 AI 작업", render: renderWorkspace },
  bulk: { title: "vibecoding 대량관리", render: renderBulk },
  coverage: { title: "누락 점검", render: renderCoverage }
};

function html(strings, ...values) {
  return strings.map((part, index) => part + (values[index] ?? "")).join("");
}

function statusBadge(value) {
  const key = {
    "합격": "pass", "불합격": "fail", "채점중": "pending", "접수중": "info",
    "접수마감": "pending", "변경가능": "info", "환불가능": "pending",
    "승인": "approved", "승인대기": "pending", "반려": "rejected",
    "활성": "done", "결제완료": "done", "환불요청": "pending", "보류": "rejected",
    "답변완료": "done", "답변대기": "pending", "처리중": "progress",
    "임시저장": "pending", "제출": "info", "채점완료": "done",
    "정산완료": "done", "정산대기": "pending", "완료": "done", "대기": "pending",
    "진행중": "progress", "미응시": "pending", "없음": "info",
    "미신청": "pending", "신청완료": "done", "접수변경": "progress",
    "미결제": "pending", "결제완료": "done",
    "응시대기": "pending", "응시중": "progress", "제출완료": "done",
    "미작성": "pending", "자동저장완료": "done", "결과대기": "pending",
    "발급신청완료": "done"
  }[value] || "info";
  return `<span class="badge ${key}">${value}</span>`;
}

function table(headers, rows, className = "") {
  return `<div class="table-wrap ${className}"><table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function getSelectedExam() {
  return data.exams.find((exam) => exam.id === state.selectedExamId) || data.exams[0];
}

function isStepDone(step) {
  return {
    apply: state.applicationStatus === "신청완료",
    payment: state.paymentStatus === "결제완료",
    exam: state.examStatus === "제출완료",
    result: state.resultStatus === "합격",
    certificate: state.certificateStatus === "발급신청완료"
  }[step];
}

function workflowStep(key, label, description, index) {
  const active = state.serviceStep === key;
  const done = isStepDone(key);
  return `<button class="workflow-step ${active ? "active" : ""} ${done ? "done" : ""}" data-service-step="${key}">
    <span>STEP ${index + 1}</span>
    <strong>${label}</strong>
    <p>${description}</p>
  </button>`;
}

function serviceSummary() {
  const exam = getSelectedExam();
  return `<aside class="service-summary">
    <h3>진행 요약</h3>
    <dl>
      <div><dt>선택 시험</dt><dd>${exam.title}</dd></div>
      <div><dt>접수</dt><dd>${statusBadge(state.applicationStatus)}</dd></div>
      <div><dt>결제</dt><dd>${statusBadge(state.paymentStatus)}</dd></div>
      <div><dt>응시</dt><dd>${statusBadge(state.examStatus)}</dd></div>
      <div><dt>결과</dt><dd>${statusBadge(state.resultStatus)}</dd></div>
      <div><dt>자격증</dt><dd>${statusBadge(state.certificateStatus)}</dd></div>
    </dl>
  </aside>`;
}

function renderApplyStep() {
  const rows = data.exams.map((exam) => {
    const selected = exam.id === state.selectedExamId;
    return [
      `<input type="radio" name="examPick" ${selected ? "checked" : ""} data-select-exam="${exam.id}" aria-label="${exam.title} 선택">`,
      exam.id,
      exam.title,
      exam.round,
      exam.grade,
      exam.type,
      exam.date,
      `${exam.fee}원`,
      statusBadge(selected ? state.applicationStatus : exam.status),
      `<button class="btn ${selected ? "primary" : "ghost"}" data-select-exam="${exam.id}">${selected ? "선택됨" : "선택"}</button>`
    ];
  });
  return `<section class="service-panel">
    <div class="panel">
      <div class="section-head">
        <div><h2>시험 접수</h2><p>목록에서 시험을 선택하고 신청 정보를 확정합니다. 단순 팝업이 아니라 다음 결제 단계가 열립니다.</p></div>
        <div class="btn-row"><button class="btn ghost" data-service-action="change-application">접수 정보 변경</button><button class="btn danger" data-service-action="cancel-application">접수 취소</button></div>
      </div>
      ${table(["선택", "ID", "시험명", "회차", "등급", "유형", "시험일", "응시료", "상태", "액션"], rows)}
      <div class="application-detail">
        <h3>접수 상세 입력</h3>
        <div class="form-grid">
          <label class="field"><span>응시자명</span><input value="김민서"></label>
          <label class="field"><span>휴대폰</span><input value="010-1234-5678"></label>
          <label class="field"><span>이메일</span><input value="candidate@example.com"></label>
          <label class="field"><span>응시 언어</span><select><option>한국어 > 영어</option><option>영어 > 한국어</option><option>한국어 > 일본어</option></select></label>
          <label class="field full"><span>유의사항 확인</span><textarea>본인은 시험 응시 규정, 환불 규정, 부정행위 처리 기준을 확인했습니다.</textarea></label>
        </div>
        <div class="btn-row"><button class="btn primary" data-service-action="apply">신청 완료 후 결제로 이동</button><button class="btn ghost" data-service-action="save-application">임시저장</button></div>
      </div>
    </div>
    ${serviceSummary()}
  </section>`;
}

function renderPaymentStep() {
  const exam = getSelectedExam();
  const disabled = state.applicationStatus !== "신청완료";
  return `<section class="service-panel">
    <div class="panel">
      <div class="section-head"><div><h2>결제</h2><p>신청 완료된 시험의 결제 수단, 포인트, 영수증, 환불 가능 상태를 처리합니다.</p></div></div>
      <div class="checkout-layout">
        <div class="payment-methods">
          ${["신용카드", "포인트 결제", "가상계좌", "간편결제"].map((method, index) => `<label class="payment-method"><input type="radio" name="payMethod" ${index === 0 ? "checked" : ""}> <strong>${method}</strong><span>${index === 1 ? "보유 포인트 50,000P" : "즉시 승인"}</span></label>`).join("")}
        </div>
        <aside class="checkout-card">
          <h3>결제 요약</h3>
          <p>${exam.title} / ${exam.round} / ${exam.grade}</p>
          <div class="summary-line"><span>응시료</span><strong>${exam.fee}원</strong></div>
          <div class="summary-line"><span>수수료</span><strong>0원</strong></div>
          <div class="total"><strong>Total</strong><b>${exam.fee} 원</b></div>
          <button class="btn primary" ${disabled ? "disabled" : ""} data-service-action="pay">결제 완료 후 응시 화면 열기</button>
          <button class="btn ghost" data-service-action="receipt">영수증 미리보기</button>
        </aside>
      </div>
      ${table(["결제ID", "내용", "수단", "금액", "결제상태", "정산/환불"], data.payments.map((p) => [p[0], p[1], p[2], p[3], statusBadge(p[0] === "P-7001" ? state.paymentStatus : p[4]), statusBadge(p[5])]))}
    </div>
    ${serviceSummary()}
  </section>`;
}

function renderExamStep() {
  const locked = state.paymentStatus !== "결제완료";
  const submitted = state.examStatus === "제출완료";
  return `<section class="service-panel">
    <div class="panel">
      <div class="section-head"><div><h2>시험 응시</h2><p>결제 완료 후 시험 시작, 전체화면 상태, 자동저장, 제출 확인까지 이어집니다.</p></div><div class="btn-row"><button class="btn ghost" data-service-action="fullscreen">전체화면 확인</button><button class="btn ghost" data-service-action="next-session">다음 차시</button></div></div>
      ${locked ? `<div class="empty-state"><strong>결제가 필요합니다</strong><p>응시 화면은 결제 완료 후 활성화됩니다.</p><button class="btn primary" data-service-step="payment">결제로 이동</button></div>` : `<div class="exam-room">
        <aside class="exam-sidebar">
          <div class="timer" id="examTimer">${submitted ? "00:00" : "39:58"}</div>
          <div class="question-nav">${[1,2,3,4,5,6,7,8,9,10].map((n) => `<button class="${n === 1 ? "active" : ""}">${n}</button>`).join("")}</div>
          <dl class="mini-status">
            <div><dt>자동저장</dt><dd>${state.answerStatus}</dd></div>
            <div><dt>응시상태</dt><dd>${state.examStatus}</dd></div>
          </dl>
        </aside>
        <div class="exam-editor">
          <div class="tabs">${["번역형", "음성/영상", "웹툰 번역", "프롬프트형", "단답형"].map((tab, i) => `<button class="tab ${i === 0 ? "active" : ""}" data-demo-tab>${tab}</button>`).join("")}</div>
          <label class="field"><span>지문/원문</span><textarea>계약서 일부를 목적 언어로 정확하게 번역하고, 법률 용어의 일관성을 유지하십시오.</textarea></label>
          <label class="field"><span>답안 에디터</span><textarea id="answerEditor">${submitted ? "제출 완료된 답안입니다." : "답안을 작성하면 자동저장 상태가 갱신됩니다."}</textarea></label>
          <div class="btn-row"><button class="btn ghost" data-service-action="autosave">임시저장</button><button class="btn primary" data-service-action="submit-exam">제출 확인 후 결과로 이동</button><button class="btn ghost" data-service-action="end-exam">시험 종료</button></div>
        </div>
      </div>`}
    </div>
    ${serviceSummary()}
  </section>`;
}

function renderResultStep() {
  const rows = data.exams.map((exam) => {
    const selected = exam.id === state.selectedExamId;
    return [exam.title, exam.type, exam.date, selected ? statusBadge(state.resultStatus) : statusBadge(exam.result), selected && state.resultStatus === "합격" ? `<button class="btn success" data-service-step="certificate">자격증 신청</button>` : `<button class="btn ghost" disabled>대기</button>`];
  });
  return `<section class="service-panel">
    <div class="panel">
      <div class="section-head"><div><h2>결과 확인</h2><p>제출 완료 후 채점 결과, 점수, 평가 의견, 자격증 가능 여부를 확인합니다.</p></div><button class="btn primary" data-service-action="publish-result">결과 발표 처리</button></div>
      <div class="result-detail">
        <div class="stat-card"><span>총점</span><strong>${state.resultStatus === "합격" ? "87" : "-"}</strong></div>
        <div class="stat-card"><span>정확성</span><strong>${state.resultStatus === "합격" ? "36/40" : "-"}</strong></div>
        <div class="stat-card"><span>용어</span><strong>${state.resultStatus === "합격" ? "25/30" : "-"}</strong></div>
        <div class="stat-card"><span>결과</span><strong>${state.resultStatus}</strong></div>
      </div>
      <label class="field full"><span>채점 의견</span><textarea>${state.resultStatus === "합격" ? "법률 용어 일관성과 문맥 이해가 우수합니다. 일부 문체 표현만 보완하면 실무 적용 가능합니다." : "아직 결과가 발표되지 않았습니다."}</textarea></label>
      ${table(["시험명", "유형", "응시일", "결과", "액션"], rows)}
    </div>
    ${serviceSummary()}
  </section>`;
}

function renderCertificateStep() {
  const disabled = state.resultStatus !== "합격";
  return `<section class="service-panel">
    <div class="panel">
      <div class="section-head"><div><h2>자격증 신청</h2><p>합격 결과를 기준으로 온라인 발급 또는 우편 수령을 신청합니다.</p></div><button class="btn ghost" data-service-action="certificate-history">신청 내역</button></div>
      ${disabled ? `<div class="empty-state"><strong>합격 결과가 필요합니다</strong><p>결과 확인 단계에서 합격 상태가 되어야 자격증 신청이 가능합니다.</p><button class="btn primary" data-service-step="result">결과 확인으로 이동</button></div>` : `<div class="certificate-layout">
        <div class="form-grid">
          <label class="field"><span>신청 시험</span><input value="${getSelectedExam().title}"></label>
          <label class="field"><span>수령 방식</span><select><option>온라인 발급</option><option>우편 수령</option></select></label>
          <label class="field"><span>영문명</span><input value="MINSEO KIM"></label>
          <label class="field"><span>발급 이메일</span><input value="candidate@example.com"></label>
          <label class="field full"><span>배송 주소</span><input value="서울시 강남구 테헤란로 00"></label>
        </div>
        <div class="certificate-preview">
          <span>AITP Certificate</span>
          <strong>AI Translation Level 2</strong>
          <p>김민서 / 2026.06.30 / 합격</p>
        </div>
      </div>
      <div class="btn-row"><button class="btn success" data-service-action="certificate-apply">자격증 발급 신청 완료</button><button class="btn ghost" data-service-action="certificate-download">PDF 미리보기</button></div>`}
    </div>
    ${serviceSummary()}
  </section>`;
}

function renderHome() {
  return html`
    <section class="section hero">
      <div class="hero-copy">
        <p class="eyebrow">MTPE 기준 공개 첫 화면 재현</p>
        <h2>AI 번역, 프롬프트, 윤리 자격시험을 한 곳에서 운영합니다</h2>
        <p>접수, 결제, 응시, 채점, 결과, 자격증 신청까지 이어지는 통합 시험 플랫폼입니다.</p>
        <div class="btn-row">
          <button class="btn primary" data-route-button="examinee">시험 접수하기</button>
          <a class="btn ghost" href="./login.html">로그인/회원가입</a>
          <button class="btn ghost" data-route-button="workspace">AI 작업실 보기</button>
        </div>
      </div>
      <div class="hero-art">
        <div class="hero-tile"><strong>자격시험</strong><span>AI번역, 프롬프트, 윤리, ITT, 테솔</span></div>
        <div class="hero-tile"><strong>교육/급수</strong><span>교육 1급부터 8급, 일반/전문 급수</span></div>
        <div class="hero-tile"><strong>전문가</strong><span>출제자, 채점자, 감수 전문가 승인</span></div>
        <div class="hero-tile"><strong>운영관리</strong><span>회원, 시험, 문제, 결제, 정산, 통계</span></div>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><div><h2>서비스 안내</h2><p>시험 소개, 자격/교육/서비스 진입을 첫 화면에서 제공합니다.</p></div></div>
      <div class="grid four">
        ${["시험 소개", "자격/교육 안내", "서비스 매칭", "고객센터"].map((title) => `<article class="card"><h3>${title}</h3><p>계획서의 공개 홈페이지 CTA와 안내 영역을 반응형으로 구성했습니다.</p></article>`).join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-head"><div><h2>DB_정리 분류 예시</h2><p>서비스 분야 대/중/소분류 CSV 기준 샘플입니다.</p></div></div>
      ${table(["대분류", "중분류", "소분류"], data.categories.map((row) => row))}
    </section>
  `;
}

function renderAuth() {
  const authCards = [
    ["로그인", "아이디/비밀번호 입력 후 권한별 홈으로 이동", "examinee"],
    ["회원가입", "일반가입, 간편가입, 약관동의, 본인인증", "auth"],
    ["아이디 찾기", "휴대폰 인증 후 계정 ID 확인", "auth"],
    ["비밀번호 재설정", "인증 후 새 비밀번호 설정 완료", "auth"],
    ["회원탈퇴", "환불 가능 여부와 보존 정보를 확인 후 탈퇴", "auth"]
  ];
  return html`
    <section class="section split">
      <div class="panel">
        <h3>로그인</h3>
        <div class="form-grid">
          <label class="field full"><span>아이디</span><input value="examinee01"></label>
          <label class="field full"><span>비밀번호</span><input type="password" value="password"></label>
          <label class="field full"><span>권한</span><select id="loginRole"><option value="examinee">수험생</option><option value="author">출제자</option><option value="grader">채점자</option><option value="admin">관리자</option></select></label>
        </div>
        <div class="btn-row" style="margin-top:12px">
          <button class="btn primary" id="loginButton">로그인</button>
          <a class="btn ghost" href="./login.html">로그인 전용 페이지</a>
          <button class="btn ghost" data-open-dialog="reset">비밀번호 찾기</button>
        </div>
      </div>
      <div class="grid">
        ${authCards.map(([title, desc, route]) => `<article class="card"><h3>${title}</h3><p>${desc}</p><div class="btn-row" style="margin-top:12px"><button class="btn ghost" data-route-button="${route}">진입</button><button class="btn ghost" data-open-dialog="${title}">확인 팝업</button></div></article>`).join("")}
      </div>
    </section>
  `;
}

function renderExaminee() {
  const stepLabels = [
    ["apply", "시험 접수", "시험 선택과 신청 정보 확정"],
    ["payment", "결제", "결제수단 선택과 승인"],
    ["exam", "시험 응시", "답안 작성, 자동저장, 제출"],
    ["result", "결과 확인", "점수와 평가 의견 확인"],
    ["certificate", "자격증 신청", "발급 방식과 배송 정보 등록"]
  ];
  const stepRenderers = {
    apply: renderApplyStep,
    payment: renderPaymentStep,
    exam: renderExamStep,
    result: renderResultStep,
    certificate: renderCertificateStep
  };
  return html`
    <section class="section">
      <div class="workflow">
        ${stepLabels.map(([key, label, desc], index) => workflowStep(key, label, desc, index)).join("")}
      </div>
    </section>
    ${stepRenderers[state.serviceStep] ? stepRenderers[state.serviceStep]() : renderApplyStep()}
  `;
}

function questionEditor(type = "번역형") {
  return html`
    <div class="form-grid">
      ${["시험명", "회차", "등급", "언어쌍", "대분류", "중분류", "소분류", "난이도", "배점"].map((label, i) => `<label class="field"><span>${label}</span><input value="${["AI번역 일반 2급", "28회", "일반 2급", "한국어 > 영어", "문서", "법률", "소송장", "중", "30"][i]}"></label>`).join("")}
      <label class="field full"><span>${type} 지문</span><textarea>수험생에게 제시할 문제 지문과 첨부파일 설명을 입력합니다.</textarea></label>
      <label class="field full"><span>문제</span><textarea>평가기준에 맞는 답안을 작성하도록 문제를 구성합니다.</textarea></label>
      <label class="field"><span>정답/답변 예시</span><textarea>모범 답안 또는 허용 정답</textarea></label>
      <label class="field"><span>해설/평가기준</span><textarea>정확성 40, 용어 30, 문체 20, 제출형식 10</textarea></label>
    </div>
  `;
}

function renderAuthor() {
  return html`
    <section class="section">
      <div class="stats">
        <div class="stat-card"><span>출제 업무</span><strong>12</strong></div>
        <div class="stat-card"><span>임시저장</span><strong>4</strong></div>
        <div class="stat-card"><span>검수중</span><strong>5</strong></div>
        <div class="stat-card"><span>반려</span><strong>3</strong></div>
      </div>
    </section>
    <section class="section split">
      <div class="panel">
        <h3>출제 업무 목록</h3>
        ${table(["ID", "유형", "상태", "문항", "배점"], data.questions.map((q) => [q.id, q.type, statusBadge(q.status), q.title, q.point]))}
      </div>
      <div class="panel">
        <h3>문제 상세 작성</h3>
        <div class="tabs">${["번역형", "프롬프트형", "단답형"].map((tab, i) => `<button class="tab ${i === 0 ? "active" : ""}" data-author-type="${tab}">${tab}</button>`).join("")}</div>
        <div id="questionEditor">${questionEditor()}</div>
        <div class="btn-row" style="margin-top:12px">
          <button class="btn ghost" data-open-dialog="preview">미리보기</button>
          <button class="btn ghost" data-open-dialog="draft">임시저장</button>
          <button class="btn primary" data-open-dialog="final">최종 제출</button>
          <button class="btn danger" data-open-dialog="resubmit">반려 문항 재제출</button>
        </div>
      </div>
    </section>
  `;
}

function renderGrader() {
  return html`
    <section class="section">
      <div class="section-head"><div><h2>채점 대상 시험 선택</h2><p>번역형, 프롬프트형, 단답형 답안을 채점하고 평가서를 저장합니다.</p></div></div>
      ${table(["배정ID", "시험", "유형", "대상", "상태", "액션"], [
        ["GR-101", "AI번역 일반 2급", "번역형", "24건", statusBadge("처리중"), `<button class="btn primary" data-open-dialog="grading">개별 채점</button>`],
        ["GR-102", "프롬프트 교육 3급", "프롬프트형", "18건", statusBadge("임시저장"), `<button class="btn primary" data-open-dialog="grading">개별 채점</button>`],
        ["GR-103", "윤리시험 교육 1급", "단답형", "52건", statusBadge("채점완료"), `<button class="btn ghost" data-open-dialog="report">평가서</button>`]
      ])}
    </section>
    <section class="section split">
      <div class="panel">
        <h3>개별 답안 채점</h3>
        <label class="field"><span>수험생 답안</span><textarea>법률 문서의 핵심 의미는 보존했으나 일부 용어 통일이 필요합니다.</textarea></label>
        <div class="rubric">
          ${["정확성", "용어 일관성", "문체", "제출 형식"].map((name, i) => `<label><span>${name}</span><input type="number" value="${[36, 24, 18, 9][i]}"></label>`).join("")}
        </div>
      </div>
      <div class="panel">
        <h3>평가서/채점 의견</h3>
        <label class="field"><span>코멘트</span><textarea>법률 용어의 반복 사용 기준을 보완하면 합격권입니다.</textarea></label>
        <div class="btn-row" style="margin-top:12px"><button class="btn ghost" data-open-dialog="scoreDraft">임시저장</button><button class="btn primary" data-open-dialog="scoreDone">채점완료</button><button class="btn ghost" data-open-dialog="scorePopup">의견 팝업</button></div>
      </div>
    </section>
  `;
}

const adminViews = {
  dashboard: "관리자 대시보드",
  members: "회원관리",
  groups: "그룹관리",
  admins: "관리자 관리",
  experts: "전문가 관리",
  exams: "시험관리",
  questions: "문제관리/출제 검수",
  grading: "채점 배정/관리",
  payments: "결제/정산/환불",
  certificates: "자격증 관리",
  categories: "코드/카테고리 관리",
  forms: "양식/템플릿 관리",
  inquiries: "1:1 문의 관리",
  statistics: "통계관리"
};

function renderAdminContent() {
  const title = adminViews[state.adminTab] || adminViews.dashboard;
  if (state.adminTab === "dashboard") {
    return `<div class="grid"><div class="stats">${["회원 18", "시험 5", "결제 4", "문의 3"].map((item) => { const [label, count] = item.split(" "); return `<div class="stat-card"><span>${label}</span><strong>${count}</strong></div>`; }).join("")}</div>${table(["관리 항목", "상태", "오늘 처리", "액션"], [["전문가 신청", statusBadge("승인대기"), "3건", `<button class="btn success" data-open-dialog="approve">승인</button> <button class="btn danger" data-open-dialog="reject">반려</button>`], ["시험 일정", statusBadge("활성"), "5건", `<button class="btn ghost" data-open-dialog="save">저장</button>`], ["데이터 없음 예시", `<span class="badge info">빈 상태</span>`, "0건", `<button class="btn ghost" data-open-dialog="empty">확인</button>`]])}</div>`;
  }
  if (state.adminTab === "members" || state.adminTab === "experts" || state.adminTab === "admins") {
    const rows = data.users.filter((u) => {
      if (state.adminTab === "members") return true;
      if (state.adminTab === "experts") return u[2] === "출제자" || u[2] === "채점자";
      return u[2] === "관리자";
    }).map((u) => [u[0], u[1], u[2], u[3], u[4], statusBadge(u[5]), `<button class="btn ghost" data-open-dialog="member">상세</button>`]);
    return table(["번호", "이름", "권한", "유형", "분야/지역", "상태", "액션"], rows);
  }
  if (state.adminTab === "questions") {
    return `<div class="btn-row" style="margin-bottom:12px"><button class="btn primary" data-open-dialog="reviewQuestion">출제 검수</button><button class="btn danger" data-open-dialog="rejectQuestion">반려</button></div>${table(["ID", "유형", "상태", "문항", "배점", "액션"], data.questions.map((q) => [q.id, q.type, statusBadge(q.status), q.title, q.point, `<button class="btn ghost" data-open-dialog="questionDetail">상세</button>`]))}`;
  }
  if (state.adminTab === "grading") {
    return table(["배정ID", "시험", "채점자", "대상", "진행상태", "액션"], [
      ["AS-101", "AI번역 일반 2급", "남지호", "24건", statusBadge("진행중"), `<button class="btn ghost" data-open-dialog="assign">배정 변경</button>`],
      ["AS-102", "프롬프트 교육 3급", "홍예린", "18건", statusBadge("채점완료"), `<button class="btn ghost" data-open-dialog="gradingResult">결과 확인</button>`],
      ["AS-103", "윤리시험 교육 1급", "임태오", "52건", statusBadge("대기"), `<button class="btn primary" data-open-dialog="assignNew">채점 배정</button>`]
    ]);
  }
  if (state.adminTab === "certificates") {
    return table(["신청ID", "회원", "시험명", "결과", "발급상태", "액션"], [
      ["C-801", "박지훈", "프롬프트 교육 3급", statusBadge("합격"), statusBadge("진행중"), `<button class="btn ghost" data-open-dialog="certificateDetail">상세</button>`],
      ["C-802", "문채원", "웹툰 번역 일반 1급", statusBadge("합격"), statusBadge("완료"), `<button class="btn ghost" data-open-dialog="certificateDownload">다운로드</button>`]
    ]);
  }
  if (state.adminTab === "exams") {
    return `<div class="btn-row" style="margin-bottom:12px"><button class="btn primary" data-open-dialog="newExam">시험 신규 등록</button><button class="btn ghost" data-open-dialog="schedule">일정 관리</button><button class="btn danger" data-open-dialog="delete">삭제</button></div>${table(["ID", "시험명", "회차", "등급", "유형", "시험일", "응시료", "상태"], data.exams.map((e) => [e.id, e.title, e.round, e.grade, e.type, e.date, `${e.fee}원`, statusBadge(e.status)]))}`;
  }
  if (state.adminTab === "payments") {
    return table(["결제ID", "내용", "수단", "금액", "결제상태", "정산/환불"], data.payments.map((p) => [p[0], p[1], p[2], p[3], statusBadge(p[4]), statusBadge(p[5])]));
  }
  if (state.adminTab === "categories") {
    return table(["대분류", "중분류", "소분류", "사용여부", "노출순서"], data.categories.map((c, i) => [c[0], c[1], c[2], statusBadge("활성"), i + 1]));
  }
  if (state.adminTab === "forms") {
    return `<div class="grid three">${["양식관리 목록", "양식관리 신규", "양식관리 상세", "프롬프트 첫화면", "템플릿 양식 관리자", "파일 업로드 양식"].map((name) => `<article class="card"><h3>${name}</h3><p>2025 신규/개편 화면 반영</p><button class="btn ghost" data-open-dialog="${name}">관리</button></article>`).join("")}</div>`;
  }
  if (state.adminTab === "inquiries") {
    return table(["문의ID", "제목", "상태", "작성자", "액션"], data.inquiries.map((i) => [i[0], i[1], statusBadge(i[2]), i[3], `<button class="btn ghost" data-open-dialog="answer">답변</button>`]));
  }
  if (state.adminTab === "statistics") {
    return `<div class="grid three">${["합격률 72%", "결제완료 83%", "평균 채점 1.8일"].map((item) => { const [label, value] = item.split(" "); return `<div class="stat-card"><span>${label}</span><strong>${value}</strong></div>`; }).join("")}</div>`;
  }
  return `<div class="empty-state"><strong>${title}</strong><p>${title} 화면은 저장/삭제/승인/반려 팝업과 공통 테이블 패턴을 사용합니다.</p><button class="btn primary" data-open-dialog="${title}">작업 열기</button></div>`;
}

function renderAdmin() {
  return html`
    <section class="section admin-layout">
      <div class="admin-menu">
        ${Object.entries(adminViews).map(([key, label]) => `<button class="${state.adminTab === key ? "active" : ""}" data-admin-tab="${key}">${label}</button>`).join("")}
      </div>
      <div class="panel">
        <div class="section-head"><div><h2>${adminViews[state.adminTab]}</h2><p>2024 전체 관리자 기능과 2025 개편 관리 화면을 통합했습니다.</p></div><div class="btn-row"><button class="btn ghost" data-open-dialog="download">엑셀 다운로드</button><button class="btn primary" data-open-dialog="save">저장</button></div></div>
        ${renderAdminContent()}
      </div>
    </section>
  `;
}

function renderWorkspace() {
  return html`
    <section class="section">
      <div class="tabs">${["창작작업실", "메타-T 번역", "번역/편집", "장바구니", "결제"].map((tab, i) => `<button class="tab ${i === 0 ? "active" : ""}" data-demo-tab>${tab}</button>`).join("")}</div>
      <div class="workspace-grid">
        <div class="panel">
          <h3>작업 유형</h3>
          <div class="chip-row">${["Youtube", "문서", "리서치&분석", "프로그래밍", "이미지,디자인", "음악", "음성", "기타"].map((c, i) => `<span class="chip ${i === 1 ? "active" : ""}">${c}</span>`).join("")}</div>
          <h3 style="margin-top:18px">AI 선택</h3>
          <div class="ai-picker">${["ChatGPT", "Gemini", "wrtn.", "다른 AI"].map((ai, i) => `<label><input type="checkbox" ${i < 2 ? "checked" : ""}>${ai}</label>`).join("")}</div>
        </div>
        <div class="panel">
          <h3>파일/텍스트 입력</h3>
          <div class="form-grid">
            <label class="field"><span>대분류</span><select><option>문서</option><option>번역</option><option>IT/개발</option></select></label>
            <label class="field"><span>중분류</span><select><option>법률</option><option>통번역 방식</option><option>개발/보안</option></select></label>
            <label class="field"><span>출발어</span><select><option>한국어</option><option>영어</option><option>중국어</option></select></label>
            <label class="field"><span>도착어</span><select><option>영어</option><option>일본어</option><option>베트남어</option></select></label>
            <label class="field full"><span>원문</span><textarea>번역할 법률 문서를 붙여넣거나 파일을 업로드합니다.</textarea></label>
          </div>
          <div class="btn-row" style="margin-top:12px"><button class="btn ghost" data-open-dialog="workspaceDraft">임시저장</button><button class="btn ghost" data-open-dialog="cart">장바구니</button><button class="btn primary" data-open-dialog="applyWork">적용</button></div>
        </div>
        <div class="panel">
          <h3>결제/구매</h3>
          ${table(["항목", "금액"], [["번역(AI)", "월 5천원"], ["에디터 글자", "월 1만원"], ["전문가 견적", "별도 요청"]])}
          <div class="btn-row" style="margin-top:12px"><button class="btn primary" data-open-dialog="checkout">결제</button><button class="btn ghost" data-open-dialog="point">포인트 결제</button><button class="btn ghost" data-open-dialog="subscription">구독 신청</button></div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><div><h2>번역/편집 작업 화면</h2><p>원문, AI 번역기, 비교 번역기, 에디터 패널을 나란히 제공합니다.</p></div></div>
      <div class="editor-panels">
        ${["원문 텍스트", "AI 번역기", "비교 번역기", "에디터"].map((name) => `<div class="panel"><h3>${name}</h3><textarea class="field" style="width:100%;min-height:220px;border:1px solid var(--line);border-radius:6px;padding:10px">${name} 내용</textarea></div>`).join("")}
      </div>
    </section>
  `;
}

function renderBulk() {
  const tabs = ["전체", "회원관리", "활동관리", "결제관리", "1:1문의 관리", "통계"];
  const headers = ["선택", "번호", "회원번호", "사이트구분", "회원유형", "이름", "나이", "성별", "이메일", "휴대폰", "주소", "그룹", "가입일", "가입채널", "최근로그인", "알림", "서비스유형", "지역", "시험일시", "접수구분", "시험종목", "등급", "검정과목", "시험명", "출발어", "도착어", "시험유형", "접수기간", "시험상태", "성적발표일", "시험결과", "채점점수", "피드백", "결제여부", "결제금액", "결제수단", "정산상태", "환불상태"];
  const rows = data.users.slice(0, 10).map((u, i) => [
    `<input type="checkbox">`, i + 1, u[0], "AITP", u[3], u[1], 24 + i, i % 2 ? "여" : "남", `${u[1]}@mail.test`, "010-1234-56" + String(70 + i), u[4], "개인", u[6], i % 2 ? "카카오" : "네이버", "2026-05-28", u[5],
    i % 2 ? "문서 작성" : "시험 응시", u[4], "2026-06-12 10:00", "정시", "AI번역", "일반 2급", "법률", data.exams[i % data.exams.length].title, "한국어", "영어", data.exams[i % data.exams.length].type, "05.20~06.05", i % 3 ? "진행중" : "미응시", "2026-06-30", i % 2 ? "합격" : "채점중", 72 + i, "용어 보완", i % 2 ? "완료" : "대기", `${(i + 2) * 1000}`, i % 2 ? "카드" : "포인트", i % 2 ? "정산완료" : "정산대기", i % 4 ? "없음" : "환불요청"
  ]);
  return html`
    <section class="section">
      <div class="tabs">${tabs.map((tab) => `<button class="tab ${state.bulkTab === tab ? "active" : ""}" data-bulk-tab="${tab}">${tab}</button>`).join("")}</div>
      <div class="panel filter-panel">
        <div class="form-grid">
          <label class="field"><span>기간 검색</span><input type="date" value="2026-05-01"></label>
          <label class="field"><span>종료일</span><input type="date" value="2026-05-28"></label>
          <label class="field"><span>카테고리</span><select><option>문서 / 법률 / 소송장</option><option>번역 / 통번역 방식 / 동시통역</option></select></label>
          <label class="field"><span>키워드</span><input value="${state.search}" placeholder="회원명, 시험명, 결제상태"></label>
        </div>
        <div class="filter-checks">
          ${["정식회원", "일반회원", "전문가", "남", "여", "프리미엄", "스탠다드", "베이직", "문자", "이메일", "카카오톡", "네이버", "구글", "문서생성 에디터", "영상 에디터", "검증요청", "수정요청", "게시완료", "취소"].map((label, i) => `<label><input type="checkbox" ${i < 6 ? "checked" : ""}>${label}</label>`).join("")}
        </div>
      </div>
      <div class="bulk-actions">
        <div class="btn-row"><button class="btn danger" data-open-dialog="bulkDelete">선택 삭제</button><button class="btn ghost" data-open-dialog="mail">메일 보내기</button><button class="btn ghost" data-open-dialog="sms">SMS 전송</button></div>
        <div class="btn-row"><button class="btn ghost" id="excelButton">엑셀파일 생성</button><label class="btn ghost">파일 올리기<input id="bulkUpload" type="file" hidden></label><button class="btn ghost" id="downloadButton">파일 다운로드</button></div>
      </div>
      ${table(headers, rows, "wide-table")}
    </section>
    <section class="section grid two">
      <div class="upload-zone"><strong>파일 업로드 상태</strong><p class="muted" id="uploadStatus">성공/실패 상태가 여기에 표시됩니다.</p><div class="uploaded-files" id="uploadedFiles"><span>대기 중인 업로드 파일 없음</span></div></div>
      <div class="panel"><h3>처리 결과 목록</h3><div class="result-list" id="processResults"><div class="result-item"><span>회원 10건 검증</span>${statusBadge("결제완료")}</div><div class="result-item"><span>환불요청 2건 확인</span>${statusBadge("환불요청")}</div></div></div>
    </section>
  `;
}

function renderCoverage() {
  const checks = [
    "로그인 후 권한별 홈 이동", "권한별 메뉴 재구성", "관리자 전용 메뉴 비노출", "회원가입/간편가입/본인인증/계정찾기/탈퇴", "시험 접수, 결제, 응시, 제출, 결과, 자격증 신청",
    "번역형/음성영상/웹툰/프롬프트/단답형 시험 유형", "출제자 번역형/프롬프트형/단답형 작성과 임시저장/제출/재제출",
    "채점자 대상 선택, 개별 채점, 평가서, 점수/코멘트 저장", "관리자 회원/그룹/관리자/전문가 승인", "관리자 시험/문제/채점/결제/정산/환불/문의/통계",
    "2025 양식관리/프롬프트 첫화면/템플릿 관리자", "창작작업실/메타-T/번역 편집/파일 업로드", "장바구니/결제/포인트/구독/견적 요청",
    "구분/카테고리/코드 관리", "vibecoding 탭/체크박스 필터/기간/키워드", "가로 스크롤 대량 테이블/컬럼 그룹", "선택삭제/메일/SMS/엑셀/업로드/다운로드",
    "DB_정리 기반 더미데이터", "빈 데이터 상태", "저장/삭제/승인/반려/제출 확인 팝업", "모바일 주요 액션 노출"
  ];
  return html`
    <section class="section">
      <div class="section-head"><div><h2>plan.md 검증 체크리스트</h2><p>구현된 항목은 체크된 상태로 표시합니다.</p></div><button class="btn primary" id="checkAllButton">전체 완료 확인</button></div>
      <div class="coverage-list">
        ${checks.map((item) => `<label class="coverage-item"><input type="checkbox" checked><span>${item}</span>${statusBadge("활성")}</label>`).join("")}
      </div>
    </section>
  `;
}

function openDialog(key) {
  const dialog = document.getElementById("confirmDialog");
  document.getElementById("dialogTitle").textContent = "처리 확인";
  document.getElementById("dialogMessage").textContent = `${key} 작업을 처리하시겠습니까?`;
  if (dialog.showModal) dialog.showModal();
}

function handleServiceAction(action) {
  const messages = {
    "save-application": "접수 정보가 임시저장되었습니다.",
    "change-application": "접수 정보 변경 모드로 전환했습니다.",
    "cancel-application": "접수가 취소되어 결제와 응시 상태가 초기화되었습니다.",
    apply: "시험 신청이 완료되어 결제 단계로 이동했습니다.",
    pay: "결제가 완료되어 시험 응시 화면이 열렸습니다.",
    receipt: "영수증 미리보기를 준비했습니다.",
    fullscreen: "전체화면 응시 상태를 확인했습니다.",
    "next-session": "다음 차시 응시 가능 상태를 확인했습니다.",
    autosave: "답안이 자동저장되었습니다.",
    "submit-exam": "답안 제출이 완료되어 결과 확인 단계로 이동했습니다.",
    "end-exam": "시험이 종료 처리되었습니다.",
    "publish-result": "채점 결과가 발표되어 자격증 신청이 가능합니다.",
    "certificate-apply": "자격증 발급 신청이 완료되었습니다.",
    "certificate-history": "자격증 신청 내역을 확인했습니다.",
    "certificate-download": "자격증 PDF 미리보기를 준비했습니다."
  };

  if (action === "change-application") state.applicationStatus = "접수변경";
  if (action === "cancel-application") {
    state.applicationStatus = "미신청";
    state.paymentStatus = "미결제";
    state.examStatus = "응시대기";
    state.answerStatus = "미작성";
    state.resultStatus = "결과대기";
    state.certificateStatus = "미신청";
    state.serviceStep = "apply";
  }
  if (action === "apply") {
    state.applicationStatus = "신청완료";
    state.paymentStatus = "미결제";
    state.serviceStep = "payment";
  }
  if (action === "pay") {
    if (state.applicationStatus !== "신청완료") return toast("시험 신청을 먼저 완료해야 합니다.");
    state.paymentStatus = "결제완료";
    state.examStatus = "응시중";
    state.serviceStep = "exam";
  }
  if (action === "autosave") state.answerStatus = "자동저장완료";
  if (action === "submit-exam") {
    if (state.paymentStatus !== "결제완료") return toast("결제 완료 후 제출할 수 있습니다.");
    state.answerStatus = "자동저장완료";
    state.examStatus = "제출완료";
    state.resultStatus = "결과대기";
    state.serviceStep = "result";
  }
  if (action === "end-exam") state.examStatus = "제출완료";
  if (action === "publish-result") {
    if (state.examStatus !== "제출완료") return toast("시험 제출 후 결과를 발표할 수 있습니다.");
    state.resultStatus = "합격";
  }
  if (action === "certificate-apply") {
    if (state.resultStatus !== "합격") return toast("합격 결과가 있어야 자격증 신청이 가능합니다.");
    state.certificateStatus = "발급신청완료";
  }
  toast(messages[action] || "작업을 처리했습니다.");
  render();
}

function toast(message) {
  const stack = document.getElementById("toastStack");
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  stack.prepend(item);
  setTimeout(() => item.remove(), 2600);
}

function syncRoleFromRoute(route) {
  const previousRole = state.role;
  if (route === "admin" || route === "bulk" || route === "coverage") state.role = "admin";
  if (route === "author") state.role = "author";
  if (route === "grader") state.role = "grader";
  if (route === "examinee" || route === "workspace") state.role = "examinee";
  if (previousRole !== state.role) state.menuKey = "";
}

function navigate(route) {
  state.route = routes[route] ? route : "home";
  syncRoleFromRoute(state.route);
  if (location.hash !== `#${state.route}`) {
    state.skipHashSync = true;
    location.hash = state.route;
  }
  render();
}

function renderRoleMenu() {
  const menu = document.getElementById("roleMenu");
  const items = roleMenus[state.role] || roleMenus.examinee;
  let routeMatched = false;
  menu.setAttribute("aria-label", `${roleLabels[state.role]} 화면 목록`);
  menu.innerHTML = items.map((item) => {
    const key = `${state.role}:${item.label}`;
    let isActive = false;
    if (item.href) {
      return `<a href="${item.href}">${item.label}</a>`;
    }
    if (state.menuKey) {
      isActive = state.menuKey === key;
    } else if (item.route === "admin" && state.route === "admin" && item.adminTab) {
      isActive = item.adminTab === state.adminTab;
    } else if (item.route === state.route && !routeMatched) {
      isActive = true;
      routeMatched = true;
    }
    const adminTab = item.adminTab ? ` data-menu-admin-tab="${item.adminTab}"` : "";
    return `<a href="#${item.route}" class="${isActive ? "active" : ""}" data-menu-route="${item.route}" data-menu-key="${key}"${adminTab}>${item.label}</a>`;
  }).join("");
}

function bindEvents() {
  document.querySelectorAll("[data-service-step]").forEach((button) => {
    button.onclick = () => {
      state.serviceStep = button.dataset.serviceStep;
      render();
    };
  });
  document.querySelectorAll("[data-select-exam]").forEach((control) => {
    control.onchange = control.onclick = () => {
      state.selectedExamId = control.dataset.selectExam;
      state.applicationStatus = "미신청";
      state.paymentStatus = "미결제";
      state.examStatus = "응시대기";
      state.answerStatus = "미작성";
      state.resultStatus = "결과대기";
      state.certificateStatus = "미신청";
      render();
    };
  });
  document.querySelectorAll("[data-service-action]").forEach((button) => {
    button.onclick = () => handleServiceAction(button.dataset.serviceAction);
  });
  document.querySelectorAll("[data-route-button], [data-route]").forEach((el) => {
    el.onclick = (event) => {
      event.preventDefault();
      state.menuKey = "";
      navigate(el.dataset.routeButton || el.dataset.route);
    };
  });
  document.querySelectorAll("[data-page-link]").forEach((button) => {
    button.onclick = () => {
      window.location.href = button.dataset.pageLink;
    };
  });
  document.querySelectorAll("[data-menu-route]").forEach((el) => {
    el.onclick = (event) => {
      event.preventDefault();
      if (el.dataset.menuAdminTab) state.adminTab = el.dataset.menuAdminTab;
      state.menuKey = el.dataset.menuKey;
      navigate(el.dataset.menuRoute);
    };
  });
  document.querySelectorAll("[data-role]").forEach((button) => {
    button.classList.toggle("active", button.dataset.role === state.role);
    button.onclick = () => {
      state.role = button.dataset.role;
      state.menuKey = "";
      navigate(state.role === "admin" ? "admin" : state.role);
      toast(`${button.textContent} 홈으로 이동했습니다.`);
    };
  });
  document.querySelectorAll("[data-open-dialog]").forEach((button) => {
    button.onclick = () => openDialog(button.dataset.openDialog);
  });
  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.onclick = () => {
      state.adminTab = button.dataset.adminTab;
      state.menuKey = "";
      render();
    };
  });
  document.querySelectorAll("[data-bulk-tab]").forEach((button) => {
    button.onclick = () => {
      state.bulkTab = button.dataset.bulkTab;
      render();
    };
  });
  document.querySelectorAll("[data-demo-tab]").forEach((button) => {
    button.onclick = () => {
      button.parentElement.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
      button.classList.add("active");
    };
  });
  document.querySelectorAll("[data-author-type]").forEach((button) => {
    button.onclick = () => {
      document.querySelectorAll("[data-author-type]").forEach((tab) => tab.classList.remove("active"));
      button.classList.add("active");
      document.getElementById("questionEditor").innerHTML = questionEditor(button.dataset.authorType);
    };
  });
  const loginButton = document.getElementById("loginButton");
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      const role = document.getElementById("loginRole").value;
      state.role = role;
      navigate(role === "admin" ? "admin" : role);
      toast("로그인 후 권한별 홈으로 이동했습니다.");
    });
  }
  const autosaveButton = document.getElementById("autosaveButton");
  if (autosaveButton) autosaveButton.addEventListener("click", () => toast("답안이 임시저장/자동저장되었습니다."));
  const upload = document.getElementById("bulkUpload");
  if (upload) {
    upload.addEventListener("change", () => {
      const uploadStatus = document.getElementById("uploadStatus");
      const uploadedFiles = document.getElementById("uploadedFiles");
      const processResults = document.getElementById("processResults");
      uploadStatus.textContent = upload.files.length ? `${upload.files[0].name} 업로드 성공, 1건 실패 검토 필요` : "업로드 파일 없음";
      if (uploadedFiles) uploadedFiles.innerHTML = upload.files.length ? `<span>${upload.files[0].name}</span>${statusBadge("처리중")}` : "<span>대기 중인 업로드 파일 없음</span>";
      if (processResults && upload.files.length) {
        processResults.insertAdjacentHTML("afterbegin", `<div class="result-item"><span>${upload.files[0].name} 검증 결과</span>${statusBadge("환불요청")}</div>`);
      }
      toast("파일 업로드 처리 결과가 갱신되었습니다.");
    });
  }
  const excelButton = document.getElementById("excelButton");
  if (excelButton) excelButton.addEventListener("click", () => toast("엑셀파일 생성 작업이 등록되었습니다."));
  const downloadButton = document.getElementById("downloadButton");
  if (downloadButton) downloadButton.addEventListener("click", () => toast("파일 다운로드를 준비했습니다."));
  const checkAllButton = document.getElementById("checkAllButton");
  if (checkAllButton) checkAllButton.addEventListener("click", () => toast("plan.md 체크리스트 기준 구현 항목을 확인했습니다."));
}

function render() {
  const route = routes[state.route] || routes.home;
  document.getElementById("pageTitle").textContent = route.title;
  renderRoleMenu();
  document.getElementById("app").innerHTML = route.render();
  bindEvents();
}

document.getElementById("globalSearch").addEventListener("input", (event) => {
  state.search = event.target.value;
});

window.addEventListener("hashchange", () => {
  if (state.skipHashSync) {
    state.skipHashSync = false;
    return;
  }
  state.route = location.hash.replace("#", "") || "home";
  syncRoleFromRoute(state.route);
  render();
});

syncRoleFromRoute(state.route);
render();
