import Link from "next/link";
import {
  Award,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  FileCheck,
  FileText,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Printer,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Ticket,
  UserCheck,
  UserCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GradingWorkbench } from "@/components/grading-workbench";
import { InquiryDetail, InquiryWorkspace as InquiryClientWorkspace } from "@/components/inquiry-workspace";
import { Input } from "@/components/ui/input";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { NotificationSettings } from "@/components/notification-settings";
import { TakeQuestionTabs } from "@/components/take-question-tabs";
import { ThemeSettings, ThemeSync } from "@/components/theme-settings";
import { cn } from "@/lib/utils";
import { type Locale } from "@/lib/i18n";

type PageKey =
  | "apply"
  | "take"
  | "results"
  | "certificate"
  | "orders"
  | "inquiry"
  | "expert"
  | "grader"
  | "admin"
  | "login"
  | "mypage"
  | "profile"
  | "notifications"
  | "terms"
  | "privacy";

type PageConfig = {
  key: PageKey;
  route: string;
  title: string;
  eyebrow: string;
  description: string;
  section: "candidate" | "expert" | "grader" | "admin" | "plain";
};

const pageMap: Record<PageKey, PageConfig> = {
  apply: {
    key: "apply",
    route: "apply",
    title: "시험접수",
    eyebrow: "마이페이지",
    description: "약관동의부터 접수완료까지 7단계 접수 플로우와 결제 상태를 확인합니다.",
    section: "candidate"
  },
  take: {
    key: "take",
    route: "take",
    title: "시험응시",
    eyebrow: "마이페이지",
    description: "시험 정보, 남은 시간, 문제 탭, 원문·AI 번역·답안지 패널을 함께 제공합니다.",
    section: "candidate"
  },
  results: {
    key: "results",
    route: "results",
    title: "결과조회",
    eyebrow: "마이페이지",
    description: "채점 결과, 점수 분포, 성적 공개일, 이의신청 상태를 한 화면에서 확인합니다.",
    section: "candidate"
  },
  certificate: {
    key: "certificate",
    route: "certificate",
    title: "자격증 신청/출력",
    eyebrow: "마이페이지",
    description: "합격 후 자격증 신청, 채번, 출력, 재발급 요청 상태를 추적합니다.",
    section: "candidate"
  },
  orders: {
    key: "orders",
    route: "orders",
    title: "주문내역",
    eyebrow: "주문/결제 완료",
    description: "주문, 결제완료, 견적요청, 다운로드 상태를 확인합니다.",
    section: "candidate"
  },
  inquiry: {
    key: "inquiry",
    route: "inquiry",
    title: "1:1 문의",
    eyebrow: "수험자 지원센터",
    description: "문의 작성, 상태 검색, 답변 확인을 한 화면에서 처리합니다.",
    section: "candidate"
  },
  expert: {
    key: "expert",
    route: "expert",
    title: "전문가 대시보드",
    eyebrow: "특수전문가 업무",
    description: "출제, 검토, 채점 요청을 한 화면에서 파악하고 다음 작업으로 이동합니다.",
    section: "expert"
  },
  grader: {
    key: "grader",
    route: "grader",
    title: "채점자 대시보드",
    eyebrow: "채점자",
    description: "배정 상태, 리스크, 재검토 요청을 확인하고 채점 업무를 바로 시작합니다.",
    section: "grader"
  },
  admin: {
    key: "admin",
    route: "admin",
    title: "운영 컨트롤타워",
    eyebrow: "관리자",
    description: "접수부터 결제, 환불, 문의까지 운영 리스크를 조정합니다.",
    section: "admin"
  },
  login: {
    key: "login",
    route: "login",
    title: "로그인",
    eyebrow: "계정",
    description: "수험자, 출제자, 채점자, 운영자 계정으로 시험 포털에 진입합니다.",
    section: "plain"
  },
  mypage: {
    key: "mypage",
    route: "mypage",
    title: "마이페이지",
    eyebrow: "계정",
    description: "접수, 응시, 결과, 자격증, 문의 상태를 요약합니다.",
    section: "candidate"
  },
  profile: {
    key: "profile",
    route: "profile",
    title: "프로필 관리",
    eyebrow: "마이페이지",
    description: "개인정보, 연락처, 수험자 기본 정보를 관리합니다.",
    section: "candidate"
  },
  notifications: {
    key: "notifications",
    route: "notifications",
    title: "알림 설정",
    eyebrow: "마이페이지",
    description: "시험 일정, 결제, 결과 발표, 문의 답변 알림 수신 방식을 설정합니다.",
    section: "candidate"
  },
  terms: {
    key: "terms",
    route: "terms",
    title: "이용약관",
    eyebrow: "정책",
    description: "시험 포털 이용 조건과 응시자 준수사항을 확인합니다.",
    section: "plain"
  },
  privacy: {
    key: "privacy",
    route: "privacy",
    title: "개인정보보호정책",
    eyebrow: "정책",
    description: "시험 운영을 위한 개인정보 수집, 이용, 보관 기준을 확인합니다.",
    section: "plain"
  }
};

const rolePageMap: Record<string, PageConfig> = {
  "expert/submissions": {
    key: "expert",
    route: "expert/submissions",
    title: "제출목록",
    eyebrow: "전문가페이지",
    description: "전문가에게 배정된 출제/채점 제출 건과 마감 상태를 검색합니다.",
    section: "expert"
  },
  "expert/grading": {
    key: "expert",
    route: "expert/grading",
    title: "번역채점",
    eyebrow: "전문가페이지",
    description: "응시자별 번역 답안, AI 점수, 휴먼 검수 점수를 한 화면에서 처리합니다.",
    section: "expert"
  },
  "expert/settlements": {
    key: "expert",
    route: "expert/settlements",
    title: "전문가 정산",
    eyebrow: "전문가페이지",
    description: "출제와 채점 수수료를 월별로 확인하고 정산 상태를 전환합니다.",
    section: "expert"
  },
  "expert/profile": {
    key: "expert",
    route: "expert/profile",
    title: "전문가 프로필",
    eyebrow: "전문가페이지",
    description: "전문 분야, 검수 가능 언어, 정산 계좌, 공개 프로필을 관리합니다.",
    section: "expert"
  },
  "grader/workbench": {
    key: "grader",
    route: "grader/workbench",
    title: "채점 워크벤치",
    eyebrow: "채점자",
    description: "배정 답안을 열고 AI 점수, 기준표, 검수 코멘트를 함께 저장합니다.",
    section: "grader"
  },
  "admin/grading": {
    key: "admin",
    route: "admin/grading",
    title: "채점관리",
    eyebrow: "관리자",
    description: "AI 채점, 휴먼 검수, 보류/재검토 큐를 운영자 관점에서 관리합니다.",
    section: "admin"
  },
  "admin/inquiries": {
    key: "admin",
    route: "admin/inquiries",
    title: "문의관리",
    eyebrow: "관리자",
    description: "문의 접수, 배정, SLA, 답변 상태를 운영자 그리드에서 일괄 관리합니다.",
    section: "admin"
  },
  "admin/payments": {
    key: "admin",
    route: "admin/payments",
    title: "결제내역",
    eyebrow: "관리자",
    description: "승인, 취소, 환불, 정산 대상을 운영자 기준으로 검색하고 검증합니다.",
    section: "admin"
  }
};

