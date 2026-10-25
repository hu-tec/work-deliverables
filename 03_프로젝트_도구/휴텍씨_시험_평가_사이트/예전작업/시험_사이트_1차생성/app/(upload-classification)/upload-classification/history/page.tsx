import { ProcessingHistoryTable } from "@/components/ProcessingHistoryTable";
import { UploadClassificationShell } from "@/components/UploadClassificationShell";

export default function HistoryPage() {
  return (
    <UploadClassificationShell title="처리 이력" active="이력">
      <ProcessingHistoryTable />
    </UploadClassificationShell>
  );
}
