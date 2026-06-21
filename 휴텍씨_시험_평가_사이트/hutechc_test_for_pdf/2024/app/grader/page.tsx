import { AppShell } from "../../components/AppShell";
import { Button } from "../../components/Button";
import { DataTable } from "../../components/DataTable";
import { PageHeader } from "../../components/PageHeader";
import { exams } from "../../lib/mock-data";

export default function GraderHomePage() {
  return (
    <AppShell role="grader" title="채점자 홈">
      <main data-design-source="../../figma_pdf/2024/채점자 홈.png">
        <PageHeader title="채점관리" description="배정된 답안을 확인하고 평가서를 저장합니다." action={<Button>채점 저장</Button>} />
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