const nav = [
  ["시험접수", "apply"],
  ["시험응시", "take"],
  ["결과조회", "results"],
  ["자격증", "certificate"],
  ["결제내역", "orders"],
  ["고객센터", "inquiry"]
] as const;

const candidateSide = [
  ["시험접수", "apply"],
  ["시험응시", "take"],
  ["시험결과", "results"],
  ["자격증 신청", "certificate"],
  ["결제 내역", "orders"],
  ["프로필 관리", "profile"],
  ["알림 설정", "notifications"],
  ["1:1 문의", "inquiry"]
] as const;

const takeQuestions = [
  {
    number: 1,
    title: "태국 여행 기획서",
    instruction: "다음 한국어 기획 문장을 영어로 번역하고, 관광 상품 소개문으로 자연스럽게 다듬으세요.",
    source: "1. 사업계획\n태국 방콕과 치앙마이를 연결하는 4박 5일 여행 상품을 기획합니다. 현지 문화 체험, 야시장 투어, 휴식 일정을 균형 있게 포함해 20~30대 직장인을 주요 고객으로 설정합니다.",
    aiTranslation: "Business plan: We plan a 5-day, 4-night travel package connecting Bangkok and Chiang Mai in Thailand. The main target customers are office workers in their 20s and 30s.",
    wordCount: "1,000자",
    progress: "0%"
  },
  {
    number: 2,
    title: "고객 안내 메일",
    instruction: "다음 한국어 안내문을 정중한 비즈니스 영어 이메일로 번역하세요.",
    source: "예약 확정 후 24시간 이내에 바우처가 이메일로 발송됩니다. 현지 사정으로 일정이 변경될 경우 담당자가 별도로 연락드릴 예정입니다.",
    aiTranslation: "The voucher will be sent by email within 24 hours after reservation confirmation. If the schedule changes due to local circumstances, the person in charge will contact you separately.",
    wordCount: "650자",
    progress: "15%"
  },
  {
    number: 3,
    title: "계약 조건 검토",
    instruction: "다음 영어 계약 조항을 한국어로 번역하고, 모호한 표현이 있으면 자연스럽게 정리하세요.",
    source: "The service provider shall notify the client of any material delay no later than three business days from the date on which such delay becomes reasonably foreseeable.",
    aiTranslation: "서비스 제공자는 그러한 지연이 합리적으로 예상되는 날짜로부터 영업일 기준 3일 이내에 고객에게 중대한 지연을 통지해야 합니다.",
    wordCount: "720자",
    progress: "40%"
  },
  {
    number: 4,
    title: "제품 소개문",
    instruction: "다음 한국어 제품 설명을 해외 온라인몰 상세 페이지에 맞는 영어 문장으로 번역하세요.",
    source: "이 무선 충전기는 스마트폰과 이어폰을 동시에 충전할 수 있으며, 과열 방지 센서와 미끄럼 방지 패드를 탑재했습니다.",
    aiTranslation: "This wireless charger can charge a smartphone and earbuds at the same time, and it includes an overheating prevention sensor and anti-slip pad.",
    wordCount: "580자",
    progress: "0%"
  },
  {
    number: 5,
    title: "공지사항 번역",
    instruction: "다음 한국어 공지사항을 간결하고 명확한 영어 공지문으로 번역하세요.",
    source: "시스템 점검으로 인해 5월 28일 오전 2시부터 5시까지 일부 서비스 이용이 제한됩니다. 점검 완료 후 모든 기능은 정상적으로 복구됩니다.",
    aiTranslation: "Some services will be unavailable from 2:00 a.m. to 5:00 a.m. on May 28 due to system maintenance. All features will be restored after the maintenance is complete.",
    wordCount: "500자",
    progress: "0%"
  },
  {
    number: 6,
    title: "보도자료 요약",
    instruction: "다음 영어 보도자료 문장을 한국어 기사체로 번역하세요.",
    source: "The company announced that its new AI-powered platform reduced document processing time by 42 percent during a three-month pilot program.",
    aiTranslation: "회사는 새로운 AI 기반 플랫폼이 3개월간의 파일럿 프로그램 동안 문서 처리 시간을 42% 줄였다고 발표했습니다.",
    wordCount: "620자",
    progress: "0%"
  },
  {
    number: 7,
    title: "사용자 리뷰",
    instruction: "다음 한국어 리뷰를 자연스러운 영어 사용자 후기 문장으로 번역하세요.",
    source: "처음에는 설정이 조금 복잡했지만, 고객센터 안내를 받고 나니 바로 사용할 수 있었습니다. 화면 구성이 직관적이라 만족합니다.",
    aiTranslation: "The setup was a little complicated at first, but I could use it right away after receiving guidance from customer service. I am satisfied because the screen layout is intuitive.",
    wordCount: "470자",
    progress: "0%"
  },
  {
    number: 8,
    title: "운영 매뉴얼",
    instruction: "다음 한국어 운영 지침을 명확한 영어 매뉴얼 문장으로 번역하세요.",
    source: "관리자는 매일 오전 9시 이전에 전일 접수 건을 확인하고, 결제 오류 또는 중복 신청 건을 별도 목록으로 분류해야 합니다.",
    aiTranslation: "The administrator must check the applications received on the previous day before 9 a.m. every day and classify payment errors or duplicate applications into a separate list.",
    wordCount: "540자",
    progress: "0%"
  }
] as const;

export function getPageConfig(slug: string[] | undefined): PageConfig {
  const route = slug?.join("/") ?? "mypage";
  if (rolePageMap[route]) {
    return rolePageMap[route];
  }
  const key = (slug?.[0] ?? "mypage") as PageKey;
  if (key === "inquiry" && slug?.[1]) {
    return {
      ...pageMap.inquiry,
      route,
      title: "문의 상세",
      description: "접수한 문의 내용과 답변 상태를 상세 확인합니다."
    };
  }
  return pageMap[key] ?? pageMap.mypage;
}

export function PortalPage({ locale, config }: { locale: Locale; config: PageConfig }) {
  if (config.key === "login") {
    return <LoginPage locale={locale} config={config} />;
  }

  return (
    <main className="min-h-screen bg-background text-slate-950">
      <ThemeSync />
      <PortalHeader locale={locale} config={config} />
      {config.section !== "plain" ? <SideNav locale={locale} config={config} /> : null}
      <section
        className={cn(
          "fixed bottom-[60px] right-0 top-[60px] overflow-auto",
          config.section === "plain" ? "left-0" : "left-[222px]"
        )}
      >
        <div className={cn("mx-auto w-full", config.section === "admin" ? "max-w-none px-3 py-3" : "max-w-[1248px] px-5 py-7")}>
          <Breadcrumb config={config} />
          <div className={cn("flex items-start justify-between gap-4", config.section === "admin" ? "mt-3" : "mt-7")}>
            <div>
              <h1 className={cn("font-black leading-tight tracking-normal text-slate-950", config.section === "admin" ? "text-2xl" : "text-[32px]")}>
                {config.title}
              </h1>
              <p className={cn("text-sm font-semibold text-slate-600", config.section === "admin" ? "mt-1 leading-5" : "mt-4 leading-6")}>{config.description}</p>
            </div>
          </div>
          <div className={cn(config.section === "admin" ? "mt-3" : "mt-6")}>{renderWorkspace(config, locale)}</div>
        </div>
      </section>
      <PortalFooter locale={locale} />
    </main>
  );
}

