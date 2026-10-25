"use client";
// 문제은행 열람기 (출제자/채점자 공용). 실제 정리DB 문항.
// 운영진(출제자·채점자)에게는 모범답안 공개, 응시자에게는 비공개(이 컴포넌트는 운영진 전용).
import { useMemo, useState } from "react";
import { questionBank, questionBankIndex } from "@/lib/data";
import { Chip, Button, cx } from "./ui";

export function QuestionBrowser({
  mode = "author",
}: {
  mode?: "author" | "grader";
}) {
  const fields = questionBankIndex.map((x) => x.field);
  const [field, setField] = useState<string>(fields[0] ?? "");
  const [open, setOpen] = useState<Set<string>>(new Set());

  const list = useMemo(() => questionBank[field] ?? [], [field]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const modelLabel = mode === "grader" ? "📐 채점 기준(모범답안)" : "✅ 모범답안";

  return (
    <div className="flex flex-col gap-ds-4">
      {/* 분야 선택 (싱글 = 네모) */}
      <div className="flex flex-wrap gap-ds-2">
        {questionBankIndex.map((x) => (
          <Chip
            key={x.field}
            selected={x.field === field}
            onClick={() => {
              setField(x.field);
              setOpen(new Set());
            }}
          >
            {x.field}
            <span className="text-[10px] text-ds-muted">{x.count}</span>
          </Chip>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="text-body text-ds-muted m-0">이 분야에 등록된 문항이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-ds-3">
          {list.map((qn) => {
            const isOpen = open.has(qn.id);
            return (
              <div
                key={qn.id}
                className="bg-ds-base border border-ds-border rounded-ds-md p-ds-5 flex flex-col gap-ds-2"
              >
                <button
                  onClick={() => toggle(qn.id)}
                  className="flex items-center gap-ds-2 text-left"
                >
                  <span className="text-ds-muted">{isOpen ? "▲" : "▼"}</span>
                  <span className="inline-flex items-center h-5 px-ds-3 rounded-ds-full bg-ds-page border border-ds-border text-caption text-ds-secondary">
                    #{qn.originalNo}
                  </span>
                  <span className="text-caption text-ds-muted truncate flex-1">
                    {qn.large} · {qn.medium} · {qn.small}
                  </span>
                  <span className="flex gap-ds-1">
                    {qn.questions.length > 0 && (
                      <span className="text-[10px] text-ds-brand">
                        문제 {qn.questions.length}
                      </span>
                    )}
                    {qn.modelAnswer && (
                      <span className="text-[10px] text-ds-success">모범답안</span>
                    )}
                  </span>
                </button>

                {!isOpen && (
                  <p className="text-caption text-ds-secondary line-clamp-2 m-0">
                    {(qn.questions[0] ?? "(문제 본문 없음)").replace(/\n/g, " ")}
                  </p>
                )}

                {isOpen && (
                  <div className="flex flex-col gap-ds-3 mt-ds-1">
                    {qn.questions.map((qt, i) => (
                      <div key={i} className="flex flex-col gap-ds-1">
                        <span className="text-caption font-semibold text-ds-brand">
                          시험문제 안{i + 1}
                        </span>
                        <div className="ds-prewrap text-caption text-ds-secondary bg-ds-page rounded-ds-sm p-ds-4 border border-ds-border max-h-[220px] overflow-y-auto ds-scroll">
                          {qt}
                        </div>
                      </div>
                    ))}
                    {qn.answers.length > 0 &&
                      qn.answers.map((an, i) => (
                        <div key={`a${i}`} className="flex flex-col gap-ds-1">
                          <span className="text-caption font-semibold text-ds-secondary">
                            답안자료 안{i + 1}
                          </span>
                          <div className="ds-prewrap text-caption text-ds-secondary bg-ds-page rounded-ds-sm p-ds-4 border border-ds-border max-h-[180px] overflow-y-auto ds-scroll">
                            {an}
                          </div>
                        </div>
                      ))}
                    {qn.modelAnswer && (
                      <div className="flex flex-col gap-ds-1">
                        <span className="text-caption font-semibold text-ds-success">
                          {modelLabel}
                        </span>
                        <div className="ds-prewrap text-caption text-ds-secondary bg-[#eaf6e1] rounded-ds-sm p-ds-4 border border-ds-success max-h-[260px] overflow-y-auto ds-scroll">
                          {qn.modelAnswer}
                        </div>
                      </div>
                    )}
                    {qn.memo && (
                      <p className="text-caption text-ds-muted m-0">메모: {qn.memo}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
