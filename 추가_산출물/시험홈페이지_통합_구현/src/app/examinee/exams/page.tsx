"use client";
// 시험 접수: 실제 옵션값 기준 시험 목록 + 멀티 칩 필터 + 검색 + 접수(데모 회차).
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/providers";
import {
  Panel,
  SectionHead,
  Chip,
  Button,
  StatusBadge,
  Input,
  DemoBadge,
  Notice,
  cx,
} from "@/components/ui";
import { DEMO_EXAMS, computeRegisterStatus } from "@/lib/demo-exams";
import type { ExamOffering } from "@/lib/types";

const SUBJECTS = Array.from(new Set(DEMO_EXAMS.map((e) => e.subject)));
const GROUPS = Array.from(new Set(DEMO_EXAMS.map((e) => e.gradeGroup)));
const REGIONS = Array.from(new Set(DEMO_EXAMS.map((e) => e.region)));

export default function ExamRegisterPage() {
  const { hydrated, applications, apply } = useStore();
  const router = useRouter();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [onlyOpen, setOnlyOpen] = useState(false); // 싱글 토글
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (
    arr: string[],
    set: (v: string[]) => void,
    v: string,
  ) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const appliedExamIds = useMemo(
    () =>
      new Set(
        applications
          .filter((a) => a.registerStatus !== "접수 취소")
          .map((a) => a.examId),
      ),
    [applications],
  );

  const filtered = useMemo(() => {
    return DEMO_EXAMS.filter((e) => {
      if (subjects.length && !subjects.includes(e.subject)) return false;
      if (groups.length && !groups.includes(e.gradeGroup)) return false;
      if (regions.length && !regions.includes(e.region)) return false;
      if (onlyOpen && computeRegisterStatus(e) !== "접수 중") return false;
      if (q.trim()) {
        const hay = `${e.round} ${e.subject} ${e.grade} ${e.fieldLarge} ${e.fieldMedium} ${e.region}`;
        if (!hay.includes(q.trim())) return false;
      }
      return true;
    });
  }, [subjects, groups, regions, onlyOpen, q]);

  const doApply = (e: ExamOffering) => {
    const id = apply(e.id);
    if (id) router.push("/examinee/applications");
  };

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <div className="flex flex-col gap-ds-6">
      <SectionHead
        title="📝 시험 접수"
        desc="시험종목·등급·분야·응시료·지역은 실제 정리DB 기준입니다."
        right={<DemoBadge label="회차·일정 데모" />}
      />

      {/* 필터 */}
      <Panel className="flex flex-col gap-ds-4">
        <FilterRow label="시험종목">
          {SUBJECTS.map((s) => (
            <Chip
              key={s}
              pill
              selected={subjects.includes(s)}
              onClick={() => toggle(subjects, setSubjects, s)}
            >
              {s}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="등급구분">
          {GROUPS.map((g) => (
            <Chip
              key={g}
              pill
              selected={groups.includes(g)}
              onClick={() => toggle(groups, setGroups, g)}
            >
              {g}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="지역">
          {REGIONS.map((r) => (
            <Chip
              key={r}
              pill
              selected={regions.includes(r)}
              onClick={() => toggle(regions, setRegions, r)}
            >
              {r}
            </Chip>
          ))}
        </FilterRow>
        <div className="flex flex-wrap items-center gap-ds-3">
          <Chip selected={onlyOpen} onClick={() => setOnlyOpen((v) => !v)}>
            ✅ 접수 중만 보기
          </Chip>
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="🔍 회차 · 종목 · 분야 · 지역 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <span className="text-caption text-ds-muted">
            {filtered.length}건 / 전체 {DEMO_EXAMS.length}건
          </span>
        </div>
      </Panel>

      {/* 목록 (다단 그리드) */}
      {filtered.length === 0 ? (
        <Panel>
          <p className="text-body text-ds-muted m-0">조건에 맞는 시험이 없습니다.</p>
        </Panel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-ds-4">
          {filtered.map((e) => {
            const status = computeRegisterStatus(e);
            const open = status === "접수 중";
            const already = appliedExamIds.has(e.id);
            const isExp = expanded.has(e.id);
            const rate = Math.round((e.applied / e.capacity) * 100);
            return (
              <Panel key={e.id} className="flex flex-col gap-ds-3">
                <div className="flex items-start justify-between gap-ds-2">
                  <div className="flex items-center gap-ds-2 flex-wrap">
                    <span className="inline-flex items-center h-6 px-ds-4 rounded-ds-sm bg-ds-selected text-ds-brand text-caption font-semibold">
                      {e.subject}
                    </span>
                    <span className="text-caption text-ds-secondary">
                      {e.gradeGroup} {e.grade}
                    </span>
                  </div>
                  <StatusBadge status={status} />
                </div>
                <div className="text-subtitle font-semibold leading-snug">
                  {e.round}
                </div>

                <dl className="grid grid-cols-2 gap-x-ds-4 gap-y-ds-2 m-0 text-caption">
                  <Spec label="분야" value={`${e.fieldLarge}·${e.fieldMedium}`} />
                  <Spec label="지역" value={e.region} />
                  <Spec label="시험일" value={`${e.examDate} ${e.examStart}`} />
                  <Spec label="응시료" value={`${e.fee.toLocaleString()}원`} strong />
                </dl>

                <div className="flex items-center gap-ds-2 text-caption text-ds-muted">
                  <span className="flex-1 h-2 rounded-ds-full bg-ds-page overflow-hidden border border-ds-border">
                    <span
                      className="block h-full bg-ds-brand"
                      style={{ width: `${Math.min(100, rate)}%` }}
                    />
                  </span>
                  <span className="tabular-nums">
                    {e.applied}/{e.capacity} ({rate}%)
                  </span>
                </div>

                {isExp && (
                  <div className="flex flex-col gap-ds-3 border-t border-ds-border pt-ds-3 text-caption">
                    <Spec
                      label="접수기간"
                      value={`${e.registerStart} ~ ${e.registerEnd}`}
                    />
                    <Spec
                      label="시험시간"
                      value={`${e.examStart} ~ ${e.examEnd}`}
                    />
                    <Spec label="성적발표" value={e.resultDate} />
                    <div className="flex flex-col">
                      <span className="text-ds-muted">교시 구성</span>
                      <div className="flex flex-wrap gap-ds-2 mt-ds-1">
                        {e.questionTypes.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center h-5 px-ds-3 rounded-ds-full bg-ds-page border border-ds-border text-ds-secondary"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    {e.questionFields.length > 0 && (
                      <Spec
                        label="문제은행 분야"
                        value={e.questionFields.join(", ")}
                      />
                    )}
                  </div>
                )}

                <div className="flex items-center gap-ds-2 mt-ds-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(e.id)}
                  >
                    {isExp ? "▲ 접기" : "▼ 상세"}
                  </Button>
                  <div className="flex-1" />
                  {already ? (
                    <Button size="sm" variant="neutral" disabled>
                      접수 완료됨
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={!open || !hydrated}
                      onClick={() => doApply(e)}
                    >
                      {open ? "접수하기" : "접수 불가"}
                    </Button>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      )}

      <Notice tone="demo">
        회차·일정·정원·접수인원은 플로우 시연용 데모 데이터입니다. 접수 후 결제/응시
        흐름은 브라우저에 저장되어 시연됩니다.
      </Notice>
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-ds-3">
      <span className="text-caption text-ds-muted w-[64px] shrink-0 pt-ds-2">
        {label}
      </span>
      <div className="flex flex-wrap gap-ds-2">{children}</div>
    </div>
  );
}

function Spec({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-ds-muted">{label}</span>
      <span
        className={cx(
          "text-ds-secondary truncate",
          strong && "text-ds-primary font-semibold",
        )}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
