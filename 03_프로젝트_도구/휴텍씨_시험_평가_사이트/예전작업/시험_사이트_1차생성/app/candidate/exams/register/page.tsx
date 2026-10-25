import { AppShell } from "../../../../components/AppShell";
import { Button } from "../../../../components/Button";
import { DataTable } from "../../../../components/DataTable";
import { PageHeader } from "../../../../components/PageHeader";
import { exams } from "../../../../lib/mock-data";

export default function ExamRegisterPage() {
  return (
    <AppShell role="candidate" title="시험접수">
      <main data-design-source="../../figma_pdf/2024/목록_시험접수.pdf">
        <PageHeader title="시험접수" description="접수 가능한 시험을 선택하고 결제로 이동합니다." action={<Button>장바구니 담기</Button>} />
        <DataTable
          columns={[
            { key: "select", label: "" },
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
