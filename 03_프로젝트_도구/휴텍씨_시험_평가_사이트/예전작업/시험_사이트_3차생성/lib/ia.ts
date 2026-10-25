export const roleMenus = {
  candidate: [
    ["시험 접수/응시", "/candidate"],
    ["시험 결과", "/candidate/results"],
    ["자격증 신청", "/candidate/certificates"],
    ["결제 내역", "/candidate/payments"]
  ],
  author: [
    ["출제자 홈", "/author"],
    ["출제내역", "/author/items"],
    ["문제 작성", "/author/items#editor"],
    ["반려 재제출", "/author/items#revision"]
  ],
  grader: [
    ["채점자 홈", "/grader/scoring"],
    ["채점 대상", "/grader/scoring"],
    ["개별 채점", "/grader/scoring#score"],
    ["평가서", "/grader/scoring#report"]
  ],
  admin: [
    ["대시보드", "/admin"],
    ["회원/전문가", "/admin#members"],
    ["시험/일정", "/admin#exams"],
    ["출제/채점", "/admin#authoring"],
    ["결제/정산", "/admin#payments"],
    ["자격증", "/admin#certificates"],
    ["대량관리", "/admin#bulk"]
  ]
} as const;
