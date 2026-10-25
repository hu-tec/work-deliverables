// 역할 정의 + 역할별 사이드바 메뉴 (2024 IA, 권한설정: 응시자/전문가=출제자/관리자)

export type Role = "guest" | "examinee" | "author" | "grader" | "admin";

export interface RoleMeta {
  key: Role;
  label: string;
  short: string;
  desc: string;
  home: string; // 역할 진입 경로
  accent: string; // 역할 식별 색 (디자인 토큰)
}

export const ROLES: Record<Role, RoleMeta> = {
  guest: {
    key: "guest",
    label: "게스트",
    short: "게스트",
    desc: "로그인 전 서비스 소개 · 시험 안내",
    home: "/",
    accent: "var(--ds-color-text-muted)",
  },
  examinee: {
    key: "examinee",
    label: "수험생",
    short: "수험생",
    desc: "시험 접수 · 결제 · 응시 · 결과 · 자격증",
    home: "/examinee",
    accent: "var(--ds-color-brand-primary)",
  },
  author: {
    key: "author",
    label: "출제자(전문가)",
    short: "출제자",
    desc: "문제 작성 · 임시저장 · 제출 · 반려 수정",
    home: "/author",
    accent: "var(--ds-color-brand-secondary)",
  },
  grader: {
    key: "grader",
    label: "채점자",
    short: "채점자",
    desc: "배정 답안 채점 · 피드백 · 채점내역",
    home: "/grader",
    accent: "var(--ds-color-accent-success)",
  },
  admin: {
    key: "admin",
    label: "관리자",
    short: "관리자",
    desc: "회원 · 시험 · 문제 · 채점 · 결제 · 운영 · 통계",
    home: "/admin",
    accent: "var(--ds-color-accent-warning)",
  },
};

export interface MenuItem {
  label: string;
  href: string;
  icon: string; // 이모지 아이콘 (가벼운 식별용)
  ready?: boolean; // 이번 회차 구현 여부
}

export interface MenuGroup {
  group: string;
  items: MenuItem[];
}

// 역할별 사이드바 메뉴. ready:false 는 다음 회차 예정(프레임은 노출, 클릭 시 안내).
export const ROLE_MENUS: Record<Role, MenuGroup[]> = {
  guest: [
    {
      group: "안내",
      items: [
        { label: "서비스 소개", href: "/", icon: "🏠", ready: true },
        { label: "시험 안내", href: "/#exams", icon: "📋", ready: true },
        { label: "역할 진입", href: "/#roles", icon: "🚪", ready: true },
      ],
    },
  ],
  examinee: [
    {
      group: "내 시험",
      items: [
        { label: "대시보드", href: "/examinee", icon: "📊", ready: true },
        { label: "시험 접수", href: "/examinee/exams", icon: "📝", ready: true },
        { label: "내 접수/결제", href: "/examinee/applications", icon: "💳", ready: true },
        { label: "시험 응시", href: "/examinee/take", icon: "✍️", ready: true },
        { label: "시험 결과", href: "/examinee/results", icon: "🎯", ready: true },
        { label: "자격증 신청", href: "/examinee/certificate", icon: "🏅", ready: true },
      ],
    },
    {
      group: "지원",
      items: [
        { label: "1:1 문의", href: "/examinee/inquiry", icon: "💬", ready: true },
        { label: "내 정보", href: "/examinee/profile", icon: "👤", ready: true },
      ],
    },
  ],
  author: [
    {
      group: "출제",
      items: [
        { label: "출제자 홈", href: "/author", icon: "📊", ready: true },
        { label: "시험 출제하기", href: "/author/create", icon: "🖊️", ready: false },
        { label: "출제 내역", href: "/author/history", icon: "📚", ready: false },
        { label: "전문가 프로필", href: "/author/profile", icon: "🎓", ready: false },
      ],
    },
  ],
  grader: [
    {
      group: "채점",
      items: [
        { label: "채점자 홈", href: "/grader", icon: "📊", ready: true },
        { label: "시험 채점하기", href: "/grader/score", icon: "✅", ready: false },
        { label: "채점 내역", href: "/grader/history", icon: "📚", ready: false },
      ],
    },
  ],
  admin: [
    {
      group: "운영",
      items: [
        { label: "관리자 홈", href: "/admin", icon: "📊", ready: true },
        { label: "회원관리", href: "/admin/members", icon: "👥", ready: false },
        { label: "시험관리", href: "/admin/exams", icon: "🗂️", ready: false },
        { label: "문제관리", href: "/admin/questions", icon: "❓", ready: false },
        { label: "채점관리", href: "/admin/scoring", icon: "📐", ready: false },
        { label: "결제/정산", href: "/admin/payments", icon: "💰", ready: false },
      ],
    },
    {
      group: "설정",
      items: [
        { label: "카테고리/분류", href: "/admin/categories", icon: "🏷️", ready: false },
        { label: "통합 항목사전", href: "/admin/dictionary", icon: "📖", ready: false },
        { label: "통계", href: "/admin/stats", icon: "📈", ready: false },
      ],
    },
  ],
};
