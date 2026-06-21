import { AdminShell } from "@/components/AppShell";
import { LargeCheckboxGroup, ProcessingResultTable } from "@/components/AdminWidgets";

export default function UploadClassificationPage() {
  return (
    <AdminShell title="회원관리" crumb="회원관리">
      <div className="admin-actions top-right"><button className="primary-admin">저장</button></div>
      <section className="admin-tabs"><button className="active">전체</button><button>회원관리</button><button>활동관리</button><button>결제관리</button><button>1:1 문의 관리</button><button>통계</button></section>
      <section className="filter-panel upload-filter"><strong>선택된 검색조건 3</strong><LargeCheckboxGroup /><div className="row"><select><option>이름</option></select><input placeholder="입력" /><input placeholder="YYYY.MM.DD.DOWN" /><button>검색</button></div></section>
      <h2 className="section-title">전체 정보</h2>
      <ProcessingResultTable />
    </AdminShell>
  );
}
