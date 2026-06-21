import { ClassificationRuleSelector } from "@/components/ClassificationRuleSelector";
import { ClassificationStepTabs } from "@/components/ClassificationStepTabs";
import { UploadClassificationShell } from "@/components/UploadClassificationShell";
import { initialJob } from "@/lib/fixtures";

export default function RulesPage() {
  return (
    <UploadClassificationShell title="구분기준" active="구분기준">
      <ClassificationStepTabs job={initialJob} />
      <ClassificationRuleSelector />
      <section className="rule-detail">
        <h2>일괄 구분 기준</h2>
        <div className="rule-editor-grid">
          {["회원 유형", "시험 상태", "시험 결과", "알림 채널", "활동 상태", "서비스 유형"].map((item) => (
            <label key={item}>
              {item}
              <select>
                <option>전체</option>
                <option>선택 조건 우선</option>
                <option>업로드 파일 값 우선</option>
              </select>
            </label>
          ))}
        </div>
      </section>
    </UploadClassificationShell>
  );
}
