import { AdminShell } from "@/components/AppShell";
import { TemplateManagerTable } from "@/components/AdminWidgets";

export default function TemplatesPage() {
  return (
    <AdminShell title="템플릿 양식 관리자" crumb="템플릿">
      <section className="filter-panel"><strong>템플릿 검색</strong><input placeholder="템플릿명 또는 카테고리" /><button>검색</button></section>
      <TemplateManagerTable />
    </AdminShell>
  );
}
