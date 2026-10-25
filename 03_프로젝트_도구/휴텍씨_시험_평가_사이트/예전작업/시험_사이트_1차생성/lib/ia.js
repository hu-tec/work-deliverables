export const roles = {
  candidate: {
    label: "수험생",
    home: "/candidate",
    menus: ["시험관리", "자격증관리", "결제관리", "마이페이지", "고객센터"],
    menuLinks: {
      시험관리: "/candidate/exams/register",
      자격증관리: "/candidate/certificates",
      결제관리: "/candidate/payments",
      마이페이지: "/candidate/mypage",
      고객센터: "/candidate/support"
    }
  },
  author: {
    label: "출제자",
    home: "/author",
    menus: ["출제관리", "시험관리", "자료관리", "마이페이지", "고객센터"],
    menuLinks: {
      출제관리: "/author/items",
      시험관리: "/author/exams",
      자료관리: "/author/resources",
      마이페이지: "/author/mypage",
      고객센터: "/author/support"
    }
  },
  grader: {
    label: "채점자",
    home: "/grader",
    menus: ["채점관리", "시험관리", "자료관리", "마이페이지", "고객센터"],
    menuLinks: {
      채점관리: "/grader/scoring",
      시험관리: "/grader/exams",
      자료관리: "/grader/resources",
      마이페이지: "/grader/mypage",
      고객센터: "/grader/support"
    }
  },
  admin: {
    label: "관리자",
    home: "/admin",
    menus: [
      "회원관리",
      "시험관리",
      "출제관리",
      "채점관리",
      "결과관리",
      "자격증관리",
      "결제관리",
      "고객센터",
      "통계관리",
      "시스템관리"
    ],
    menuLinks: {
      회원관리: "/admin/members",
      시험관리: "/admin/exams/new",
      출제관리: "/admin/items",
      채점관리: "/admin/scoring",
      결과관리: "/admin/results",
      자격증관리: "/admin/certificates",
      결제관리: "/admin/payments",
      고객센터: "/admin/support",
      통계관리: "/admin/statistics",
      시스템관리: "/admin/system"
    }
  }
};

export const routes = [
  { path: "/login", title: "로그인", roles: ["guest"], designSource: "../../figma_pdf/2024/로그인.pdf" },
  { path: "/signup", title: "회원가입", roles: ["guest"], designSource: "../../figma_pdf/2024/회원가입.pdf" },
  { path: "/find-id", title: "아이디 찾기", roles: ["guest"], designSource: "../../figma_pdf/2024/아이디찾기.pdf" },
  { path: "/reset-password", title: "비밀번호 재설정", roles: ["guest"], designSource: "../../figma_pdf/2024/비밀번호찾기.pdf" },
  { path: "/admin", title: "관리자 홈", roles: ["admin"], designSource: "../../figma_pdf/2024/관리자 홈.png" },
  { path: "/admin/members", title: "회원관리", roles: ["admin"], designSource: "../../figma_pdf/2024/회원관리.pdf" },
  { path: "/admin/members/1", title: "회원 상세", roles: ["admin"], designSource: "../../figma_pdf/2024/회원관리_상세_전체.pdf" },
  { path: "/admin/exams/new", title: "시험관리 신규", roles: ["admin"], designSource: "../../figma_pdf/2024/시험관리_신규.pdf" },
  { path: "/candidate", title: "수험생 홈", roles: ["candidate"], designSource: "../../figma_pdf/2024/목록_시험접수.pdf" },
  { path: "/candidate/exams/register", title: "시험접수", roles: ["candidate"], designSource: "../../figma_pdf/2024/목록_시험접수.pdf" },
  { path: "/candidate/exams/take", title: "시험응시", roles: ["candidate"], designSource: "../../figma_pdf/2024/목록_시험응시.pdf" },
  { path: "/candidate/results", title: "시험결과", roles: ["candidate"], designSource: "../../figma_pdf/2024/목록_시험결과.pdf" },
  { path: "/author", title: "출제자 홈", roles: ["author"], designSource: "../../figma_pdf/2024/출제관리.pdf" },
  { path: "/author/items", title: "출제관리", roles: ["author"], designSource: "../../figma_pdf/2024/출제관리.pdf" },
  { path: "/grader", title: "채점자 홈", roles: ["grader"], designSource: "../../figma_pdf/2024/채점자 홈.png" },
  { path: "/grader/scoring", title: "채점관리", roles: ["grader"], designSource: "../../figma_pdf/2024/채점관리.pdf" }
];

export function canAccess(role, path) {
  const route = routes.find((item) => item.path === path);
  return Boolean(route && route.roles.includes(role));
}
