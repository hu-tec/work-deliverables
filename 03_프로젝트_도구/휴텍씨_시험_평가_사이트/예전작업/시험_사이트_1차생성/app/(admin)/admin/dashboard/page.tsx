import { AdminShell } from "@/components/AppShell";
import { AdminDashboardSummary, FormsTable, TemplateManagerTable } from "@/components/AdminWidgets";

export default function AdminDashboardPage() {
  return (
    <AdminShell title="대시보드" crumb="대시보드">
      <AdminDashboardSummary />
      <div className="two-column">
        <FormsTable />
        <TemplateManagerTable />
      </div>
    </AdminShell>
  );
}
