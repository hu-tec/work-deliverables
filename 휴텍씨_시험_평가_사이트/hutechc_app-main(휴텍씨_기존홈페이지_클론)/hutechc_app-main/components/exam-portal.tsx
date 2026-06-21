"use client";

import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { dictionaries, type Locale } from "@/lib/i18n";
import {
  headerIcons,
  metrics,
  progressSteps,
  readiness,
  registrations,
  shortcuts,
  tableHeaders,
  utilityIcons
} from "@/components/exam-data";
import { cn } from "@/lib/utils";

function href(locale: Locale, path: string) {
  return `/${locale}${path}`;
}

export function ExamPortal({ locale }: { locale: Locale }) {
  const messages = dictionaries[locale];
  const t = (key: string) => {
    const value = key.split(".").reduce<unknown>((source, part) => {
      if (source && typeof source === "object" && part in source) {
        return (source as Record<string, unknown>)[part];
      }
      return undefined;
    }, messages);

    return typeof value === "string" ? value : key;
  };
  const ShoppingCart = headerIcons.ShoppingCart;
  const UserCircle = headerIcons.UserCircle;
  const CalendarDays = utilityIcons.CalendarDays;
  const CircleHelp = utilityIcons.CircleHelp;

  const navItems = [
    ["apply", "/apply"],
    ["take", "/take"],
    ["results", "/results"],
    ["certificate", "/certificate"],
    ["orders", "/orders"],
    ["inquiry", "/inquiry"]
  ] as const;

  return (
    <main className="min-h-screen bg-background pt-[60px] text-foreground">
      <header className="fixed left-0 right-0 top-0 z-30 grid h-[60px] grid-cols-[190px_minmax(0,1fr)_auto] items-center border-b bg-card max-lg:grid-cols-[120px_minmax(0,1fr)]">
        <Link className="px-5 text-xl font-black tracking-normal" href={href(locale, "")}>
          {t("nav.logo")}
        </Link>
        <nav className="min-w-0 overflow-x-auto">
          <div className="flex items-center justify-center gap-2 px-3 text-sm font-black text-slate-800">
            {navItems.map(([key, path]) => (
              <Link
                key={key}
                className="shrink-0 rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-accent-foreground"
                href={href(locale, path)}
              >
                {t(`nav.${key}`)}
              </Link>
            ))}
          </div>
        </nav>
        <div className="flex items-center justify-end gap-4 pr-5 text-foreground max-lg:hidden">
          <div className="flex items-center gap-1.5">
            {(["expert", "grader", "admin"] as const).map((key) => (
              <Link
                key={key}
                className="shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-black text-slate-700 hover:border-primary hover:text-primary"
                href={href(locale, `/${key}`)}
              >
                {t(`nav.${key}`)}
              </Link>
            ))}
          </div>
          <Link className="text-sm font-semibold text-slate-600" href={href(locale, "/login")}>
            {t("nav.login")}
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href={href(locale, "/mypage")}>{t("nav.mypage")}</Link>
          </Button>
          <NotificationDropdown locale={locale} />
          <ShoppingCart className="size-5 shrink-0" aria-hidden />
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
            <UserCircle className="size-6" aria-hidden />
          </span>
        </div>
      </header>

      <section className="container grid gap-8 py-10">
        <div className="grid grid-cols-[1fr_420px] gap-5 max-xl:grid-cols-1">
          <Card className="rounded-2xl border-0 px-9 py-8 max-md:px-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
              {t("home.breadcrumb").split(" > ").map((part, index, list) => (
                <span key={part} className="contents">
                  {part}
                  {index < list.length - 1 ? <span className="text-slate-300">&gt;</span> : null}
                </span>
              ))}
            </div>
            <div className="mt-8 grid max-w-[760px] gap-5">
              <h1 className="text-[40px] font-black leading-tight tracking-normal text-slate-950 max-md:text-[30px]">
                {t("home.title")}
              </h1>
              <p className="text-base font-semibold leading-7 text-slate-600">{t("home.description")}</p>
            </div>
            <div className="mt-8 grid grid-cols-[1fr_170px] gap-2 max-md:grid-cols-1">
              <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
                <Input placeholder={t("home.examNumber")} />
                <Input placeholder={t("home.identity")} />
              </div>
              <Button asChild size="lg">
                <Link href={href(locale, "/take")}>
                  <Search className="size-4" aria-hidden />
                  {t("home.findExam")}
                </Link>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              <Button asChild>
                <Link href={href(locale, "/take")}>{t("home.enter")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={href(locale, "/apply")}>{t("home.apply")}</Link>
              </Button>
              <Button asChild variant="outline" className="text-slate-700">
                <Link href={href(locale, "/results")}>{t("home.result")}</Link>
              </Button>
            </div>
          </Card>

          <Card className="rounded-2xl border-0 p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-500">{t("home.todayExam")}</div>
                <h2 className="mt-3 text-2xl font-black text-slate-950">{t("home.examName")}</h2>
                <div className="mt-2 text-sm font-black text-primary">{t("home.examLevel")}</div>
              </div>
              <div className="grid size-20 place-items-center rounded-full border-[9px] border-primary text-center">
                <span className="text-xs font-semibold text-slate-700">
                  {t("home.remain")}
                  <br />
                  <b className="text-base text-red-500">5:00</b>
                </span>
              </div>
            </div>
            <div className="mt-6 grid gap-2 text-sm font-semibold text-slate-700">
              <InfoRow label={t("home.time")} value="09:00 ~ 09:15" />
              <InfoRow label={t("home.language")} value="한국어 → English" />
              <InfoRow label={t("home.status")} value={t("home.ready")} valueClassName="text-red-500" />
            </div>
            <Button asChild className="mt-7 h-11 w-full">
              <Link href={href(locale, "/take")}>{t("home.enter")}</Link>
            </Button>
          </Card>
        </div>

        <section className="grid gap-3 md:grid-cols-3" aria-label="today metrics">
          {metrics.map((metric) => (
            <Card key={metric.label} className={cn("rounded-lg shadow-none", metric.tone)}>
              <CardContent className="p-5">
                <div className="text-xs font-black text-slate-500">{metric.label}</div>
                <div className="mt-4 text-3xl font-black text-slate-900">{metric.value}</div>
                <div className="mt-2 text-xs font-semibold text-slate-500">{metric.helper}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1" aria-label="quick links">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                className="group rounded-lg border bg-card p-5 hover:border-primary"
                href={href(locale, item.href)}
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-md bg-secondary text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <ChevronRight className="size-4 text-slate-300 group-hover:text-primary" aria-hidden />
                </div>
                <div className="mt-5 text-base font-black text-slate-950">{item.label}</div>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{item.description}</p>
              </Link>
            );
          })}
        </section>

        <section className="grid grid-cols-[1fr_420px] gap-5 max-xl:grid-cols-1">
          <div className="grid gap-5">
            <Card className="grid grid-cols-5 overflow-hidden rounded-lg shadow-none max-lg:grid-cols-1">
              {progressSteps.map(([label, state, done]) => (
                <div
                  key={label}
                  className="grid min-h-20 grid-cols-[32px_1fr] items-center gap-3 border-r px-5 last:border-r-0 max-lg:border-b max-lg:border-r-0"
                >
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-full text-sm font-black",
                      done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {done ? <CheckMark /> : progressSteps.findIndex(([item]) => item === label) + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-black text-slate-950">{label}</span>
                    <span className="mt-1 block text-xs font-semibold text-slate-500">{state}</span>
                  </span>
                </div>
              ))}
            </Card>

            <section className="grid gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <DateBox icon={<CalendarDays className="size-4" aria-hidden />} label="YYYY.MM.DD" />
                <span className="text-slate-400">~</span>
                <DateBox icon={<CalendarDays className="size-4" aria-hidden />} label="YYYY.MM.DD" />
                <Input className="h-10 min-w-[260px] flex-1" placeholder="시험명, 급수, 수험번호를 입력하세요." />
                <Button className="h-10">
                  <Search className="size-4" aria-hidden />
                  검색
                </Button>
              </div>
              <Card className="overflow-hidden rounded-lg shadow-none">
                <div className="grid h-10 grid-cols-[110px_120px_130px_130px_110px_110px_120px_140px_110px_120px_110px_130px_100px_110px] items-center px-4 text-xs font-semibold text-slate-500 max-xl:hidden">
                  {tableHeaders.map((header) => (
                    <span key={header}>{header}</span>
                  ))}
                </div>
                {registrations.map((row) => (
                  <div
                    key={row.id}
                    className="grid min-h-16 grid-cols-[110px_120px_130px_130px_110px_110px_120px_140px_110px_120px_110px_130px_100px_110px] items-center gap-2 border-t px-4 text-center text-sm text-slate-900 max-xl:grid-cols-1 max-xl:gap-2 max-xl:px-4 max-xl:py-4 max-xl:text-left"
                  >
                    <span>{row.id}</span>
                    <span>{row.appliedAt}</span>
                    <span>{row.examAt}</span>
                    <span>{row.round}</span>
                    <span>{row.subject}</span>
                    <span>{row.grade}</span>
                    <span>{row.language}</span>
                    <span>{row.payment}</span>
                    <span>{row.refund}</span>
                    <span>{row.ticket}</span>
                    <span className={cn("font-black", row.scoreClass)}>{row.score}</span>
                    <span>{row.certificate}</span>
                    <span>{row.inquiry}</span>
                    <Button asChild variant="outline" size="sm" className="h-8 text-primary">
                      <Link href={href(locale, row.actionHref)}>{row.action}</Link>
                    </Button>
                  </div>
                ))}
              </Card>
            </section>
          </div>

          <aside className="grid content-start gap-3">
            <Card className="rounded-lg shadow-none">
              <CardContent className="p-5">
                <div className="text-base font-black text-slate-950">응시 준비 상태</div>
                <div className="mt-4 grid gap-2">
                  {readiness.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="grid h-10 grid-cols-[24px_1fr_auto] items-center gap-2 rounded-md border bg-[#f7f9ff] px-3 text-xs font-semibold text-slate-700"
                      >
                        <Icon className="size-4 text-primary" aria-hidden />
                        <span>{item.label}</span>
                        <span className={cn("font-black text-primary", item.danger && "text-red-500")}>
                          {item.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg shadow-none">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-base font-black text-slate-950">
                  <CircleHelp className="size-4 text-primary" aria-hidden />
                  시험 전 확인
                </div>
                <div className="mt-4 grid gap-2 text-sm font-semibold leading-6 text-slate-600">
                  <p>입장 가능 시간에는 시험장 버튼이 가장 먼저 표시됩니다.</p>
                  <p>응시환경 점검이 남아 있으면 시험 시작 전에 먼저 확인해야 합니다.</p>
                  <p>결제나 본인인증이 미완료이면 접수 상세로 이동합니다.</p>
                </div>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href={href(locale, "/inquiry")}>고객센터 문의</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </section>
      </section>
    </main>
  );
}

function InfoRow({
  label,
  value,
  valueClassName
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="grid grid-cols-[88px_1fr]">
      <span className="text-slate-500">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}

function DateBox({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex h-10 min-w-[190px] items-center gap-2 rounded-md border bg-card px-3 text-sm text-slate-400">
      {icon}
      {label}
    </div>
  );
}

function CheckMark() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
