"use client";
// 게스트 랜딩: 서비스 소개 우선 → 시험 안내 → 역할 진입 → 회사 소개 (홈페이지 구성 원칙).
import { useRouter } from "next/navigation";
import { useStore } from "@/components/providers";
import {
  Button,
  Panel,
  StatusBadge,
  DemoBadge,
  SourceTag,
  Kpi,
  cx,
} from "@/components/ui";
import { ROLES, type Role } from "@/lib/roles";
import { DEMO_EXAMS, computeRegisterStatus } from "@/lib/demo-exams";
import {
  classification,
  grades,
  questionBankIndex,
  fieldDictionary,
  getSetting,
} from "@/lib/data";

const ENTRY_ROLES: Role[] = ["examinee", "author", "grader", "admin"];
const ROLE_ICON: Record<Role, string> = {
  guest: "🏠",
  examinee: "✍️",
  author: "🖊️",
  grader: "✅",
  admin: "🛠️",
};

// 실제 정리DB 집계 (가짜/추측 없음)
const TOTAL_Q = questionBankIndex.reduce((s, x) => s + x.count, 0);
const SUBJECTS = getSetting("시험종목");

export default function LandingPage() {
  const { setRole } = useStore();
  const router = useRouter();

  const enter = (r: Role) => {
    setRole(r);
    router.push(ROLES[r].home);
  };

  const goExams = () => {
    setRole("examinee");
    router.push("/examinee/exams");
  };

  // 접수 중인 시험만 상단 노출
  const openExams = DEMO_EXAMS.filter(
    (e) => computeRegisterStatus(e) === "접수 중",
  );

  return (
    <div className="flex flex-col gap-ds-10">
      {/* ===== Hero (서비스 소개 우선) ===== */}
      <section className="flex flex-col gap-ds-6 pt-ds-7">
        <div className="flex items-center gap-ds-3">
          <span className="inline-flex items-center h-6 px-ds-4 rounded-ds-full bg-ds-selected text-ds-brand text-caption font-medium">
            🧩 통합 시험 플랫폼
          </span>
          <span className="text-caption text-ds-muted">
            2024 토대 · 2025 UX · vibecoding 관리
          </span>
        </div>
        <h1 className="text-display font-bold m-0 leading-tight">
          AI 역량을 검증하는
          <br />
          휴텍씨 시험 플랫폼
        </h1>
        <p className="text-subtitle text-ds-secondary m-0 max-w-[640px]">
          프롬프트 · AI번역 · 윤리 · 테솔 시험을 한 곳에서. 접수부터 결제, 응시,
          채점, 결과 발표, 자격증 신청까지 하나의 흐름으로 이어집니다.
        </p>
        <div className="flex flex-wrap items-center gap-ds-3">
          <Button size="lg" onClick={goExams}>
            📝 시험 접수하러 가기
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() =>
              document
                .getElementById("roles")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            🚪 역할별 둘러보기
          </Button>
        </div>
      </section>

      {/* ===== 실제 데이터 현황 (근거 = 정리DB) ===== */}
      <section className="flex flex-col gap-ds-4">
        <div className="flex items-center gap-ds-3">
          <h2 className="text-title font-bold m-0">📊 플랫폼 데이터 현황</h2>
          <SourceTag />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-ds-4">
          <Kpi
            icon="❓"
            label="문제은행 문항"
            value={`${TOTAL_Q}문항`}
            sub={`${questionBankIndex.length}개 분야`}
          />
          <Kpi
            icon="🏷️"
            label="분류 항목"
            value={classification.length}
            sub="대·중·소분류"
          />
          <Kpi icon="🎓" label="급수 정의" value={grades.length} sub="시험종류별" />
          <Kpi
            icon="📖"
            label="통합 항목사전"
            value={fieldDictionary.length}
            sub="컬럼 정의"
          />
          <Kpi
            icon="🧪"
            label="시험 종목"
            value={SUBJECTS.length}
            sub={SUBJECTS.join(" · ")}
          />
        </div>
      </section>

      {/* ===== 시험 안내 (회차/일정은 데모) ===== */}
      <section id="exams" className="flex flex-col gap-ds-5 scroll-mt-[72px]">
        <div className="flex items-end justify-between gap-ds-4">
          <div>
            <div className="flex items-center gap-ds-3">
              <h2 className="text-h2 font-bold m-0">📋 진행 중인 시험 접수</h2>
              <DemoBadge label="회차·일정 데모" />
            </div>
            <p className="text-caption text-ds-muted m-0 mt-ds-1">
              시험종목·등급·분야·응시료·지역은 실제 정리DB 기준이며, 회차/일정/정원은
              시연용 데모입니다.
            </p>
          </div>
          <Button variant="outline" onClick={goExams}>
            전체 시험 보기 →
          </Button>
        </div>
        {openExams.length === 0 ? (
          <Panel>
            <p className="text-body text-ds-muted m-0">
              현재 접수 중인 시험이 없습니다.
            </p>
          </Panel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-ds-4">
            {openExams.map((ex) => {
              const status = computeRegisterStatus(ex);
              const rate = Math.round((ex.applied / ex.capacity) * 100);
              return (
                <Panel key={ex.id} className="flex flex-col gap-ds-3" pad>
                  <div className="flex items-start justify-between gap-ds-2">
                    <div className="flex items-center gap-ds-2 flex-wrap">
                      <span className="inline-flex items-center h-6 px-ds-4 rounded-ds-sm bg-ds-selected text-ds-brand text-caption font-semibold">
                        {ex.subject}
                      </span>
                      <span className="text-caption text-ds-secondary">
                        {ex.gradeGroup} {ex.grade}
                      </span>
                    </div>
                    <StatusBadge status={status} />
                  </div>
                  <div className="text-subtitle font-semibold leading-snug">
                    {ex.round}
                  </div>
                  <dl className="grid grid-cols-2 gap-x-ds-4 gap-y-ds-2 m-0 text-caption">
                    <Spec label="분야" value={`${ex.fieldLarge} · ${ex.fieldMedium}`} />
                    <Spec label="지역" value={ex.region} />
                    <Spec label="시험일" value={ex.examDate} />
                    <Spec
                      label="응시료"
                      value={`${ex.fee.toLocaleString()}원`}
                      strong
                    />
                    <Spec
                      label="접수기간"
                      value={`~${ex.registerEnd.slice(5)}`}
                    />
                    <Spec
                      label="접수율"
                      value={`${ex.applied}/${ex.capacity} (${rate}%)`}
                    />
                  </dl>
                  <Button className="mt-ds-1" onClick={goExams}>
                    접수하기
                  </Button>
                </Panel>
              );
            })}
          </div>
        )}
      </section>

      {/* ===== 역할 진입 ===== */}
      <section id="roles" className="flex flex-col gap-ds-5 scroll-mt-[72px]">
        <h2 className="text-h2 font-bold m-0">🚪 역할별 진입</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-ds-4">
          {ENTRY_ROLES.map((r) => {
            const meta = ROLES[r];
            const icon = ROLE_ICON[r];
            return (
              <button
                key={r}
                onClick={() => enter(r)}
                className="text-left bg-ds-base border border-ds-border rounded-ds-md p-ds-7 flex flex-col gap-ds-3 hover:border-ds-brand hover:bg-ds-soft transition-colors"
              >
                <span className="text-h2">{icon}</span>
                <span className="text-subtitle font-bold">{meta.label}</span>
                <span className="text-caption text-ds-muted flex-1">
                  {meta.desc}
                </span>
                <span className="text-caption text-ds-brand font-medium">
                  바로 진입 →
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== 회사 소개 (후순위, 하단) ===== */}
      <section className="flex flex-col gap-ds-3 border-t border-ds-border pt-ds-8">
        <h2 className="text-title font-bold m-0">🏢 휴텍씨 소개</h2>
        <p className="text-body text-ds-secondary m-0 max-w-[760px]">
          휴텍씨(hu-tec)는 AI 활용 역량 검증을 위한 시험·교육 플랫폼을 운영합니다.
          본 통합 플랫폼은 2024 시험 운영 토대를 기반으로, 2025 UX 개편과 vibecoding
          고밀도 관리 기능을 단계적으로 통합합니다.
        </p>
        <div className="flex flex-wrap gap-ds-4 text-caption text-ds-muted">
          <span>실적 — 다수 시험 회차 운영</span>
          <span>·</span>
          <span>전문가(출제·채점) 신청</span>
          <span>·</span>
          <span>기업 견적 의뢰</span>
        </div>
      </section>
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
      <dt className="text-ds-muted">{label}</dt>
      <dd
        className={cx(
          "m-0 text-ds-secondary truncate",
          strong && "text-ds-primary font-semibold",
        )}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}
