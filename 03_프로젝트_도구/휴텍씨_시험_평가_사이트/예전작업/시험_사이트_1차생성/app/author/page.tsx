import { AppShell } from "../../components/AppShell";
import { Button } from "../../components/Button";
import { DataTable } from "../../components/DataTable";
import { PageHeader } from "../../components/PageHeader";
import { exams } from "../../lib/mock-data";

export default function AuthorHomePage() {
  return (
    <AppShell role="author" title="출제자 홈">
      <main data-design-source="../../figma_pdf/2024/출제관리.pdf">
        <PageHeader title="출제관리" description="담당 시험의 출제 상태와 제출 현황을 관리합니다." action={<Button>출제 제출</Button>} />
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
