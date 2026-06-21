import { AdminShell } from "@/components/AppShell";
import { FormsTable, LargeCheckboxGroup } from "@/components/AdminWidgets";

export default function FormsPage() {
  return (
    <AdminShell title="양식관리" crumb="양식관리">
      <section className="admin-tabs"><button className="active">전체</button><button>양식관리</button><button>프롬프트</button><button>템플릿</button></section>
      <section className="filter-panel"><strong>선택된 검색조건 3</strong><LargeCheckboxGroup /></section>
      <FormsTable />
    </AdminShell>
  );
}
