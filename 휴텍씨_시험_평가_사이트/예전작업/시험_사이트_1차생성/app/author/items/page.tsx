import { AppShell } from "../../../components/AppShell";
import { Button } from "../../../components/Button";
import { PageHeader } from "../../../components/PageHeader";

export default function AuthorItemsPage() {
  return (
    <AppShell role="author" title="출제관리">
      <main data-design-source="../../figma_pdf/2024/출제관리_단답형상세.pdf">
        <PageHeader title="단답형 출제 상세" description="문항, 정답, 배점, 검수 메모를 저장합니다." />
        <section className="surface detail-section">
          <form className="form-stack">
            <div className="field">
              <label htmlFor="question">문항</label>
              <textarea id="question" />
            </div>
            <div className="field">
              <label htmlFor="answer">정답</label>
              <input id="answer" />
            </div>
            <div className="field">
              <label htmlFor="score">배점</label>
              <input id="score" type="number" />
            </div>
            <Button>임시저장</Button>
          </form>
        </section>
      </main>
    </AppShell>
  );
}
