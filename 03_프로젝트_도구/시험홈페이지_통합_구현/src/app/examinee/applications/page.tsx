"use client";
// 내 접수/결제: 데이터 테이블(시간 첫 열·비고 마지막 열) + 전체/항목별 펼치기 + 결제/취소 CRUD.
import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/components/providers";
import {
  Panel,
  SectionHead,
  Button,
  Chip,
  StatusBadge,
  EmptyState,
  cx,
} from "@/components/ui";
import { getExamById } from "@/lib/demo-exams";

const LS_NOTES = "hxc.appNotes";

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${mm}/${dd} ${hh}:${mi}`;
}

const COLS = "92px 1fr 84px 88px 84px 84px 132px 1.2fr";

export default function ApplicationsPage() {
  const { hydrated, applications, pay, cancelApplication } = useStore();
  const [allOpen, setAllOpen] = useState(false);
  const [openRows, setOpenRows] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});

  // 비고는 사용자가 직접 입력한 텍스트만 저장 (로컬)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_NOTES);
      if (raw) setNotes(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);
  const saveNote = (id: string, text: string) => {
    setNotes((prev) => {
      const next = { ...prev, [id]: text };
      try {
        localStorage.setItem(LS_NOTES, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const toggleRow = (id: string) =>
    setOpenRows((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const isOpen = (id: string) => allOpen || openRows.has(id);

  const onCancel = (id: string) => {
    if (confirm("정말 접수를 취소하시겠습니까? (환불 신청 처리됩니다)"))
      cancelApplication(id);
  };

  if (!hydrated)
    return <Panel><p className="text-body text-ds-muted m-0">불러오는 중…</p></Panel>;

  return (
    <div className="flex flex-col gap-ds-5">
      <SectionHead
        title="💳 내 접수 / 결제"
        desc="접수한 시험의 결제·취소를 관리합니다. (접수일 최신순)"
        right={
          <Chip selected={allOpen} onClick={() => setAllOpen((v) => !v)}>
            {allOpen ? "▲ 전체 접기" : "▼ 전체 펼치기"}
          </Chip>
        }
      />

      {applications.length === 0 ? (
        <Panel>
          <EmptyState
            title="접수한 시험이 없습니다"
            desc="시험을 접수하면 여기서 결제와 취소를 관리할 수 있어요."
            action={
              <Link href="/examinee/exams">
                <Button>📝 시험 접수하러 가기</Button>
              </Link>
            }
          />
        </Panel>
      ) : (
        <Panel pad={false} className="overflow-x-auto ds-scroll">
          <div className="min-w-[860px]">
            {/* header */}
            <div
              className="grid items-center px-ds-6 py-ds-4 border-b border-ds-border bg-ds-page text-caption font-semibold text-ds-secondary"
              style={{ gridTemplateColumns: COLS }}
            >
              <span>접수일</span>
              <span>시험</span>
              <span>접수</span>
              <span>결제</span>
              <span>시험진행</span>
              <span className="text-right">응시료</span>
              <span className="text-center">작업</span>
              <span>비고</span>
            </div>
            {/* rows */}
            {applications.map((a) => {
              const ex = getExamById(a.examId);
              const canceled = a.registerStatus === "접수 취소";
              const open = isOpen(a.id);
              return (
                <div key={a.id} className="border-b border-ds-border last:border-0">
                  <div
                    className={cx(
                      "grid items-center px-ds-6 py-ds-4 text-caption hover:bg-ds-soft",
                      canceled && "opacity-55",
                    )}
                    style={{ gridTemplateColumns: COLS }}
                  >
                    <span className="text-ds-muted tabular-nums">
                      {fmtDate(a.appliedAt)}
                    </span>
                    <button
                      onClick={() => toggleRow(a.id)}
                      className="flex items-center gap-ds-2 text-left min-w-0"
                      title="클릭하여 상세 펼치기"
                    >
                      <span className="text-ds-muted">{open ? "▲" : "▼"}</span>
                      <span className="flex flex-col min-w-0">
                        <span className="font-semibold text-ds-primary truncate">
                          {ex?.subject} {ex?.grade}
                        </span>
                        <span className="text-ds-muted truncate">{ex?.round}</span>
                      </span>
                    </button>
                    <span>
                      <StatusBadge status={a.registerStatus} />
                    </span>
                    <span>
                      <StatusBadge status={a.paymentStatus} />
                    </span>
                    <span>
                      <StatusBadge status={a.examStatus} />
                    </span>
                    <span className="text-right tabular-nums font-medium">
                      {ex ? `${ex.fee.toLocaleString()}원` : "-"}
                    </span>
                    <span className="flex items-center justify-center gap-ds-2">
                      {!canceled && a.paymentStatus === "결제대기" && (
                        <Button size="sm" onClick={() => pay(a.id)}>
                          결제
                        </Button>
                      )}
                      {!canceled && a.examStatus === "시험 전" && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => onCancel(a.id)}
                        >
                          취소
                        </Button>
                      )}
                      {(canceled || a.examStatus !== "시험 전") &&
                        a.paymentStatus !== "결제대기" && (
                          <span className="text-ds-disabled">—</span>
                        )}
                    </span>
                    <span>
                      <input
                        defaultValue={notes[a.id] ?? ""}
                        onBlur={(e) => saveNote(a.id, e.target.value)}
                        placeholder="메모…"
                        className="w-full h-7 px-ds-3 text-caption bg-ds-base border border-ds-border rounded-ds-xs placeholder:text-ds-muted focus:border-ds-brand"
                      />
                    </span>
                  </div>

                  {open && ex && (
                    <div
                      className="px-ds-9 pb-ds-5 pt-ds-1 bg-ds-soft grid grid-cols-2 md:grid-cols-4 gap-x-ds-6 gap-y-ds-3 text-caption"
                      style={{ paddingLeft: "92px" }}
                    >
                      <Detail label="분야" value={`${ex.fieldLarge} · ${ex.fieldMedium}`} />
                      <Detail label="지역" value={ex.region} />
                      <Detail label="시험일시" value={`${ex.examDate} ${ex.examStart}~${ex.examEnd}`} />
                      <Detail label="성적발표" value={ex.resultDate} />
                      <Detail label="접수기간" value={`${ex.registerStart} ~ ${ex.registerEnd}`} />
                      <Detail label="교시 구성" value={ex.questionTypes.join(", ")} />
                      <Detail label="결과 상태" value={a.resultStatus} />
                      <Detail label="접수번호" value={a.id} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col min-w-0">
      <span className="text-ds-muted">{label}</span>
      <span className="text-ds-secondary truncate" title={value}>
        {value}
      </span>
    </div>
  );
}
