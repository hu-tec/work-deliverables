"use client";
// 시험 결과: 제출한 시험의 채점 현황·결과. 실제 채점 백엔드가 없어 결과는
// 사용자가 명시적으로 트리거하는 "데모 채점 시뮬레이션"으로만 생성됩니다.
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
  Input,
  cx,
} from "@/components/ui";
import { getExamById } from "@/lib/demo-exams";

export default function ResultsPage() {
  const { hydrated, applications, simulateGrading } = useStore();
  const [scores, setScores] = useState<Record<string, string>>({});

  const submitted = useMemo(
    () =>
      applications.filter(
        (a) => a.examStatus === "시험 완료" && a.registerStatus !== "접수 취소",
      ),
    [applications],
  );

  if (!hydrated)
    return <Panel><p className="text-body text-ds-muted m-0">불러오는 중…</p></Panel>;

  const grade = (id: string, pass: boolean) => {
    const raw = scores[id];
    const score = raw === undefined || raw === "" ? NaN : Number(raw);
    if (Number.isNaN(score) || score < 0 || score > 100) {
      alert("0~100 사이의 데모 점수를 입력하세요.");
      return;
    }
    simulateGrading(id, pass, score);
  };

  return (
    <div className="flex flex-col gap-ds-5">
      <SectionHead
        title="🎯 시험 결과"
        desc="제출한 시험의 채점 현황과 결과를 확인합니다."
      />

      {submitted.length === 0 ? (
        <Panel>
          <EmptyState
            title="제출한 시험이 없습니다"
            desc="시험에 응시하고 답안을 제출하면 결과가 여기에 표시됩니다."
            action={
              <Link href="/examinee/take">
                <Button>✍️ 시험 응시하러 가기</Button>
              </Link>
            }
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-ds-4">
          {submitted.map((a) => {
            const ex = getExamById(a.examId);
            const decided = a.resultStatus === "합격" || a.resultStatus === "불합격";
            return (
              <Panel key={a.id} className="flex flex-col gap-ds-3">
                <div className="flex items-center justify-between gap-ds-2">
                  <span className="inline-flex items-center h-6 px-ds-4 rounded-ds-sm bg-ds-selected text-ds-brand text-caption font-semibold">
                    {ex?.subject} {ex?.grade}
                  </span>
                  <StatusBadge status={a.resultStatus} />
                </div>
                <span className="text-subtitle font-semibold">{ex?.round}</span>
                <div className="text-caption text-ds-muted flex flex-col gap-ds-1">
                  <span>📂 {ex?.fieldLarge} · {ex?.fieldMedium}</span>
                  <span>🗓️ 성적발표(예정) {ex?.resultDate}</span>
                  {a.submittedAt && (
                    <span>📤 제출 {new Date(a.submittedAt).toLocaleString("ko-KR")}</span>
                  )}
                </div>

                {decided ? (
                  <div
                    className={cx(
                      "flex items-center justify-between rounded-ds-sm px-ds-6 py-ds-4 border",
                      a.resultStatus === "합격"
                        ? "bg-[#eaf6e1] border-ds-success"
                        : "bg-[#fbe6e6] border-ds-danger",
                    )}
                  >
                    <span className="text-subtitle font-bold">
                      {a.resultStatus === "합격" ? "🎉 합격" : "불합격"}
                    </span>
                    <span className="flex items-center gap-ds-2">
                      <span className="text-h2 font-bold tabular-nums">
                        {a.score ?? "-"}
                      </span>
                      <span className="text-caption text-ds-muted">점</span>
                      <DemoBadge label="데모 점수" />
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-ds-3 rounded-ds-sm border border-ds-brand-2 bg-ds-soft px-ds-5 py-ds-4">
                    <div className="flex items-center gap-ds-2">
                      <DemoBadge label="데모 채점 시뮬레이션" />
                      <span className="text-caption text-ds-muted">
                        실제 채점 연동 전 — 결과를 직접 시연
                      </span>
                    </div>
                    <div className="flex items-center gap-ds-2">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="점수(0~100)"
                        value={scores[a.id] ?? ""}
                        onChange={(e) =>
                          setScores((p) => ({ ...p, [a.id]: e.target.value }))
                        }
                        className="w-[120px]"
                      />
                      <Button size="sm" onClick={() => grade(a.id, true)}>
                        합격 처리
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => grade(a.id, false)}
                      >
                        불합격
                      </Button>
                    </div>
                  </div>
                )}

                {a.resultStatus === "합격" && (
                  <Link href="/examinee/certificate">
                    <Button variant="secondary" className="w-full">
                      🏅 자격증 신청하기
                    </Button>
                  </Link>
                )}
              </Panel>
            );
          })}
        </div>
      )}

      <Notice tone="demo">
        실제 채점 점수·합격 판정 백엔드가 아직 연동되지 않았습니다. 위 점수와 합격
        여부는 플로우 시연을 위해 사용자가 직접 입력·트리거한 데모 값입니다.
      </Notice>
    </div>
  );
}
