"use client";
// 자격증 신청: 합격한 시험에 대해 자격증을 신청. (발급 백엔드 미연동 — 미리보기는 데모)
import { useMemo } from "react";
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
} from "@/components/ui";
import { getExamById } from "@/lib/demo-exams";

export default function CertificatePage() {
  const { hydrated, applications, requestCert } = useStore();

  const passed = useMemo(
    () =>
      applications.filter(
        (a) => a.resultStatus === "합격" && a.registerStatus !== "접수 취소",
      ),
    [applications],
  );

  if (!hydrated)
    return <Panel><p className="text-body text-ds-muted m-0">불러오는 중…</p></Panel>;

  return (
    <div className="flex flex-col gap-ds-5">
      <SectionHead
        title="🏅 자격증 신청"
        desc="합격한 시험에 대해 자격증을 신청할 수 있습니다."
      />

      {passed.length === 0 ? (
        <Panel>
          <EmptyState
            title="자격증 신청 대상이 없습니다"
            desc="시험에 합격하면 여기서 자격증을 신청할 수 있어요."
            action={
              <Link href="/examinee/results">
                <Button>🎯 시험 결과 보기</Button>
              </Link>
            }
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-ds-4">
          {passed.map((a) => {
            const ex = getExamById(a.examId);
            const requested = a.certStatus === "신청완료";
            return (
              <Panel key={a.id} className="flex flex-col gap-ds-4">
                <div className="flex items-center justify-between gap-ds-2">
                  <span className="text-subtitle font-bold">
                    {ex?.subject} {ex?.grade} 자격증
                  </span>
                  <StatusBadge status={a.certStatus ?? "신청가능"} />
                </div>

                {/* 자격증 미리보기 (데모) */}
                <div className="relative rounded-ds-md border-2 border-ds-brand bg-ds-soft p-ds-8 flex flex-col items-center gap-ds-2 text-center">
                  <span className="absolute top-ds-3 right-ds-3">
                    <DemoBadge label="발급 미리보기" />
                  </span>
                  <span className="text-h2">🏅</span>
                  <span className="text-caption text-ds-muted">휴텍씨 AI 역량 인증</span>
                  <span className="text-title font-bold">
                    {ex?.subject} {ex?.gradeGroup} {ex?.grade}
                  </span>
                  <span className="text-caption text-ds-secondary">
                    {ex?.fieldLarge} · {ex?.fieldMedium}
                  </span>
                  <span className="text-caption text-ds-muted mt-ds-2">
                    점수 {a.score ?? "-"}점 · {ex?.round}
                  </span>
                </div>

                {requested ? (
                  <Notice tone="info">
                    자격증 신청이 접수되었습니다. 발급 상태는 추후 발급 시스템 연동 후
                    안내됩니다.
                  </Notice>
                ) : (
                  <Button onClick={() => requestCert(a.id)}>자격증 신청하기</Button>
                )}
              </Panel>
            );
          })}
        </div>
      )}

      <Notice tone="demo">
        실제 자격증 발급(PDF 생성·번호 부여·검증)은 백엔드 연동 후 제공됩니다. 현재
        미리보기는 합격 정보 기반 시연용입니다.
      </Notice>
    </div>
  );
}
