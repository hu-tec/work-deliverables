"use client";
// 수험생 대시보드: 내 접수 현황 요약 + 다음 할 일 + 최근 접수.
import Link from "next/link";
import { useStore } from "@/components/providers";
import {
  Panel,
  SectionHead,
  Kpi,
  StatusBadge,
  EmptyState,
  Button,
  cx,
} from "@/components/ui";
import { getExamById } from "@/lib/demo-exams";

export default function ExamineeDashboard() {
  const { hydrated, applications } = useStore();

  if (!hydrated)
    return <Panel><p className="text-body text-ds-muted m-0">불러오는 중…</p></Panel>;

  const active = applications.filter((a) => a.registerStatus !== "접수 취소");
  const payWait = active.filter((a) => a.paymentStatus === "결제대기");
  const takeable = active.filter(
    (a) =>
      a.paymentStatus === "결제완료" &&
      (a.examStatus === "시험 전" || a.examStatus === "시험 중"),
  );
  const grading = active.filter((a) => a.resultStatus === "채점중");
  const passed = active.filter((a) => a.resultStatus === "합격");
  const certReady = active.filter((a) => a.certStatus === "신청가능");

  // 다음 할 일 (우선순위 순)
  const todos = [
    payWait.length > 0 && {
      icon: "💳",
      text: `결제 대기 ${payWait.length}건 — 결제를 완료해야 응시할 수 있어요`,
      href: "/examinee/applications",
      cta: "결제하기",
    },
    takeable.length > 0 && {
      icon: "✍️",
      text: `응시 가능 ${takeable.length}건 — 시험에 응시하세요`,
      href: "/examinee/take",
      cta: "응시하기",
    },
    grading.length > 0 && {
      icon: "⏳",
      text: `채점 진행 중 ${grading.length}건 — 결과 발표를 기다리세요`,
      href: "/examinee/results",
      cta: "결과 보기",
    },
    certReady.length > 0 && {
      icon: "🏅",
      text: `자격증 신청 가능 ${certReady.length}건 — 합격을 축하합니다!`,
      href: "/examinee/certificate",
      cta: "자격증 신청",
    },
  ].filter(Boolean) as {
    icon: string;
    text: string;
    href: string;
    cta: string;
  }[];

  const recent = applications.slice(0, 6);

  return (
    <div className="flex flex-col gap-ds-8">
      <SectionHead
        title="📊 내 시험 대시보드"
        desc="접수 · 결제 · 응시 · 결과 · 자격증 진행 현황을 한눈에"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-ds-4">
        <Kpi icon="📝" label="전체 접수" value={active.length} sub="진행 중 건수" />
        <Kpi icon="💳" label="결제 대기" value={payWait.length} sub="미결제" />
        <Kpi icon="✍️" label="응시 가능" value={takeable.length} sub="결제 완료" />
        <Kpi icon="⏳" label="채점 중" value={grading.length} sub="결과 대기" />
        <Kpi icon="🏅" label="합격" value={passed.length} sub="자격증 대상" />
      </div>

      {/* 다음 할 일 */}
      <section className="flex flex-col gap-ds-3">
        <h2 className="text-title font-bold m-0">✅ 다음 할 일</h2>
        {todos.length === 0 ? (
          <Panel>
            <EmptyState
              title="진행 중인 할 일이 없어요"
              desc="새 시험을 접수하면 여기에 다음 단계가 표시됩니다."
              action={
                <Link href="/examinee/exams">
                  <Button>📝 시험 접수하러 가기</Button>
                </Link>
              }
            />
          </Panel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-ds-3">
            {todos.map((t) => (
              <div
                key={t.href}
                className="flex items-center gap-ds-4 bg-ds-base border border-ds-border rounded-ds-md p-ds-6"
              >
                <span className="text-h2">{t.icon}</span>
                <span className="flex-1 text-body text-ds-secondary">{t.text}</span>
                <Link href={t.href}>
                  <Button size="sm">{t.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 최근 접수 */}
      <section className="flex flex-col gap-ds-3">
        <div className="flex items-center justify-between">
          <h2 className="text-title font-bold m-0">🕘 최근 접수</h2>
          <Link href="/examinee/applications" className="text-caption text-ds-brand">
            전체 보기 →
          </Link>
        </div>
        {recent.length === 0 ? (
          <Panel>
            <p className="text-body text-ds-muted m-0">아직 접수한 시험이 없습니다.</p>
          </Panel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-ds-3">
            {recent.map((a) => {
              const ex = getExamById(a.examId);
              return (
                <div
                  key={a.id}
                  className={cx(
                    "bg-ds-base border rounded-ds-md p-ds-6 flex flex-col gap-ds-2",
                    a.registerStatus === "접수 취소"
                      ? "border-ds-border opacity-60"
                      : "border-ds-border",
                  )}
                >
                  <div className="flex items-center justify-between gap-ds-2">
                    <span className="text-caption font-semibold truncate">
                      {ex?.subject} {ex?.grade}
                    </span>
                    <StatusBadge status={a.registerStatus} />
                  </div>
                  <span className="text-caption text-ds-muted truncate">
                    {ex?.round}
                  </span>
                  <div className="flex flex-wrap gap-ds-2 mt-ds-1">
                    <StatusBadge status={a.paymentStatus} />
                    <StatusBadge status={a.examStatus} />
                    {a.resultStatus !== "미발표" && (
                      <StatusBadge status={a.resultStatus} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
