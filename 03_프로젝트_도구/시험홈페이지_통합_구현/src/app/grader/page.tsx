"use client";
// 채점자 홈: 채점 기준(모범답안) 보유 현황 + 채점 기준표 열람. 채점 실행 화면은 예정.
import {
  Panel,
  SectionHead,
  Kpi,
  BarRow,
  Notice,
  SourceTag,
} from "@/components/ui";
import { QuestionBrowser } from "@/components/question-browser";
import { questionBankIndex, getSetting } from "@/lib/data";

const TOTAL = questionBankIndex.reduce((s, x) => s + x.count, 0);
const WITH_M = questionBankIndex.reduce((s, x) => s + x.withModelAnswer, 0);
const MAX_M = Math.max(...questionBankIndex.map((x) => x.withModelAnswer));
const byModel = [...questionBankIndex].sort(
  (a, b) => b.withModelAnswer - a.withModelAnswer,
);
const SCORING = getSetting("채점방식");

export default function GraderHome() {
  return (
    <div className="flex flex-col gap-ds-7">
      <SectionHead
        title="✅ 채점자 홈"
        desc="배정 답안 채점 · 피드백 · 채점내역"
        right={<SourceTag />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-ds-4">
        <Kpi icon="📐" label="채점 기준 보유" value={WITH_M} sub={`전체 ${TOTAL}문항 중`} />
        <Kpi
          icon="📊"
          label="기준 완성률"
          value={`${Math.round((WITH_M / TOTAL) * 100)}%`}
          sub="모범답안 기준"
        />
        <Kpi icon="📂" label="채점 분야" value={questionBankIndex.length} sub="대분류 기준" />
        <Kpi
          icon="🧮"
          label="채점 방식"
          value={SCORING.length || "-"}
          sub={SCORING.join(" · ") || "정리DB 미지정"}
        />
      </div>

      <section className="flex flex-col gap-ds-3">
        <div className="flex items-center gap-ds-3">
          <h2 className="text-title font-bold m-0">📐 분야별 채점 기준(모범답안) 보유</h2>
          <span className="text-caption text-ds-muted">근거: 정리DB 문제은행</span>
        </div>
        <Panel className="flex flex-col gap-ds-3">
          {byModel.map((x) => (
            <BarRow
              key={x.field}
              label={x.field}
              value={x.withModelAnswer}
              max={MAX_M}
              suffix="건"
              tone="success"
            />
          ))}
        </Panel>
      </section>

      <Notice tone="info">
        <b>시험 채점하기 · 채점 내역</b> 실행 화면은 다음 회차에 구현 예정입니다.
        아래에서 채점 기준표(문항별 모범답안)를 열람할 수 있습니다.
      </Notice>

      <section className="flex flex-col gap-ds-3">
        <h2 className="text-title font-bold m-0">📚 채점 기준표 열람</h2>
        <QuestionBrowser mode="grader" />
      </section>
    </div>
  );
}
