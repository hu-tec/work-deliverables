import type { ClassificationJob } from "@/lib/classification-state";
import { ProcessingStatusBadge } from "@/components/ProcessingStatusBadge";

export function ClassificationStepTabs({ job }: { job: ClassificationJob }) {
  return (
    <section className="step-strip" aria-label="처리 상태">
      <div>
        <span>파일 업로드</span>
        <ProcessingStatusBadge status="uploaded" />
      </div>
      <div>
        <span>파일 검증</span>
        <ProcessingStatusBadge status={job.validation === "invalid" ? "invalid" : "valid"} />
      </div>
      <div>
        <span>구분 처리</span>
        <ProcessingStatusBadge status={job.processing === "failed" ? "failed" : "complete"} />
      </div>
      <div>
        <span>결과 검수</span>
        <ProcessingStatusBadge status={job.review === "in-review" ? "in-review" : "confirmed"} />
      </div>
      <div>
        <span>저장/반영</span>
        <ProcessingStatusBadge status={job.apply === "applied" ? "applied" : "saved"} />
      </div>
    </section>
  );
}