function PortalHeader({ locale, config }: { locale: Locale; config: PageConfig }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 grid h-[60px] grid-cols-[190px_minmax(0,1fr)_auto] items-center border-b border-[#dfe4ee] bg-white">
      <Link className="px-5 text-xl font-black tracking-normal text-slate-950" href={`/${locale}`}>
        LOGO
      </Link>
      <nav className="min-w-0 overflow-x-auto">
        <div className="flex items-center justify-center gap-2 px-3 text-sm font-black text-slate-800">
          {nav.map(([label, path]) => (
            <Link key={path} className="shrink-0 rounded-md px-2.5 py-1.5 hover:bg-[#eef5ff] hover:text-[#0788ff]" href={`/${locale}/${path}`}>
              {label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="flex items-center justify-end gap-4 pr-5 text-slate-950">
        <div className="flex items-center gap-1.5">
          {[
            ["출제자", "expert"],
            ["채점자", "grader"],
            ["운영자", "admin"]
          ].map(([label, path]) => {
            const active = config.section === path;
            return (
              <Link
                key={path}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-black transition-colors",
                  active
                    ? "border-[#0788ff] bg-[#0788ff] text-white"
                    : "border-[#d9dee8] text-slate-700 hover:border-[#0788ff] hover:text-[#0788ff]"
                )}
                href={`/${locale}/${path}`}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <NotificationDropdown locale={locale} />
        <ShoppingCart className="size-5 shrink-0" aria-hidden />
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#d7e9ff] text-[#0788ff]">
          <UserCircle className="size-6" aria-hidden />
        </span>
      </div>
    </header>
  );
}

function SideNav({ locale, config }: { locale: Locale; config: PageConfig }) {
  const role = config.section;
  const items =
    role === "expert"
      ? [["출제자 홈", "expert"], ["출제내역", "expert/submissions"], ["채점내역", "expert/grading"], ["정산내역", "expert/settlements"], ["전문가 프로필", "expert/profile"]]
      : role === "grader"
        ? [["채점자 홈", "grader"], ["채점 워크벤치", "grader/workbench"], ["출제자 채점", "expert/grading"], ["채점관리", "admin/grading"]]
        : role === "admin"
          ? [["운영 홈", "admin"], ["채점관리", "admin/grading"], ["문의관리", "admin/inquiries"], ["결제내역", "admin/payments"]]
          : candidateSide;
  const title = role === "expert" ? "전문가 페이지" : role === "grader" ? "채점자 페이지" : role === "admin" ? "운영자 페이지" : "마이페이지";
  const badge = role === "expert" ? "특수전문가" : role === "grader" ? "채점자" : role === "admin" ? "운영자" : "Premium";

  return (
    <aside className="fixed bottom-[60px] left-0 top-[60px] z-10 w-[222px] border-r border-[#e3e6f0] bg-[#f0f0fa]">
      <div className="grid justify-items-center px-5 pt-8">
        <div className="relative">
          <div className="size-20 overflow-hidden rounded-2xl bg-slate-300" />
          <span className={cn("absolute -bottom-3 left-1/2 inline-flex h-7 min-w-[72px] -translate-x-1/2 items-center justify-center whitespace-nowrap rounded px-2 text-xs font-black text-white", role === "expert" ? "bg-[#7a25ff]" : "bg-[#0788ff]")}>{badge}</span>
        </div>
        <div className="mt-7 text-base font-semibold text-slate-900">홍 길 동</div>
        <div className="mt-7 text-sm text-slate-400">로그아웃</div>
      </div>
      <div className="mx-5 mt-7 border-t border-[#d9deeb]" />
      <nav className="px-5 py-7">
        <div className="mb-5 text-xl font-black text-slate-950">{title}</div>
        <div className="grid gap-1">
          {items.map(([label, path]) => {
            const active = path === config.route || config.route.startsWith(`${path}/`);
            return (
              <Link key={path} className={cn("rounded-lg px-3 py-2.5 text-base font-semibold", active ? "bg-white text-[#0788ff]" : "text-slate-900 hover:bg-white/70")} href={`/${locale}/${path}`}>
                {label}
              </Link>
            );
          })}
        </div>
        <Link className={cn("mt-5 grid h-10 place-items-center rounded-lg text-base font-black text-white", role === "expert" ? "bg-[#0788ff]" : "bg-[#7a25ff]")} href={`/${locale}/${role === "candidate" ? "expert" : "mypage"}`}>
          {role === "candidate" ? "전문가 신청" : "마이페이지"}
        </Link>
      </nav>
      <div className="absolute bottom-5 left-0 right-0 text-center text-xs font-semibold text-slate-400">회원 탈퇴</div>
    </aside>
  );
}

function Breadcrumb({ config }: { config: PageConfig }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
      <span>홈</span>
      <span>&gt;</span>
      <span>{config.eyebrow}</span>
      <span>&gt;</span>
      <span className="text-slate-600">{config.title}</span>
    </div>
  );
}

function PortalFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 grid h-[60px] grid-cols-[1fr_auto_1fr] items-center border-t border-[#dfe4ee] bg-white px-8 text-xs text-slate-500">
      <span>CompanyName @ 202X. All rights reserved.</span>
      <span className="flex gap-8 text-sm font-semibold text-slate-900">
        <Link href={`/${locale}/terms`}>이용약관</Link>
        <Link href={`/${locale}/privacy`}>개인정보보호정책</Link>
      </span>
      <span className="text-right" />
    </footer>
  );
}

function renderWorkspace(config: PageConfig, locale: Locale) {
  switch (config.key) {
    case "apply":
      return <ApplyWorkspace />;
    case "take":
      return <TakeWorkspace />;
    case "results":
      return <ResultsWorkspace locale={locale} />;
    case "certificate":
      return <CertificateWorkspace locale={locale} />;
    case "orders":
      return <OrdersWorkspace />;
    case "inquiry":
      return <InquiryWorkspace locale={locale} route={config.route} />;
    case "expert":
      if (config.route === "expert/submissions") {
        return <ExpertSubmissionsWorkspace />;
      }
      if (config.route === "expert/grading") {
        return <GradingWorkbench role="expert" />;
      }
      if (config.route === "expert/settlements") {
        return <ExpertSettlementsWorkspace />;
      }
      if (config.route === "expert/profile") {
        return <ExpertProfileWorkspace />;
      }
      return <RoleDashboard type="expert" />;
    case "grader":
      if (config.route === "grader/workbench") {
        return <GradingWorkbench role="grader" />;
      }
      return <RoleDashboard type="grader" />;
    case "admin":
      if (config.route === "admin/grading") {
        return <AdminGradingWorkspace />;
      }
      if (config.route === "admin/inquiries") {
        return <AdminInquiryWorkspace />;
      }
      if (config.route === "admin/payments") {
        return <AdminPaymentsWorkspace />;
      }
      return <AdminWorkspace />;
    case "profile":
      return <ProfileWorkspace />;
    case "notifications":
      return <NotificationsWorkspace />;
    case "terms":
    case "privacy":
      return <PolicyWorkspace title={config.title} />;
    default:
      return <MypageWorkspace locale={locale} />;
  }
}

function Panel({ title, icon, children, className }: { title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("overflow-hidden rounded-lg border border-slate-200 bg-white", className)}>
      <div className="flex h-10 items-center gap-2 border-b border-slate-200 px-3 text-xs font-black">
        {icon}
        {title}
      </div>
      {children}
    </section>
  );
}

function FieldGrid({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="grid gap-2 p-3">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[82px_1fr] items-center rounded-md border border-slate-100 bg-slate-50 px-2 py-2">
          <span className="text-[11px] font-black text-slate-500">{label}</span>
          <span className="truncate text-sm font-semibold text-slate-900">{value}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ children, tone = "teal" }: { children: React.ReactNode; tone?: "teal" | "amber" | "rose" | "blue" | "slate" }) {
  const tones = {
    teal: "border-teal-200 bg-teal-50 text-teal-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    rose: "border-rose-200 bg-rose-50 text-rose-900",
    blue: "border-blue-200 bg-blue-50 text-blue-900",
    slate: "border-slate-200 bg-slate-50 text-slate-900"
  };
  return <span className={cn("inline-flex rounded border px-1.5 py-1 text-[10px] font-black", tones[tone])}>{children}</span>;
}

function ApplyWorkspace() {
  const steps = [
    ["약관동의", "개인정보/환불규정/응시 유의사항 동의", "완료"],
    ["응시자정보", "성명, 생년월일, 연락처, 지역 입력", "완료"],
    ["종목/등급선택", "AITe 번역시험 일반 2급 선택", "완료"],
    ["일정선택", "2026-05-28 14:00 CBT 일정 선택", "완료"],
    ["선택내역확인", "응시료, 시험일, 환불 가능 기한 확인", "완료"],
    ["결제", "신용카드 승인 요청 대기", "대기"],
    ["접수완료", "수험번호 발급 후 접수완료", "대기"]
  ];
  return (
    <div className="grid gap-3 xl:grid-cols-[320px_minmax(560px,1fr)_300px]">
      <div className="grid gap-3">
        <Panel title="응시자 입력">
          <FieldGrid rows={[["성명", "김소연"], ["생년월일", "1994-04-18"], ["휴대폰", "010-****-1122"], ["지역", "서울"], ["채널", "일반"]]} />
        </Panel>
        <Panel title="결제 항목" icon={<CreditCard className="size-4 text-slate-500" />}>
          <div className="grid gap-2 p-3">
            {[["시험료", "90,000원"], ["제출 수수료", "1,500원"], ["합계", "91,500원"]].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[1fr_auto] rounded-md border border-slate-100 bg-slate-50 px-2 py-2 text-xs font-black">
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="grid gap-3">
        <Panel title="선택 시험">
          <FieldGrid rows={[["시험", "AITe 번역시험"], ["회차", "aite-2406"], ["시험일", "2026-05-28 14:00"], ["시간", "90분"]]} />
        </Panel>
        <Panel title="접수 진행 상태" icon={<UserCheck className="size-4 text-slate-500" />}>
          <div className="divide-y divide-slate-100">
            {steps.map(([label, text, state], index) => (
              <div key={label} className="grid min-h-[52px] grid-cols-[28px_120px_1fr_auto] items-center px-3">
                <span className="grid size-5 place-items-center rounded-full bg-slate-950 text-[10px] font-black text-white">{index + 1}</span>
                <span className="text-xs font-black text-slate-800">{label}</span>
                <span className="truncate text-[11px] font-semibold text-slate-600">{text}</span>
                <StatusBadge tone={state === "완료" ? "teal" : "amber"}>{state}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <aside className="grid content-start gap-3">
        <Panel title="접수 액션" icon={<Ticket className="size-4 text-slate-500" />}>
          <div className="grid gap-2 p-3">
            <Button>결제 진행</Button>
            <Button variant="outline">접수 정보 수정</Button>
            <Button variant="outline">환불/연기 요청</Button>
          </div>
        </Panel>
        <DarkGuide title="접수 완료 기준" text="결제 승인 1분 뒤 수험번호가 발급되며, 결과조회 메뉴에서 접수 상태를 확인합니다." />
      </aside>
    </div>
  );
}

function TakeWorkspace() {
  return (
    <div className="grid gap-9">
      <div className="grid gap-3 xl:grid-cols-[1fr_400px]">
        <Panel title="수험자/문항 정보" className="min-h-[210px]">
          <div className="grid grid-cols-[178px_1fr]">
            <div className="grid content-center justify-items-center border-r border-[#d9dee8] px-6 py-8">
              <div className="size-20 rounded-2xl bg-slate-300" />
              <div className="mt-5 text-sm font-semibold text-slate-900">홍길동</div>
              <div className="mt-2 text-sm text-slate-700">abcde@gmail.com</div>
            </div>
            <div className="grid content-center px-8">
              <div className="text-sm font-semibold text-slate-600">번역 자격증 <span className="font-black text-[#0788ff]">전문1급</span></div>
              <h2 className="mt-4 text-2xl font-black text-slate-950">시험명이 나오는 영역</h2>
              <p className="mt-8 text-sm font-semibold text-slate-900"><b>A형</b> 태국 여행에 대해서 기획서를 작성해보시고.</p>
            </div>
          </div>
        </Panel>
        <Panel title="시험 시간">
          <div className="grid p-8">
            <div className="text-lg font-semibold text-slate-950">한국어 <span className="text-slate-400">&gt;</span> <span className="text-[#0788ff]">English</span></div>
            <div className="mt-5 grid grid-cols-[1fr_auto] items-center gap-5">
              <div className="grid gap-2 text-sm font-semibold text-slate-900"><span>검정과목</span><span>분야</span><span className="mt-5 text-[#0788ff]">09:00 ~ 09:15</span></div>
              <div className="grid size-20 place-items-center rounded-full border-[9px] border-[#0788ff] text-center text-xs font-semibold">1교시<br /><b className="text-base text-red-500">15:00</b></div>
            </div>
          </div>
        </Panel>
      </div>
      <TakeQuestionTabs questions={takeQuestions} />
    </div>
  );
}

function ExamColumn({ title, footer, tone, children }: { title: string; footer: string; tone: string; children: React.ReactNode }) {
  return (
    <section className="min-h-[420px] border-r border-[#d9dee8] bg-white last:border-r-0">
      <div className={cn("flex h-10 items-center justify-between border-b border-[#d9dee8] px-3 text-sm font-black", tone)}>{title}</div>
      <div className="min-h-[336px] p-3 text-sm leading-6 text-slate-900">{children}</div>
      <div className="h-9 border-t border-[#edf0f5] bg-[#f7f7f7] px-3 py-2 text-xs font-semibold text-slate-600">{footer}</div>
    </section>
  );
}

function ResultsWorkspace({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-3 xl:grid-cols-[300px_minmax(560px,1fr)_300px]">
      <Panel title="수험번호 조회" icon={<Search className="size-4 text-slate-500" />}>
        <div className="grid gap-2 p-3">
          <div className="rounded border border-slate-100 bg-slate-50 px-2 py-2 text-[11px] font-black text-slate-600">최근 조회 키: R-2406-0911</div>
        </div>
        <ResultList />
      </Panel>
      <div className="grid gap-3">
        <Panel title="선택 결과 상세" icon={<UserCircle className="size-4 text-slate-500" />}>
          <FieldGrid rows={[["지원자", "김소연"], ["총점", "86.5"], ["퍼센타일", "91P"], ["채점", "AI 84.2 + 휴먼 2.3"], ["상태", "합격"]]} />
        </Panel>
        <Panel title="성적 공개/이의" icon={<ClipboardCheck className="size-4 text-slate-500" />}>
          <FieldGrid rows={[["성적 발표일", "2026-05-30 10:00"], ["제출일", "2026-05-28 16:40"], ["이의신청", "5영업일 이내 가능"]]} />
        </Panel>
      </div>
      <aside className="grid content-start gap-3">
        <Panel title="점수 분포">
          <Bars rows={[["78~90점", "72%", "bg-blue-500"], ["60~77점", "36%", "bg-amber-500"], ["55점 미만", "18%", "bg-rose-500"]]} />
        </Panel>
        <DarkGuide title="결과 확인 다음 단계" text="합격자에 한해 자격증 메뉴에서 신청 상태를 확인하세요." href={`/${locale}/certificate`} label="자격증 조회로 이동" />
      </aside>
    </div>
  );
}

function ResultList() {
  return (
    <div className="divide-y divide-slate-100">
      {[["r-2406-0911", "AITe 번역시험", "91P", "합격", "teal"], ["r-2406-0912", "AITe 번역시험", "39P", "보류", "amber"], ["r-2402-0842", "AI 윤리 단답평가", "18P", "불합격", "rose"]].map(([id, exam, score, state, tone]) => (
        <button key={id} className="grid h-[64px] w-full grid-cols-[1fr_60px_72px] items-center gap-2 px-3 text-left hover:bg-slate-50">
          <span><span className="block text-xs font-black text-slate-900">{id}</span><span className="block text-[11px] text-slate-500">{exam}</span></span>
          <span className="text-[11px] font-black text-slate-700">{score}</span>
          <StatusBadge tone={tone as "teal" | "amber" | "rose"}>{state}</StatusBadge>
        </button>
      ))}
    </div>
  );
}

function CertificateWorkspace({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-3 xl:grid-cols-[300px_minmax(560px,1fr)_280px]">
      <Panel title="자격증 신청 목록" icon={<Search className="size-4 text-slate-500" />}>
        <div className="divide-y divide-slate-100">
          {[["김소연", "AITe 번역시험 · 24-06", "HC2406-00112", "출력완료"], ["박도윤", "AI 윤리 · 24-02", "HC2402-00019", "신청중"]].map(([name, desc, no, state]) => (
            <button key={no} className="grid h-[82px] w-full grid-cols-[1fr_auto] items-center px-3 text-left hover:bg-slate-50">
              <span><span className="block text-sm font-black">{name}</span><span className="block text-[11px] text-slate-500">{desc}</span></span>
              <StatusBadge tone={state === "출력완료" ? "teal" : "amber"}>{state}</StatusBadge>
            </button>
          ))}
        </div>
      </Panel>
      <div className="grid gap-3">
        <Panel title="신청 상태 상세" icon={<FileCheck className="size-4 text-slate-500" />}>
          <FieldGrid rows={[["신청자", "김소연"], ["시험", "AITe 번역시험"], ["요청일", "2026-05-31 09:05"], ["출력일", "2026-06-01 10:12"], ["상태", "출력완료"]]} />
        </Panel>
        <Panel title="출력 상태">
          <StepRows rows={[["신청접수", "완료"], ["채번생성", "완료"], ["증명서 출력", "완료"], ["문서 다운로드", "준비됨"]]} />
        </Panel>
      </div>
      <aside className="grid content-start gap-3">
        <Panel title="출력 동작" icon={<Printer className="size-4 text-slate-500" />}>
          <div className="grid gap-2 p-3"><Button variant="outline">출력물 PDF 다운로드</Button><Button variant="outline">출력 재요청</Button><Button variant="outline">자격증 재발급 신청</Button></div>
        </Panel>
        <DarkGuide title="자격증 유효 상태" text="출력 완료 후 QR 검증 가능, 분실 시 재발급 요청을 통해 재출력할 수 있습니다." href={`/${locale}/results`} label="결과조회로 돌아가기" />
      </aside>
    </div>
  );
}

function OrdersWorkspace() {
  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Panel title="주문 내역">
        <div className="divide-y divide-slate-100">
          {[["ORD-2025-0001", "AITe 번역 실전 문항팩 외 2건", "112,000원", "결제완료", "teal"], ["ORD-2025-0002", "AI 번역 비교 워크시트", "26,000원", "견적요청", "amber"]].map(([id, name, price, state, tone]) => (
            <article key={id} className="grid gap-2 px-3 py-3 md:grid-cols-[140px_1fr_120px_96px] md:items-center">
              <span className="text-xs font-black text-slate-500">{id}</span><span className="text-sm font-black text-slate-950">{name}</span><span className="text-right text-xs font-black">{price}</span><StatusBadge tone={tone as "teal" | "amber"}>{state}</StatusBadge>
            </article>
          ))}
        </div>
      </Panel>
      <Panel title="주문 액션"><div className="grid gap-2 p-3"><Button variant="outline">영수증 재발급</Button><Button variant="outline">다운로드 준비</Button><Button variant="outline">환불 문의</Button></div></Panel>
    </div>
  );
}

function InquiryWorkspace({ locale, route }: { locale: Locale; route: string }) {
  const inquiryId = route.startsWith("inquiry/") ? decodeURIComponent(route.slice("inquiry/".length)) : null;

  if (inquiryId) {
    return <InquiryDetail locale={locale} inquiryId={inquiryId} />;
  }

  return <InquiryClientWorkspace locale={locale} />;
}

function RoleDashboard({ type }: { type: "expert" | "grader" }) {
  const rows = type === "expert" ? [["출제 요청", "12"], ["검토 대기", "4"], ["채점 요청", "9"], ["정산 예정", "310,000원"]] : [["배정 답안", "38"], ["마감 임박", "6"], ["재검토", "3"], ["평균 처리", "12분"]];
  return (
    <div className="grid gap-3">
      <section className="grid gap-3 md:grid-cols-4">{rows.map(([label, value]) => <Metric key={label} label={label} value={value} />)}</section>
      <div className="grid gap-3 xl:grid-cols-[1fr_360px]">
        <Panel title={type === "expert" ? "출제/검토 작업" : "채점 배정 목록"} icon={<BookOpenCheck className="size-4 text-slate-500" />}>
          <StepRows rows={(type === "expert" ? [["AITe 번역 문항 12건", "검토중"], ["AI 윤리 단답 8건", "승인대기"], ["프롬프트 실무 5건", "반려수정"]] : [["R-2406-0911", "채점중"], ["R-2406-0912", "재검토"], ["R-2402-0842", "대기"]])} />
        </Panel>
        <DarkGuide title="다음 작업" text={type === "expert" ? "검토 대기 문항을 먼저 처리하면 시험 공개 일정 지연을 줄일 수 있습니다." : "마감 임박 답안을 우선 채점하고 재검토 사유를 남겨야 합니다."} />
      </div>
    </div>
  );
}

function ExpertSubmissionsWorkspace() {
  return (
    <div className="grid gap-3">
      <div className="grid gap-2 rounded-lg border border-slate-200 bg-white p-2 md:grid-cols-[minmax(220px,1fr)_auto_auto] md:items-center">
        <Input className="h-9" placeholder="키워드 검색" />
        <Button variant="outline" size="sm">채점대기</Button>
        <Button size="sm">검색</Button>
      </div>
      <DataTable
        headers={["제출번호", "작업", "상태", "마감", "수수료"]}
        rows={[
          ["SUB-2501", "웹툰 번역 24-07", "채점대기", "2026-05-21", "48,000원"],
          ["SUB-2502", "프롬프트 실무 24-05", "검수중", "2026-05-23", "52,000원"],
          ["SUB-2503", "AI 윤리 단답 24-03", "완료", "2026-05-16", "34,000원"]
        ]}
      />
    </div>
  );
}

function ExpertSettlementsWorkspace() {
  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
      <DataTable
        headers={["정산월", "출제", "채점", "상태", "금액"]}
        rows={[
          ["2026-05", "12건", "48건", "정산대기", "384,000원"],
          ["2026-04", "9건", "37건", "지급완료", "298,000원"]
        ]}
      />
      <Panel title="정산 액션">
        <div className="grid gap-2 p-3">
          <Button>정산 확정 mock</Button>
          <Button variant="outline">세금계산서 요청</Button>
          <Button variant="outline">정산 내역 다운로드</Button>
        </div>
      </Panel>
    </div>
  );
}

function ExpertProfileWorkspace() {
  return (
    <div className="grid gap-3 xl:grid-cols-[1fr_360px]">
      <Panel title="전문가 프로필">
        <FieldGrid
          rows={[
            ["전문 분야", "번역 · 영상 · 다큐멘터리"],
            ["가능 언어", "한국어, English, 日本語"],
            ["검수 방식", "AI 우선 + 휴먼 검증"],
            ["공개 상태", "공개"],
            ["정산 계좌", "국민 ****-12-3456"]
          ]}
        />
      </Panel>
      <Panel title="프로필 액션">
        <div className="grid gap-2 p-3">
          <Button>프로필 저장</Button>
          <Button variant="outline">증빙 서류 업로드</Button>
          <Button variant="outline">공개 미리보기</Button>
        </div>
      </Panel>
    </div>
  );
}

function AdminGradingWorkspace() {
  return (
    <div className="grid gap-2">
      <section className="grid gap-2 md:grid-cols-8 xl:grid-cols-12">
        {[
          ["AI 대기", "18", "전일 +4"],
          ["휴먼 검수", "12", "마감 6"],
          ["보류", "4", "위험"],
          ["재검토", "3", "요청"],
          ["확정", "91", "오늘"],
          ["평균", "14m", "처리"]
        ].map(([label, value, helper]) => (
          <AdminMetric key={label} label={label} value={value} helper={helper} />
        ))}
      </section>
      <div className="grid gap-2 xl:grid-cols-[minmax(0,1fr)_260px]">
        <AdminTable
          headers={["수험번호", "시험", "AI", "휴먼", "상태"]}
          rows={[
            ["HCT-2407-103", "AITe 번역시험", "82", "대기", "휴먼검수"],
            ["HCT-2407-119", "프롬프트 실무", "70", "68", "재검토"],
            ["HCT-2402-084", "AI 윤리", "91", "92", "확정"],
            ["HCT-2407-141", "웹툰 번역", "77", "대기", "휴먼검수"],
            ["HCT-2401-010", "AI 윤리", "56", "보류", "보류"],
            ["HCT-2406-221", "AITe 번역시험", "88", "89", "확정"],
            ["HCT-2406-301", "프롬프트 실무", "64", "대기", "재검토"]
          ]}
        />
        <AdminPanel title="운영 액션">
          <div className="grid gap-1.5 p-2">
            <Button className="h-8 text-xs">보류 해제</Button>
            <Button className="h-8 text-xs" variant="outline">채점자 재배정</Button>
            <Button className="h-8 text-xs" variant="outline">결과 확정</Button>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}

function AdminInquiryWorkspace() {
  return (
    <div className="grid gap-2">
      <section className="grid gap-2 md:grid-cols-8 xl:grid-cols-12">
        {[
          ["신규 문의", "24", "오늘"],
          ["미답변", "11", "SLA"],
          ["긴급", "3", "1h"],
          ["배정대기", "8", "운영"],
          ["답변완료", "67", "금일"],
          ["평균응답", "18m", "정상"],
          ["환불문의", "7", "정산"],
          ["장애문의", "5", "시험"],
          ["재문의", "4", "확인"],
          ["첨부검토", "6", "보안"],
          ["고객만족", "4.7", "평점"],
          ["마감위험", "2", "위험"]
        ].map(([label, value, helper]) => <AdminMetric key={label} label={label} value={value} helper={helper} />)}
      </section>
      <AdminPanel title="문의 검색">
        <div className="grid gap-2 p-2 md:grid-cols-[minmax(220px,1fr)_120px_120px_120px_auto] md:items-center">
          <Input className="h-8 text-xs" placeholder="문의번호, 이름, 제목 검색" />
          <Button className="h-8 text-xs" variant="outline">미답변</Button>
          <Button className="h-8 text-xs" variant="outline">긴급</Button>
          <Button className="h-8 text-xs" variant="outline">내 배정</Button>
          <Button className="h-8 text-xs">검색</Button>
        </div>
      </AdminPanel>
      <AdminPanel title="문의 처리 그리드" icon={<Search className="size-4 text-slate-500" />}>
        <AdminTable
          headers={["문의번호", "분류", "제목", "회원", "접수일", "SLA", "담당", "상태", "액션"]}
          rows={[
            ["INQ-2026-017", "결제", "영수증 사업자 정보 수정 요청", "김소연", "2026-05-20 09:12", "1h", "정산", "대기", "답변"],
            ["INQ-2026-016", "응시", "시험장 입장 버튼이 보이지 않음", "박도윤", "2026-05-20 08:44", "긴급", "시험운영", "보류", "확인"],
            ["INQ-2026-015", "환불", "중복 결제 건 환불 처리 문의", "이하나", "2026-05-19 17:31", "2h", "정산", "진행", "검토"],
            ["INQ-2026-014", "자격증", "자격증 PDF 재발급 요청", "최민준", "2026-05-19 15:20", "정상", "발급", "완료", "닫기"],
            ["INQ-2026-013", "채점", "이의신청 첨부파일 추가", "정유진", "2026-05-19 13:05", "4h", "채점팀", "재검토", "배정"],
            ["INQ-2026-012", "본인인증", "휴대폰 번호 변경 후 인증 실패", "오지훈", "2026-05-19 11:18", "3h", "운영1", "진행", "확인"],
            ["INQ-2026-011", "결제", "카드 승인 후 접수번호 미발급", "한서아", "2026-05-19 10:02", "긴급", "정산", "대기", "확인"],
            ["INQ-2026-010", "응시", "브라우저 호환성 문의", "문태경", "2026-05-18 18:44", "정상", "시험운영", "완료", "닫기"]
          ]}
        />
      </AdminPanel>
    </div>
  );
}

function AdminPaymentsWorkspace() {
  return (
    <div className="grid gap-2">
      <section className="grid gap-2 md:grid-cols-8 xl:grid-cols-12">
        {[
          ["승인완료", "98", "오늘"],
          ["승인대기", "6", "확인"],
          ["승인실패", "3", "재시도"],
          ["환불요청", "7", "대기"],
          ["환불완료", "12", "금일"],
          ["중복결제", "2", "위험"],
          ["정산대상", "84", "마감"],
          ["영수증", "31", "발급"],
          ["카드", "71", "승인"],
          ["계좌이체", "22", "확인"],
          ["쿠폰", "15", "차감"],
          ["총액", "9.8M", "원"]
        ].map(([label, value, helper]) => <AdminMetric key={label} label={label} value={value} helper={helper} />)}
      </section>
      <AdminPanel title="결제 검색">
        <div className="grid gap-2 p-2 md:grid-cols-[minmax(220px,1fr)_120px_120px_120px_auto] md:items-center">
          <Input className="h-8 text-xs" placeholder="주문번호, 수험번호, 승인번호 검색" />
          <Button className="h-8 text-xs" variant="outline">승인대기</Button>
          <Button className="h-8 text-xs" variant="outline">환불요청</Button>
          <Button className="h-8 text-xs" variant="outline">정산대상</Button>
          <Button className="h-8 text-xs">검색</Button>
        </div>
      </AdminPanel>
      <AdminPanel title="결제 검증 그리드" icon={<CreditCard className="size-4 text-slate-500" />}>
        <AdminTable
          headers={["주문번호", "수험번호", "상품", "회원", "결제수단", "승인금액", "승인일", "정산", "상태", "액션"]}
          rows={[
            ["ORD-2026-1048", "HCT-2407-103", "AITe 번역시험", "김소연", "카드", "91,500원", "2026-05-20 09:18", "대상", "완료", "영수증"],
            ["ORD-2026-1047", "HCT-2407-119", "프롬프트 실무", "박도윤", "카드", "82,000원", "2026-05-20 09:02", "확인", "대기", "검증"],
            ["ORD-2026-1046", "HCT-2407-121", "AI 윤리", "이하나", "계좌", "64,000원", "2026-05-20 08:51", "보류", "재검토", "확인"],
            ["ORD-2026-1045", "HCT-2407-125", "웹툰 번역", "최민준", "카드", "112,000원", "2026-05-19 18:33", "대상", "완료", "영수증"],
            ["ORD-2026-1044", "HCT-2407-126", "AITe 번역시험", "정유진", "카드", "91,500원", "2026-05-19 17:12", "환불", "진행", "검토"],
            ["ORD-2026-1043", "HCT-2407-128", "AI 윤리", "오지훈", "카드", "64,000원", "2026-05-19 16:44", "대상", "완료", "영수증"],
            ["ORD-2026-1042", "HCT-2407-132", "프롬프트 실무", "한서아", "계좌", "82,000원", "2026-05-19 15:06", "확인", "대기", "검증"],
            ["ORD-2026-1041", "HCT-2407-136", "AITe 번역시험", "문태경", "카드", "91,500원", "2026-05-19 14:25", "중복", "위험", "환불"]
          ]}
        />
      </AdminPanel>
    </div>
  );
}

function AdminWorkspace() {
  return (
    <div className="grid gap-2">
      <section className="grid gap-2 md:grid-cols-8 xl:grid-cols-12">
        {[
          ["신규 회원", "36", "+12%"],
          ["시험 접수", "124", "오늘"],
          ["결제 확인", "98", "완료"],
          ["환불 요청", "7", "대기"],
          ["문의 미답변", "11", "SLA"],
          ["채점 보류", "4", "위험"],
          ["응시 진행", "342", "실시간"],
          ["자격증", "29", "발급"],
          ["정산", "12", "대기"],
          ["알림 실패", "3", "재시도"],
          ["부정의심", "2", "검토"],
          ["시스템", "99.9", "정상"]
        ].map(([label, value, helper]) => <AdminMetric key={label} label={label} value={value} helper={helper} />)}
      </section>
      <div className="grid gap-2 xl:grid-cols-[minmax(0,1.1fr)_minmax(520px,0.9fr)_260px]">
        <AdminPanel title="운영 파이프라인" icon={<LayoutDashboard className="size-4 text-slate-500" />}>
          <AdminTable
            headers={["업무", "대상", "진행", "위험", "담당"]}
            rows={[
              ["접수 승인", "124건", "92%", "낮음", "운영1"],
              ["결제 검증", "98건", "88%", "중간", "정산"],
              ["응시 진행", "342명", "실시간", "낮음", "시험운영"],
              ["AI 채점", "18건", "대기", "중간", "AI"],
              ["휴먼 검수", "12건", "진행", "높음", "채점팀"],
              ["자격증 발급", "29건", "완료", "낮음", "발급"]
            ]}
          />
        </AdminPanel>
        <AdminPanel title="접수/문의 큐">
          <AdminTable
            headers={["ID", "분류", "상태", "SLA", "액션"]}
            rows={[
              ["Q-1001", "환불", "대기", "2h", "검토"],
              ["Q-1002", "본인인증", "진행", "4h", "배정"],
              ["Q-1003", "응시장애", "보류", "1h", "긴급"],
              ["Q-1004", "자격증", "완료", "-", "닫기"],
              ["Q-1005", "결제", "대기", "3h", "확인"],
              ["Q-1006", "채점", "재검토", "5h", "재배정"]
            ]}
          />
        </AdminPanel>
        <AdminPanel title="긴급 처리">
          <div className="grid gap-1.5 p-2">
            <Button className="h-8 text-xs">환불 요청 검토</Button>
            <Button className="h-8 text-xs" variant="outline">문의 배정</Button>
            <Button className="h-8 text-xs" variant="outline">채점 보류 해제</Button>
            <Button className="h-8 text-xs" variant="outline">알림 재발송</Button>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}

function MypageWorkspace({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {candidateSide.slice(0, 6).map(([label, path]) => (
        <Link key={path} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-[#0788ff]" href={`/${locale}/${path}`}>
          <ChevronRight className="ml-auto size-4 text-slate-300" />
          <div className="mt-5 text-base font-black text-slate-950">{label}</div>
          <p className="mt-2 text-sm font-semibold text-slate-600">현재 상태와 다음 액션을 확인합니다.</p>
        </Link>
      ))}
    </div>
  );
}

function ProfileWorkspace() {
  return (
    <div className="grid gap-3 xl:grid-cols-[1fr_360px]">
      <Panel title="기본 정보"><FieldGrid rows={[["성명", "홍 길 동"], ["이메일", "abcde@gmail.com"], ["휴대폰", "010-****-1122"], ["지역", "서울"], ["회원등급", "Premium"]]} /></Panel>
      <Panel title="프로필 동작"><div className="grid gap-2 p-3"><Button>저장</Button><Button variant="outline">본인인증 갱신</Button></div></Panel>
      <div className="xl:col-span-2">
        <Panel title="테마 설정" icon={<Settings className="size-4 text-slate-500" />}>
          <ThemeSettings />
        </Panel>
      </div>
    </div>
  );
}

function NotificationsWorkspace() {
  return (
    <Panel title="알림 수신 설정" icon={<Settings className="size-4 text-slate-500" />}>
      <NotificationSettings />
    </Panel>
  );
}

function AdminPanel({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="flex h-8 items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-2 text-[11px] font-black text-slate-800">
        {icon}
        {title}
      </div>
      {children}
    </section>
  );
}

function AdminMetric({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white px-2 py-2">
      <div className="text-[10px] font-black text-slate-500">{label}</div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <span className="text-xl font-black leading-none text-slate-950">{value}</span>
        <span className="rounded bg-[#eef6ff] px-1.5 py-0.5 text-[10px] font-black text-[#0b63c5]">{helper}</span>
      </div>
    </section>
  );
}

function AdminTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="min-h-0 overflow-hidden rounded-md border border-slate-200 bg-white">
      <div
        className="grid min-w-[620px] items-center border-b border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] font-black text-slate-500"
        style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}
      >
        {headers.map((header) => (
          <span key={header} className="truncate">
            {header}
          </span>
        ))}
      </div>
      <div className="max-h-[420px] overflow-auto">
        {rows.map((row) => (
          <div
            key={row.join("-")}
            className="grid min-w-[620px] items-center border-b border-slate-100 px-2 py-1.5 text-[11px] last:border-b-0"
            style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}
          >
            {row.map((cell, index) => (
              <span key={`${cell}-${index}`} className={cn("truncate", index < 2 ? "font-black text-slate-900" : "font-semibold text-slate-600")}>
                {index === 2 || index === 3 || index === headers.length - 1 ? (
                  cell.match(/완료|확정|지급|낮음|정상/) ? (
                    <StatusBadge tone="teal">{cell}</StatusBadge>
                  ) : cell.match(/보류|재검토|높음|위험|긴급/) ? (
                    <StatusBadge tone="rose">{cell}</StatusBadge>
                  ) : cell.match(/대기|중간|진행|검토|배정|확인|재배정/) ? (
                    <StatusBadge tone="amber">{cell}</StatusBadge>
                  ) : (
                    cell
                  )
                ) : (
                  cell
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="min-h-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div
        className="grid min-w-[760px] items-center border-b border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-black text-slate-500"
        style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}
      >
        {headers.map((header) => (
          <span key={header} className="truncate">
            {header}
          </span>
        ))}
      </div>
      <div className="min-h-0 overflow-auto">
        {rows.map((row) => (
          <div
            key={row.join("-")}
            className="grid min-w-[760px] items-center border-b border-slate-100 px-3 py-2 text-xs last:border-b-0"
            style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}
          >
            {row.map((cell, index) => (
              <span key={`${cell}-${index}`} className={cn(index === 0 || index === 1 ? "font-black text-slate-900" : "font-semibold text-slate-600")}>
                {index === 2 || index === headers.length - 1 ? (
                  cell.match(/완료|확정|지급|검수|대기|보류|재검토|채점/) ? (
                    <StatusBadge tone={cell.match(/완료|확정|지급/) ? "teal" : cell.match(/보류|재검토/) ? "rose" : "amber"}>{cell}</StatusBadge>
                  ) : (
                    cell
                  )
                ) : (
                  cell
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PolicyWorkspace({ title }: { title: string }) {
  return (
    <Panel title={title} icon={<FileText className="size-4 text-slate-500" />}>
      <div className="grid gap-3 p-5 text-sm font-semibold leading-7 text-slate-700">
        <p>본 화면은 원본 포털의 정책 링크를 클론한 정적 페이지입니다.</p>
        <p>시험 접수, 응시, 채점, 결과 확인, 자격증 발급 과정에서 필요한 약관과 개인정보 처리 기준을 안내합니다.</p>
      </div>
    </Panel>
  );
}

function LoginPage({ locale, config }: { locale: Locale; config: PageConfig }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f8ff] px-6 text-slate-950">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-portal">
        <Link className="text-xl font-black" href={`/${locale}`}>LOGO</Link>
        <h1 className="mt-8 text-3xl font-black">{config.title}</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{config.description}</p>
        <div className="mt-6 grid gap-3"><Input placeholder="이메일" /><Input placeholder="비밀번호" type="password" /><Button asChild><Link href={`/${locale}/mypage`}>로그인</Link></Button></div>
      </section>
    </main>
  );
}

function StepRows({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="grid gap-2 p-3">
      {rows.map(([label, state]) => (
        <div key={label} className="grid grid-cols-[1fr_auto] items-center rounded-md border border-slate-100 bg-slate-50 px-2 py-2">
          <span className="text-xs font-black text-slate-700">{label}</span>
          <StatusBadge tone={state.includes("대기") || state.includes("OFF") ? "amber" : "teal"}>{state}</StatusBadge>
        </div>
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white text-center">
      <div className="py-4"><div className="text-xs font-black text-slate-500">{label}</div><div className="mt-2 text-2xl font-black text-slate-900">{value}</div><div className="mt-3 inline-flex rounded-full bg-[#eef6ff] px-2 py-1 text-xs text-[#0b63c5]">진행 중</div></div>
    </section>
  );
}

function Bars({ rows }: { rows: Array<[string, string, string]> }) {
  return (
    <div className="grid gap-2 p-3">
      {rows.map(([label, width, color]) => (
        <div key={label} className="grid gap-1">
          <div className="flex items-center justify-between text-[11px] font-black text-slate-700"><span>{label}</span><span>{width}</span></div>
          <div className="h-1.5 w-full overflow-hidden rounded bg-slate-200"><div className={cn("h-full rounded", color)} style={{ width }} /></div>
        </div>
      ))}
    </div>
  );
}

function DarkGuide({ title, text, href, label }: { title: string; text: string; href?: string; label?: string }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white">
      <div className="grid h-full content-between p-3">
        <div><div className="text-xs font-black text-white">{title}</div><p className="mt-2 text-xs leading-5 text-slate-300">{text}</p></div>
        {href ? <Link className="mt-3 grid h-8 place-items-center rounded-md bg-white text-xs font-black text-slate-950" href={href}>{label}</Link> : null}
      </div>
    </section>
  );
}
