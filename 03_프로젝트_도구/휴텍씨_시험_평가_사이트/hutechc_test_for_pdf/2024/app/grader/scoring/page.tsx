import { AppShell } from "../../../components/AppShell";
import { Button } from "../../../components/Button";
import { PageHeader } from "../../../components/PageHeader";

export default function ScoringPage() {
  return (
    <AppShell role="grader" title="채점관리">
      <main data-design-source="../../figma_pdf/2024/채점관리_단답형상세.pdf">
        <PageHeader title="단답형 채점 상세" description="응시 답안, 기준 정답, 피드백을 확인하고 점수를 제출합니다." />
        <section className="surface detail-section">
          <form className="form-stack">
            <div className="field">
              <label htmlFor="submitted">응시 답안</label>
              <textarea id="submitted" defaultValue="AI가 문맥을 분석해 번역 품질을 평가한다." />
            </div>
            <div className="field">
              <label htmlFor="score">점수</label>
              <input id="score" type="number" />
            </div>
            <div className="field">
              <label htmlFor="feedback">피드백</label>
              <textarea id="feedback" />
            </div>
            <Button>채점 제출</Button>
          </form>
        </section>
      </main>
    </AppShell>
  );
}
