import {
  Bell,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  Search,
  ShieldCheck,
  ShoppingCart,
  UserCircle
} from "lucide-react";

export const headerIcons = { Bell, ShoppingCart, UserCircle };

export const metrics = [
  { label: "접수대기", value: "2", helper: "오늘 수치", tone: "bg-[#f0f7ff] text-[#0b63c5]" },
  { label: "응시가능", value: "1", helper: "오늘 수치", tone: "bg-[#eafbf3] text-[#0b8459]" },
  { label: "합격", value: "0", helper: "오늘 수치", tone: "bg-[#f5f2ff] text-[#5a47d9]" }
];

export const shortcuts = [
  {
    label: "시험접수",
    href: "/apply",
    description: "응시 가능한 회차와 급수를 확인합니다.",
    icon: ClipboardList
  },
  {
    label: "시험응시",
    href: "/take",
    description: "입장 가능한 시험장으로 이동합니다.",
    icon: GraduationCap
  },
  {
    label: "결과조회",
    href: "/results",
    description: "채점 상태와 합격 여부를 확인합니다.",
    icon: FileText
  },
  {
    label: "자격증 신청",
    href: "/certificate",
    description: "합격 후 발급과 재발급을 신청합니다.",
    icon: CheckCircle2
  }
];

export const progressSteps = [
  ["접수", "완료", true],
  ["결제", "완료", true],
  ["본인인증", "완료", true],
  ["응시", "입장 가능", false],
  ["결과", "예정", false]
] as const;

export const registrations = [
  {
    id: "HCT2401-01",
    appliedAt: "25.01.09",
    examAt: "25.02.02 10:00-16:00",
    round: "정시 25년 2차",
    subject: "AITe 번역 전문가",
    grade: "전문1급",
    language: "한국어 → English",
    payment: "완료",
    refund: "해당없음",
    ticket: "발급완료",
    score: "입력전",
    certificate: "미발급",
    inquiry: "미답변",
    action: "시험 입장",
    actionHref: "/take",
    scoreClass: "text-slate-700"
  },
  {
    id: "HCT2402-11",
    appliedAt: "25.01.02",
    examAt: "25.01.20 13:00-18:00",
    round: "상시 25년 1차",
    subject: "AI 윤리",
    grade: "일반2급",
    language: "English → 한국어",
    payment: "완료",
    refund: "환불요청",
    ticket: "발급완료",
    score: "합격",
    certificate: "신청중",
    inquiry: "답변완료",
    action: "결과 보기",
    actionHref: "/results",
    scoreClass: "text-[#0b8459]"
  },
  {
    id: "HCT2403-07",
    appliedAt: "24.12.21",
    examAt: "25.01.05 09:00-12:00",
    round: "정시 25년 1차",
    subject: "프롬프트 실무",
    grade: "초보1급",
    language: "한국어",
    payment: "환불완료",
    refund: "연기 1회",
    ticket: "미발급",
    score: "불합격",
    certificate: "해당없음",
    inquiry: "미답변",
    action: "문의",
    actionHref: "/inquiry",
    scoreClass: "text-rose-600"
  }
];

export const readiness = [
  { label: "본인인증", status: "완료", icon: ShieldCheck, danger: false },
  { label: "결제상태", status: "확인됨", icon: CreditCard, danger: false },
  { label: "응시환경", status: "점검 필요", icon: GraduationCap, danger: true },
  { label: "알림수신", status: "설정됨", icon: Bell, danger: false }
];

export const tableHeaders = [
  "수험번호",
  "접수일",
  "시험일",
  "차수",
  "종목",
  "등급",
  "언어",
  "결제상태",
  "환불/연기",
  "수험표",
  "성적",
  "자격증",
  "문의상태",
  "액션"
];

export const utilityIcons = { CalendarDays, CircleHelp, Search };
