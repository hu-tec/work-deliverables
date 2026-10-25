"use client";
// 시험 응시: 결제완료 시험 선택 → 실제 문제은행 문항 응시 → 제출.
// 모범답안(modelAnswer)은 응시자 비공개 — 절대 렌더하지 않음.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/components/providers";
import {
  Panel,
  SectionHead,
  Button,
  StatusBadge,
  EmptyState,
  Notice,
  DemoBadge,
  cx,
} from "@/components/ui";
import { getExamById } from "@/lib/demo-exams";
import { getQuestionsByFields } from "@/lib/data";

export default function TakeExamPage() {
  const { hydrated, applications, startExam, submitExam } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const takeable = useMemo(
    () =>
      applications.filter(
        (a) =>
          a.registerStatus !== "접수 취소" &&
          a.paymentStatus === "결제완료" &&
          (a.examStatus === "시험 전" || a.examStatus === "시험 중"),
      ),
    [applications],
  );
  const blocked = useMemo(
    () =>
      applications.filter(
        (a) =>
          a.registerStatus === "접수 취소" ||
          a.paymentStatus !== "결제완료" ||
          a.examStatus === "시험 완료" ||
          a.examStatus === "시험 취소",
      ),
    [applications],
  );

  const active = activeId ? applications.find((a) => a.id === activeId) : null;
  const exam = active ? getExamById(active.examId) : null;
  const questions = useMemo(
    () => (exam ? getQuestionsByFields(exam.questionFields) : []),
    [exam],
  );

  if (!hydrated)
    return <Panel><p className="text-body text-ds-muted m-0">불러오는 중…</p></Panel>;

  // ── 응시 화면 ──
  if (active && exam) {
    const done = active.examStatus === "시험 완료";
    const answered = questions.filter((qn) => (answers[qn.id] ?? "").trim()).length;

    const onSubmit = () => {
      if (questions.length === 0) return;
      if (
        confirm(
          `총 ${questions.length}문항 중 ${answered}문항 작성했습니다. 제출하시겠습니까? (제출 후 수정 불가)`,
        )
      )
        submitExam(active.id, answers);
    };

    return (
      <div className="flex flex-col gap-ds-5">
        <SectionHead
          title={`✍️ ${exam.subject} ${exam.grade} 응시`}
          desc={`${exam.round} · ${exam.fieldLarge}·${exam.fieldMedium}`}
          right={
            <Button variant="ghost" size="sm" onClick={() => setActiveId(null)}>
              ← 목록으로
            </Button>
          }
        />

        {done ? (
          <Panel>
            <EmptyState
              title="✅ 제출 완료"
              desc="답안이 제출되었습니다. 채점 결과는 결과 페이지에서 확인하세요."
              action={
                <Link href="/examinee/results">
                  <Button>🎯 시험 결과 보기</Button>
                </Link>
              }
            />
          </Panel>
        ) : questions.length === 0 ? (
          <Notice tone="warning">
            이 시험의 문제은행 분야에 연결된 실제 문항이 없습니다. (실제 정리DB에
            해당 분야 문항 미수록) 다른 시험을 선택해 주세요.
          </Notice>
        ) : (
          <>
            <div className="sticky top-[60px] z-10 flex items-center gap-ds-4 bg-ds-base border border-ds-border rounded-ds-md px-ds-6 py-ds-4">
              <span className="text-caption text-ds-secondary">
                작성 진행 <b className="text-ds-brand">{answered}</b> / {questions.length}
              </span>
              <span className="flex-1 h-2 rounded-ds-full bg-ds-page overflow-hidden border border-ds-border">
                <span
                  className="block h-full bg-ds-brand"
                  style={{
                    width: `${Math.round((answered / questions.length) * 100)}%`,
                  }}
                />
              </span>
              <Button onClick={onSubmit}>제출하기</Button>
            </div>

            {/* 문항 (다단 그리드) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-ds-4">
              {questions.map((qn, i) => (
                <Panel key={qn.id} className="flex flex-col gap-ds-3">
                  <div className="flex items-center justify-between gap-ds-2">
                    <span className="inline-flex items-center h-6 px-ds-4 rounded-ds-sm bg-ds-selected text-ds-brand text-caption font-semibold">
                      문항 {i + 1}
                    </span>
                    <span className="text-caption text-ds-muted truncate">
                      {qn.large} · {qn.medium} · {qn.small}
                    </span>
                  </div>
                  <div className="ds-prewrap text-body text-ds-secondary max-h-[260px] overflow-y-auto ds-scroll bg-ds-page rounded-ds-sm p-ds-5 border border-ds-border">
                    {qn.questions[0] ?? "(문제 본문 없음)"}
                  </div>
                  <textarea
                    value={answers[qn.id] ?? ""}
                    onChange={(e) =>
                      setAnswers((p) => ({ ...p, [qn.id]: e.target.value }))
                    }
                    placeholder="여기에 답안(프롬프트/서술)을 작성하세요…"
                    className="w-full min-h-[120px] p-ds-5 text-body bg-ds-base border border-ds-border rounded-ds-sm placeholder:text-ds-muted focus:border-ds-brand resize-y ds-prewrap"
                  />
                </Panel>
              ))}
            </div>

            <div className="flex justify-end">
              <Button size="lg" onClick={onSubmit}>
                답안 제출하기
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── 응시 가능 목록 ──
  return (
    <div className="flex flex-col gap-ds-5">
      <SectionHead
        title="✍️ 시험 응시"
        desc="결제 완료된 시험에 응시할 수 있습니다."
      />
      {takeable.length === 0 ? (
        <Panel>
          <EmptyState
            title="응시 가능한 시험이 없습니다"
            desc="시험을 접수하고 결제를 완료하면 여기서 응시할 수 있어요."
            action={
              <Link href="/examinee/applications">
                <Button>💳 내 접수/결제로 이동</Button>
              </Link>
            }
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-ds-4">
          {takeable.map((a) => {
            const ex = getExamById(a.examId);
            if (!ex) return null;
            const qCount = getQuestionsByFields(ex.questionFields).length;
            return (
              <Panel key={a.id} className="flex flex-col gap-ds-3">
                <div className="flex items-center justify-between gap-ds-2">
                  <span className="inline-flex items-center h-6 px-ds-4 rounded-ds-sm bg-ds-selected text-ds-brand text-caption font-semibold">
                    {ex.subject} {ex.grade}
                  </span>
                  <StatusBadge status={a.examStatus} />
                </div>
                <span className="text-subtitle font-semibold">{ex.round}</span>
                <div className="text-caption text-ds-muted flex flex-col gap-ds-1">
                  <span>📂 {ex.fieldLarge} · {ex.fieldMedium}</span>
                  <span>🗓️ {ex.examDate} {ex.examStart}~{ex.examEnd}</span>
                  <span className={cx(qCount === 0 && "text-ds-danger")}>
                    ❓ 문항 {qCount}개 {qCount === 0 && "(미연결)"}
                  </span>
                </div>
                <Button
                  className="mt-ds-1"
                  disabled={qCount === 0}
                  onClick={() => {
                    if (a.examStatus === "시험 전") startExam(a.id);
                    setActiveId(a.id);
                    setAnswers(a.answers ?? {});
                  }}
                >
                  {a.examStatus === "시험 중" ? "이어서 응시" : "응시 시작"}
                </Button>
              </Panel>
            );
          })}
        </div>
      )}

      {blocked.length > 0 && (
        <section className="flex flex-col gap-ds-3">
          <h2 className="text-title font-bold m-0">응시 불가 / 완료 내역</h2>
          <Panel pad={false} className="overflow-x-auto ds-scroll">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[1fr_92px_92px_92px_1.1fr] items-center gap-ds-3 px-ds-6 py-ds-4 border-b border-ds-border bg-ds-page text-caption font-semibold text-ds-secondary">
                <span>시험</span>
                <span>접수</span>
                <span>결제</span>
                <span>응시</span>
                <span>사유 / 다음 작업</span>
              </div>
              {blocked.map((a) => {
                const ex = getExamById(a.examId);
                const reason = getBlockedReason(a);
                return (
                  <div
                    key={a.id}
                    className="grid grid-cols-[1fr_92px_92px_92px_1.1fr] items-center gap-ds-3 px-ds-6 py-ds-4 border-b border-ds-border last:border-0 text-caption"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold text-ds-primary truncate">
                        {ex?.subject} {ex?.grade}
                      </span>
                      <span className="block text-ds-muted truncate">{ex?.round}</span>
                    </span>
                    <span><StatusBadge status={a.registerStatus} /></span>
                    <span><StatusBadge status={a.paymentStatus} /></span>
                    <span><StatusBadge status={a.examStatus} /></span>
                    <span className="flex items-center justify-between gap-ds-3 text-ds-secondary">
                      <span className="truncate" title={reason.text}>
                        {reason.text}
                      </span>
                      {reason.href && (
                        <Link href={reason.href}>
                          <Button size="sm" variant="outline">
                            {reason.cta}
                          </Button>
                        </Link>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </section>
      )}
      <Notice tone="info">
        문항 본문은 실제 정리DB(문제은행)에서 불러옵니다. 모범답안은 채점자용으로
        응시 화면에 표시되지 않습니다.
      </Notice>
    </div>
  );
}

function getBlockedReason(a: {
  registerStatus: string;
  paymentStatus: string;
  examStatus: string;
}) {
  if (a.registerStatus === "접수 취소")
    return { text: "접수가 취소되어 응시할 수 없습니다." };
  if (a.paymentStatus === "결제대기")
    return {
      text: "결제 완료 후 응시할 수 있습니다.",
      href: "/examinee/applications",
      cta: "결제",
    };
  if (a.paymentStatus !== "결제완료")
    return { text: "결제 상태 확인이 필요합니다.", href: "/examinee/applications", cta: "확인" };
  if (a.examStatus === "시험 완료")
    return { text: "이미 답안을 제출했습니다.", href: "/examinee/results", cta: "결과" };
  if (a.examStatus === "시험 취소")
    return { text: "시험이 취소되어 응시할 수 없습니다." };
  return { text: "현재 상태에서는 응시할 수 없습니다." };
}
