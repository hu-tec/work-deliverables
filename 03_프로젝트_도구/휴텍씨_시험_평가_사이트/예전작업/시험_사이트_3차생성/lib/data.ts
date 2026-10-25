export type Status =
  | "접수중"
  | "접수완료"
  | "결제대기"
  | "결제완료"
  | "응시가능"
  | "응시중"
  | "제출완료"
  | "채점중"
  | "합격"
  | "불합격"
  | "발급대기"
  | "발급완료"
  | "임시저장"
  | "검수중"
  | "반려"
  | "승인"
  | "승인대기"
  | "처리중"
  | "완료";

export const exams = [
  { id: "EX-2401", title: "AI번역 일반 2급", round: "28회", grade: "일반 2급", type: "번역형", date: "2026-06-12 10:00", fee: 5000, status: "접수중" as Status },
  { id: "EX-2402", title: "프롬프트 교육 3급", round: "14회", grade: "교육 3급", type: "프롬프트형", date: "2026-06-19 14:00", fee: 4000, status: "접수중" as Status },
  { id: "EX-2403", title: "윤리시험 교육 1급", round: "9회", grade: "교육 1급", type: "단답형", date: "2026-06-22 09:30", fee: 2000, status: "접수완료" as Status },
  { id: "EX-2404", title: "음성영상 번역 전문 2급", round: "6회", grade: "전문 2급", type: "음성/영상", date: "2026-07-03 10:00", fee: 5000, status: "응시가능" as Status },
  { id: "EX-2405", title: "웹툰 번역 일반 1급", round: "11회", grade: "일반 1급", type: "웹툰 번역", date: "2026-07-10 13:00", fee: 5000, status: "채점중" as Status }
];

export const authorItems = [
  { id: "Q-501", exam: "AI번역 일반 2급", type: "번역형", title: "민사 준비서면 영한 번역", status: "임시저장" as Status, score: 30, updatedAt: "2026-05-26 13:20" },
  { id: "Q-502", exam: "프롬프트 교육 3급", type: "프롬프트형", title: "법률 문서 요약 프롬프트", status: "검수중" as Status, score: 40, updatedAt: "2026-05-27 09:10" },
  { id: "Q-503", exam: "윤리시험 교육 1급", type: "단답형", title: "개인정보 처리 원칙", status: "반려" as Status, score: 10, updatedAt: "2026-05-28 16:40" }
];

export const gradingJobs = [
  { id: "GR-101", exam: "AI번역 일반 2급", type: "번역형", candidate: "김민서", answer: "The parties agree to maintain confidentiality...", status: "처리중" as Status, score: 0 },
  { id: "GR-102", exam: "프롬프트 교육 3급", type: "프롬프트형", candidate: "박지훈", answer: "계약 리스크를 표로 요약하는 프롬프트를 작성했습니다.", status: "처리중" as Status, score: 0 },
  { id: "GR-103", exam: "윤리시험 교육 1급", type: "단답형", candidate: "이서연", answer: "개인정보 최소 수집, 목적 외 이용 금지", status: "완료" as Status, score: 88 }
];

export const members = [
  ["U-1001", "김민서", "수험생", "정식회원", "서울", "승인"],
  ["U-1002", "박지훈", "수험생", "일반회원", "부산", "승인"],
  ["A-2001", "윤서진", "출제자", "전문가", "법률", "승인대기"],
  ["A-2002", "백도현", "출제자", "고급전문가", "AI", "승인"],
  ["G-3001", "남지호", "채점자", "전문가", "번역", "승인"],
  ["M-4001", "관리자01", "관리자", "슈퍼관리자", "본부", "승인"]
];

export const payments = [
  ["P-7001", "AI번역 일반 2급", "카드", "5,000", "결제완료", "정산대기"],
  ["P-7002", "프롬프트 교육 3급", "포인트", "4,000", "결제완료", "정산완료"],
  ["P-7003", "전문가 견적 요청", "구독", "월 10,000", "승인대기", "정산대기"],
  ["P-7004", "웹툰 번역 일반 1급", "카드", "5,000", "환불요청", "보류"]
];

export const categories = [
  ["문서", "비즈니스", "사업계획서"],
  ["문서", "법률", "소송장"],
  ["음성", "관광가이드", "안내 방송"],
  ["영상/SNS", "미디어/장르", "유튜브"],
  ["IT/개발", "개발/보안", "AI"],
  ["번역", "통번역 방식", "동시통역"]
];
