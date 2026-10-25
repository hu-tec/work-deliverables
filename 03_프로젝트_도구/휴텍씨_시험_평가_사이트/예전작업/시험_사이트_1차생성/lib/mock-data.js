export const members = [
  { id: "M-1001", name: "김민서", email: "minseo@example.com", role: "수험생", status: "approved", joinedAt: "2024-04-18" },
  { id: "M-1002", name: "박지훈", email: "jihun@example.com", role: "출제자", status: "pending", joinedAt: "2024-04-21" },
  { id: "M-1003", name: "이서연", email: "seoyeon@example.com", role: "채점자", status: "approved", joinedAt: "2024-05-02" },
  { id: "M-1004", name: "최유진", email: "yujin@example.com", role: "수험생", status: "stopped", joinedAt: "2024-05-09" }
];

export const exams = [
  { id: "E-2401", title: "AI 번역 능력평가", type: "번역", status: "waiting", period: "2024-06-01 ~ 2024-06-07" },
  { id: "E-2402", title: "프롬프트 작성 실무", type: "프롬프트", status: "approved", period: "2024-06-10 ~ 2024-06-14" },
  { id: "E-2403", title: "단답형 기초 평가", type: "단답형", status: "complete", period: "2024-05-01 ~ 2024-05-02" }
];

export const payments = [
  { id: "P-3001", name: "AI 번역 능력평가", amount: "80,000원", status: "paid", paidAt: "2024-05-11" },
  { id: "P-3002", name: "프롬프트 작성 실무", amount: "120,000원", status: "refunded", paidAt: "2024-05-13" }
];
