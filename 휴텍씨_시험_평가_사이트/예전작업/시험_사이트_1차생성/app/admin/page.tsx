import { AppShell } from "../../components/AppShell";
import { DataTable } from "../../components/DataTable";
import { PageHeader } from "../../components/PageHeader";
import { exams } from "../../lib/mock-data";

export default function AdminHomePage() {
  return (
    <AppShell role="admin" title="관리자 홈">
      <div data-design-source="../../figma_pdf/2024/관리자 홈.png">
        <PageHeader title="관리자 홈" description="회원, 시험, 결제, 고객지원 현황을 한 화면에서 확인합니다." />
        <div className="stats-grid">
          <div className="surface stat">
            <div className="stat-label">승인 대기 회원</div>
            <div className="stat-value">12</div>
          </div>
          <div className="surface stat">
            <div className="stat-label">진행 시험</div>
            <div className="stat-value">8</div>
          </div>
          <div className="surface stat">
            <div className="stat-label">미처리 문의</div>
            <div className="stat-value">5</div>
          </div>
          <div className="surface stat">
            <div className="stat-label">금월 결제</div>
            <div className="stat-value">3.2M</div>
          </div>
        </div>
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
      </div>
    </AppShell>
  );
}
