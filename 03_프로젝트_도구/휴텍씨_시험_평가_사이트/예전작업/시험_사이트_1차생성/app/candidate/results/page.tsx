import { AppShell } from "../../../components/AppShell";
import { DataTable } from "../../../components/DataTable";
import { PageHeader } from "../../../components/PageHeader";
import { exams } from "../../../lib/mock-data";

export default function ResultsPage() {
  return (
    <AppShell role="candidate" title="시험결과">
      <main data-design-source="../../figma_pdf/2024/목록_시험결과.pdf">
        <PageHeader title="시험결과" description="시험별 결과와 자격증 신청 가능 여부를 확인합니다." />
        <DataTable
          columns={[
            { key: "id", label: "시험 ID" },
            { key: "title", label: "시험명" },
            { key: "type", label: "유형" },
            { key: "period", label: "기간" },
            { key: "status", label: "상태" }
          ]}
          rows={exams}
        />
      </main>
    </AppShell>
  );
}
