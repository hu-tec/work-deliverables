import { AppShell } from "../../components/AppShell";
import { DataTable } from "../../components/DataTable";
import { PageHeader } from "../../components/PageHeader";
import { exams, payments } from "../../lib/mock-data";

export default function CandidateHomePage() {
  return (
    <AppShell role="candidate" title="수험생 홈">
      <div data-design-source="../../figma_pdf/2024/목록_시험접수.pdf">
        <PageHeader title="시험관리" description="접수 가능한 시험과 결제 내역을 확인합니다." />
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
        <div style={{ height: 20 }} />
        <DataTable
          columns={[
            { key: "id", label: "결제 ID" },
            { key: "name", label: "상품명" },
            { key: "amount", label: "금액" },
            { key: "paidAt", label: "결제일" },
            { key: "status", label: "상태" }
          ]}
          rows={payments}
        />
      </div>
    </AppShell>
  );
}
