import { AdminShell } from "@/components/AppShell";
import { formRows } from "@/lib/fixtures";

type FormDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function FormDetailPage({ params }: FormDetailPageProps) {
  const { id } = await params;
  const row = formRows.find((item) => item.id === id) ?? formRows[0];
  return (
    <AdminShell title="양식관리 상세" crumb={`양식관리 > ${row.id}`}>
      <section className="edit-form">
        <dl className="detail-list"><dt>양식 ID</dt><dd>{row.id}</dd><dt>양식명</dt><dd>{row.name}</dd><dt>상태</dt><dd>{row.status}</dd><dt>수정일</dt><dd>{row.updatedAt}</dd></dl>
        <label>프롬프트<textarea defaultValue="사용자가 업로드한 파일의 언어와 목적을 확인하고 문서 변환 결과를 생성합니다." /></label>
        <div className="admin-actions"><button>미리보기</button><button className="primary-admin">저장</button></div>
      </section>
    </AdminShell>
  );
}
