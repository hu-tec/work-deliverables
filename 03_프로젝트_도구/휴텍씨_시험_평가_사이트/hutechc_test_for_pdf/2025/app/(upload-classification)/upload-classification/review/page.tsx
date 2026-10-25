import { AdminShell } from "@/components/AppShell";
import { ProcessingResultTable } from "@/components/AdminWidgets";

export default function UploadReviewPage() {
  return (
    <AdminShell title="구분 검토" crumb="파일업로드 > 검토">
      <section className="filter-panel"><strong>처리 결과</strong><button>검증요청</button><button>수정요청</button><button>게시완료</button></section>
      <ProcessingResultTable />
    </AdminShell>
  );
}
