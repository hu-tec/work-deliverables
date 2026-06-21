import { ClassificationResultTable } from "@/components/ClassificationResultTable";
import { SaveResultModal } from "@/components/SaveResultModal";
import { UploadClassificationShell } from "@/components/UploadClassificationShell";
import { classificationRows } from "@/lib/fixtures";

export default function ResultsPage() {
  return (
    <UploadClassificationShell title="구분 결과" active="결과">
      <SaveResultModal />
      <ClassificationResultTable rows={classificationRows} />
    </UploadClassificationShell>
  );
}
