import { AdminShell } from "@/components/AppShell";

type TemplateDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const { id } = await params;
  return (
    <AdminShell title="템플릿 상세" crumb={`템플릿 > ${id}`}>
      <section className="edit-form">
        <label>템플릿명<input defaultValue="PDF 번역 후 문서 변환" /></label>
        <label>상품 설명<textarea defaultValue="문서번역, 파일 변환, 후면 감수 요청을 묶은 구매 템플릿입니다." /></label>
        <label>판매가<input defaultValue="220000" /></label>
        <div className="admin-actions"><button>비활성화</button><button className="primary-admin">저장</button></div>
      </section>
    </AdminShell>
  );
}
