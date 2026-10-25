import { AppShell } from "../../../../components/AppShell";
import { Button } from "../../../../components/Button";
import { DataTable } from "../../../../components/DataTable";
import { PageHeader } from "../../../../components/PageHeader";
import { exams } from "../../../../lib/mock-data";

export default function ExamTakePage() {
  return (
    <AppShell role="candidate" title="시험응시">
      <main data-design-source="../../figma_pdf/2024/목록_시험응시.pdf">
        <PageHeader title="시험응시" description="응시 가능한 시험을 확인하고 시험 화면으로 진입합니다." action={<Button>시험 시작</Button>} />
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
