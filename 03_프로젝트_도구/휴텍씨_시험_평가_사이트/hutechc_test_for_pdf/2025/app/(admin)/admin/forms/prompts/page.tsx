import { AdminShell } from "@/components/AppShell";

export default function PromptFirstPage() {
  return (
    <AdminShell title="프롬프트 첫화면" crumb="양식관리 > 프롬프트">
      <section className="prompt-admin">
        <aside>
          <button className="selected">보유한 양식에 텍스트 입력</button>
          <button>나만의 양식 만들기</button>
          <button>양식 생성 후 내용 작성</button>
        </aside>
        <div>
          <label>첫 입력 문구<textarea defaultValue="파일 업로드 또는 AI 텍스트를 입력해 주세요." /></label>
          <label>적용 액션<select><option>추천 서식 표시</option><option>템플릿 생성</option></select></label>
          <button className="primary-admin">적용</button>
        </div>
      </section>
    </AdminShell>
  );
}
