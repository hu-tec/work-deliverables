export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export function isLocale(locale: unknown): locale is Locale {
  return typeof locale === "string" && locales.includes(locale as Locale);
}

const ko = {
  nav: {
    logo: "LOGO",
    apply: "시험접수",
    take: "시험응시",
    results: "결과조회",
    certificate: "자격증",
    orders: "결제내역",
    inquiry: "고객센터",
    expert: "출제자",
    grader: "채점자",
    admin: "운영자",
    login: "로그인",
    mypage: "마이페이지"
  },
  home: {
    breadcrumb: "홈 > 시험 플랫폼",
    title: "시험 접수부터 응시, 결과 확인까지 바로 진행하세요",
    description: "수험번호로 내 시험을 찾고, 입장 가능 상태와 준비 항목을 확인한 뒤 시험장으로 이동합니다.",
    examNumber: "수험번호 또는 접수번호",
    identity: "이름 또는 생년월일",
    findExam: "내 시험 찾기",
    enter: "시험장 입장",
    apply: "시험 접수",
    result: "결과 조회",
    todayExam: "오늘 입장 가능한 시험",
    examName: "AITe 번역 전문가",
    examLevel: "전문1급 · 1교시",
    remain: "남은시간",
    time: "시험시간",
    language: "언어",
    status: "상태",
    ready: "입장가능"
  }
};

const en = {
  nav: {
    logo: "LOGO",
    apply: "Apply",
    take: "Take exam",
    results: "Results",
    certificate: "Certificate",
    orders: "Payments",
    inquiry: "Support",
    expert: "Author",
    grader: "Grader",
    admin: "Admin",
    login: "Log in",
    mypage: "My page"
  },
  home: {
    breadcrumb: "Home > Exam platform",
    title: "Apply, take exams, and check results in one place",
    description: "Find your exam by registration number, verify entry status and readiness, then move to the exam room.",
    examNumber: "Exam or registration number",
    identity: "Name or birth date",
    findExam: "Find my exam",
    enter: "Enter exam room",
    apply: "Apply",
    result: "View results",
    todayExam: "Available exam today",
    examName: "AITe Translation Expert",
    examLevel: "Professional 1 · Session 1",
    remain: "Remaining",
    time: "Time",
    language: "Language",
    status: "Status",
    ready: "Entry open"
  }
};

export const dictionaries = { ko, en };
