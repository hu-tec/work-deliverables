"use client";
// 1:1 문의: 수험생이 문의를 등록하고 처리 상태를 확인하는 데모 지원 화면.
import { useState } from "react";
import { useStore } from "@/components/providers";
import {
  Button,
  Chip,
  EmptyState,
  Notice,
  Panel,
  SectionHead,
  StatusBadge,
  cx,
} from "@/components/ui";
import type { InquiryCategory, InquiryStatus } from "@/lib/types";

const CATEGORIES: InquiryCategory[] = [
  "접수/결제",
  "시험 응시",
  "시험 결과",
  "자격증",
  "회원정보",
  "기타",
];
const STATUS_FILTERS: ("전체" | InquiryStatus)[] = [
  "전체",
  "접수",
  "처리중",
  "답변완료",
];

function fmt(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InquiryPage() {
  const { hydrated, inquiries, createInquiry, markInquiryAnswered } = useStore();
  const [category, setCategory] = useState<InquiryCategory>("시험 응시");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [filter, setFilter] = useState<"전체" | InquiryStatus>("전체");

  if (!hydrated)
    return <Panel><p className="text-body text-ds-muted m-0">불러오는 중…</p></Panel>;

  const filtered =
    filter === "전체" ? inquiries : inquiries.filter((q) => q.status === filter);

  const submit = () => {
    if (!title.trim() || !body.trim()) {
      alert("제목과 문의 내용을 입력하세요.");
      return;
    }
    createInquiry({ category, title: title.trim(), body: body.trim() });
    setTitle("");
    setBody("");
  };

  return (
    <div className="flex flex-col gap-ds-5">
      <SectionHead
        title="💬 1:1 문의"
        desc="접수, 결제, 응시, 결과, 자격증 관련 문의를 남기고 처리 상태를 확인합니다."
      />

      <Panel className="flex flex-col gap-ds-4">
        <div className="flex flex-col gap-ds-2">
          <span className="text-caption text-ds-secondary font-medium">문의 유형</span>
          <div className="flex flex-wrap gap-ds-2">
            {CATEGORIES.map((c) => (
              <Chip key={c} selected={category === c} onClick={() => setCategory(c)}>
                {c}
              </Chip>
            ))}
          </div>
        </div>
        <label className="flex flex-col gap-ds-2">
          <span className="text-caption text-ds-secondary font-medium">제목</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="문의 제목을 입력하세요"
            className="w-full h-8 px-ds-5 text-body bg-ds-base border border-ds-border rounded-ds-sm placeholder:text-ds-muted focus:border-ds-brand"
          />
        </label>
        <label className="flex flex-col gap-ds-2">
          <span className="text-caption text-ds-secondary font-medium">문의 내용</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="상황, 접수번호, 오류 화면 등 확인이 필요한 내용을 적어 주세요."
            className="w-full min-h-[140px] p-ds-5 text-body bg-ds-base border border-ds-border rounded-ds-sm placeholder:text-ds-muted focus:border-ds-brand resize-y ds-prewrap"
          />
        </label>
        <div className="flex justify-end">
          <Button onClick={submit}>문의 등록</Button>
        </div>
      </Panel>

      <section className="flex flex-col gap-ds-3">
        <div className="flex flex-wrap items-center justify-between gap-ds-3">
          <h2 className="text-title font-bold m-0">문의 내역</h2>
          <div className="flex flex-wrap gap-ds-2">
            {STATUS_FILTERS.map((s) => (
              <Chip key={s} selected={filter === s} onClick={() => setFilter(s)}>
                {s}
              </Chip>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <Panel>
            <EmptyState
              title="문의 내역이 없습니다"
              desc="문의가 등록되면 이곳에서 처리 상태를 확인할 수 있습니다."
            />
          </Panel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-ds-4">
            {filtered.map((q) => (
              <Panel key={q.id} className="flex flex-col gap-ds-3">
                <div className="flex items-start justify-between gap-ds-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-ds-2 mb-ds-1">
                      <span className="inline-flex items-center h-6 px-ds-4 rounded-ds-sm bg-ds-selected text-ds-brand text-caption font-semibold">
                        {q.category}
                      </span>
                      <span className="text-caption text-ds-muted">{fmt(q.createdAt)}</span>
                    </div>
                    <h3 className="text-subtitle font-bold m-0 truncate" title={q.title}>
                      {q.title}
                    </h3>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
                <p className="ds-prewrap text-body text-ds-secondary m-0">{q.body}</p>
                {q.answer ? (
                  <div className="rounded-ds-sm border border-ds-border bg-ds-page p-ds-5">
                    <div className="flex items-center justify-between gap-ds-3 mb-ds-2">
                      <span className="text-caption font-semibold text-ds-primary">
                        답변
                      </span>
                      {q.answeredAt && (
                        <span className="text-caption text-ds-muted">
                          {fmt(q.answeredAt)}
                        </span>
                      )}
                    </div>
                    <p className="ds-prewrap text-caption text-ds-secondary m-0">
                      {q.answer}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-ds-3">
                    <span className={cx("text-caption text-ds-muted")}>
                      문의번호 {q.id}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markInquiryAnswered(q.id)}
                    >
                      답변완료 시연
                    </Button>
                  </div>
                )}
              </Panel>
            ))}
          </div>
        )}
      </section>

      <Notice tone="demo">
        문의 등록과 답변완료 처리는 브라우저에 저장되는 데모 기능입니다. 실제 운영에서는
        관리자 답변, 알림, 첨부파일 연동이 필요합니다.
      </Notice>
    </div>
  );
}
