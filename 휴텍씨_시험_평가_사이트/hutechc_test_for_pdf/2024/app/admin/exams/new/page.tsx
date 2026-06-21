import { AppShell } from "../../../../components/AppShell";
import { Button } from "../../../../components/Button";
import { PageHeader } from "../../../../components/PageHeader";

export default function NewExamPage() {
  return (
    <AppShell role="admin" title="시험관리">
      <main data-design-source="../../figma_pdf/2024/시험관리_신규.pdf">
        <PageHeader title="시험관리 신규" description="시험 유형, 응시 기간, 출제/채점 담당자를 등록합니다." />
        <section className="surface detail-section">
          <form className="form-stack">
            <div className="field">
              <label htmlFor="title">시험명</label>
              <input id="title" name="title" />
            </div>
            <div className="field">
              <label htmlFor="type">시험 유형</label>
              <select id="type" name="type">
                <option>단답형</option>
                <option>번역</option>
                <option>프롬프트</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="period">응시 기간</label>
              <input id="period" name="period" placeholder="YYYY-MM-DD ~ YYYY-MM-DD" />
            </div>
            <Button type="submit">저장</Button>
          </form>
        </section>
      </main>
    </AppShell>
  );
}
