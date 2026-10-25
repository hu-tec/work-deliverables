"use client";
// 출제자 홈: 문제은행 출제 현황(실제 정리DB) + 문제은행 열람. 출제 작성 화면은 예정.
import {
  Panel,
  SectionHead,
  Kpi,
  BarRow,
  Notice,
  SourceTag,
} from "@/components/ui";
import { QuestionBrowser } from "@/components/question-browser";
import { questionBankIndex } from "@/lib/data";

const TOTAL = questionBankIndex.reduce((s, x) => s + x.count, 0);
const WITH_Q = questionBankIndex.reduce((s, x) => s + x.withQuestion, 0);
const WITH_M = questionBankIndex.reduce((s, x) => s + x.withModelAnswer, 0);
const MAX = Math.max(...questionBankIndex.map((x) => x.count));
const byCount = [...questionBankIndex].sort((a, b) => b.count - a.count);

export default function AuthorHome() {
  return (
    <div className="flex flex-col gap-ds-7">
      <SectionHead
        title="🖊️ 출제자 홈"
        desc="문제 작성 · 임시저장 · 제출 · 반려 수정"
        right={<SourceTag />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-ds-4">
        <Kpi icon="❓" label="총 문항" value={`${TOTAL}문항`} sub={`${questionBankIndex.length}개 분야`} />
        <Kpi icon="📝" label="문제 본문 보유" value={WITH_Q} sub={`${Math.round((WITH_Q / TOTAL) * 100)}% 완성`} />
        <Kpi icon="✅" label="모범답안 보유" value={WITH_M} sub={`${Math.round((WITH_M / TOTAL) * 100)}% 완성`} />
        <Kpi icon="📂" label="출제 분야" value={questionBankIndex.length} sub="대분류 기준" />
      </div>

      <section className="flex flex-col gap-ds-3">
        <div className="flex items-center gap-ds-3">
          <h2 className="text-title font-bold m-0">📊 분야별 문항 수</h2>
          <span className="text-caption text-ds-muted">근거: 정리DB 문제은행</span>
        </div>
        <Panel className="flex flex-col gap-ds-3">
          {byCount.map((x) => (
            <BarRow key={x.field} label={x.field} value={x.count} max={MAX} suffix="문항" />
          ))}
        </Panel>
      </section>

      <Notice tone="info">
        <b>시험 출제하기 · 출제 내역 · 전문가 프로필</b> 작성/관리 화면은 다음 회차에
        구현 예정입니다. 아래에서 기존 문제은행을 열람할 수 있습니다.
      </Notice>

      <section className="flex flex-col gap-ds-3">
        <h2 className="text-title font-bold m-0">📚 문제은행 열람</h2>
        <QuestionBrowser mode="author" />
      </section>
    </div>
  );
}
