import { AdminShell } from "@/components/AppShell";

export default function NewFormPage() {
  return (
    <AdminShell title="양식관리 신규" crumb="양식관리 > 신규">
      <section className="edit-form">
        <label>양식명<input defaultValue="문서번역 기본 양식" /></label>
        <label>카테고리<select defaultValue="문서번역"><option>문서번역</option><option>Youtube</option></select></label>
        <label>설명<textarea defaultValue="파일을 업로드하고 AI 번역과 전문가 감수를 요청하는 기본 양식입니다." /></label>
        <div className="form-grid">
          <label><input type="checkbox" defaultChecked />AI 선택 사용</label>
          <label><input type="checkbox" defaultChecked />파일 업로드 사용</label>
          <label><input type="checkbox" defaultChecked />후면 작업 요청 사용</label>
          <label><input type="checkbox" />결제 연결 숨김</label>
        </div>
        <div className="admin-actions"><button>임시저장</button><button className="primary-admin">저장</button></div>
      </section>
    </AdminShell>
  );
}
