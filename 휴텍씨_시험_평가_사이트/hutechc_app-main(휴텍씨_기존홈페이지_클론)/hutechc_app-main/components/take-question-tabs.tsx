"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TakeQuestion = {
  number: number;
  title: string;
  instruction: string;
  source: string;
  aiTranslation: string;
  wordCount: string;
  progress: string;
};

export function TakeQuestionTabs({ questions }: { questions: readonly TakeQuestion[] }) {
  const [selectedNumber, setSelectedNumber] = React.useState(questions[0]?.number ?? 1);
  const selectedQuestion = questions.find((question) => question.number === selectedNumber) ?? questions[0];

  if (!selectedQuestion) {
    return null;
  }

  return (
    <>
      <div className="flex overflow-x-auto border-b border-[#d9dee8] text-center text-sm font-semibold text-slate-400">
        {questions.map((question) => {
          const active = question.number === selectedQuestion.number;

          return (
            <button
              key={question.number}
              type="button"
              aria-pressed={active}
              className={cn(
                "h-12 min-w-[92px] shrink-0 border-b-2 px-3",
                active ? "border-[#0788ff] text-[#0788ff]" : "border-transparent hover:text-slate-700"
              )}
              onClick={() => setSelectedNumber(question.number)}
            >
              문제 {question.number}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">음성 내보내기</Button>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm">임시저장</Button>
          <Button size="sm">제출</Button>
        </div>
      </div>
      <section className="grid overflow-hidden rounded-lg border border-[#d9dee8] xl:grid-cols-3">
        <ExamColumn
          title={`문제 ${selectedQuestion.number}. ${selectedQuestion.title}`}
          footer={`글자수 : ${selectedQuestion.wordCount}`}
          tone="bg-white"
        >
          <p>{selectedQuestion.instruction}</p>
          <div className="mt-6 border-t border-[#d9dee8] pt-4">
            <b>원문</b>
            <p className="mt-2 whitespace-pre-line">{selectedQuestion.source}</p>
          </div>
        </ExamColumn>
        <ExamColumn title="AI 번역기" footer="사용 AI : ChatGPT" tone="bg-[#fff8e6]">
          <p>선택한 AI 번역기로 번역된 결과가 보여지는 영역입니다. 원문 의미와 문장 흐름을 확인하세요.</p>
          <p className="mt-3">{selectedQuestion.aiTranslation}</p>
        </ExamColumn>
        <ExamColumn title="답안지 작성" footer={`진행률 : ${selectedQuestion.progress}`} tone="bg-[#d8eaff]">
          <textarea
            className="min-h-[230px] w-full resize-none rounded-md border border-[#d9dee8] px-3 py-2 text-sm outline-none focus:border-[#0788ff]"
            placeholder={`문제 ${selectedQuestion.number} 답안을 입력하세요.`}
          />
        </ExamColumn>
      </section>
    </>
  );
}

function ExamColumn({ title, footer, tone, children }: { title: string; footer: string; tone: string; children: React.ReactNode }) {
  return (
    <section className="min-h-[420px] border-r border-[#d9dee8] bg-white last:border-r-0">
      <div className={cn("flex h-10 items-center justify-between border-b border-[#d9dee8] px-3 text-sm font-black", tone)}>
        {title}
      </div>
      <div className="min-h-[336px] p-3 text-sm leading-6 text-slate-900">{children}</div>
      <div className="h-9 border-t border-[#edf0f5] bg-[#f7f7f7] px-3 py-2 text-xs font-semibold text-slate-600">{footer}</div>
    </section>
  );
}
