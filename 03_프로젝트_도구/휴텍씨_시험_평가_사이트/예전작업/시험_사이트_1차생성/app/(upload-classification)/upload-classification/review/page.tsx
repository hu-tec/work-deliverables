import { ClassificationResultTable } from "@/components/ClassificationResultTable";
import { ClassificationStepTabs } from "@/components/ClassificationStepTabs";
import { UploadClassificationShell } from "@/components/UploadClassificationShell";
import { classificationRows, initialJob } from "@/lib/fixtures";

export default function ReviewPage() {
  return (
    <UploadClassificationShell title="구분 결과 검수" active="검수">
      <ClassificationStepTabs job={initialJob} />
      <ClassificationResultTable rows={classificationRows} />
    </UploadClassificationShell>
  );
}
