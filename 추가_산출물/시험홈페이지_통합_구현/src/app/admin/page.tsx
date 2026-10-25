"use client";
// 관리자 홈: 운영 KPI 대시보드. 실제 정리DB 집계 + 데모 시험 회차 통계.
// vibecoding 고밀도 관리 화면(회원/시험/문제/채점/결제/통계)은 예정.
import {
  Panel,
  SectionHead,
  Kpi,
  BarRow,
  Notice,
  SourceTag,
  DemoBadge,
} from "@/components/ui";
import {
  classification,
  grades,
  fieldDictionary,
  questionBankIndex,
  examSettings,
} from "@/lib/data";
import { DEMO_EXAMS, computeRegisterStatus } from "@/lib/demo-exams";
import { ROLE_MENUS } from "@/lib/roles";

const TOTAL_Q = questionBankIndex.reduce((s, x) => s + x.count, 0);
const MAX_Q = Math.max(...questionBankIndex.map((x) => x.count));
const byCount = [...questionBankIndex].sort((a, b) => b.count - a.count);

// 데모 시험 통계
const CAP = DEMO_EXAMS.reduce((s, e) => s + e.capacity, 0);
const APPLIED = DEMO_EXAMS.reduce((s, e) => s + e.applied, 0);
const OPEN = DEMO_EXAMS.filter((e) => computeRegisterStatus(e) === "접수 중").length;
const examRates = [...DEMO_EXAMS]
  .map((e) => ({
    label: `${e.subject} ${e.grade}`,
    rate: Math.round((e.applied / e.capacity) * 100),
  }))
  .sort((a, b) => b.rate - a.rate);

const ADMIN_MENU = ROLE_MENUS.admin.flatMap((g) => g.items).filter(
  (i) => i.href !== "/admin",
);

export default function AdminHome() {
  return (
    <div className="flex flex-col gap-ds-7">
      <SectionHead
        title="🛠️ 관리자 홈"
        desc="회원 · 시험 · 문제 · 채점 · 결제 · 운영 · 통계 통합 현황"
      />

      {/* 실제 정리DB KPI */}
      <section className="flex flex-col gap-ds-3">
        <div className="flex items-center gap-ds-3">
          <h2 className="text-title font-bold m-0">📦 데이터 자산</h2>
          <SourceTag />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-ds-4">
          <Kpi icon="❓" label="문제은행" value={`${TOTAL_Q}문항`} sub={`${questionBankIndex.length}개 분야`} />
          <Kpi icon="🏷️" label="분류 항목" value={classification.length} sub="대·중·소분류" />
          <Kpi icon="🎓" label="급수 정의" value={grades.length} sub="시험종류별" />
          <Kpi icon="📖" label="통합 항목사전" value={fieldDictionary.length} sub={`설정 그룹 ${examSettings.length}`} />
        </div>
      </section>

      {/* 데모 시험 운영 KPI */}
      <section className="flex flex-col gap-ds-3">
        <div className="flex items-center gap-ds-3">
          <h2 className="text-title font-bold m-0">🗂️ 시험 운영 현황</h2>
          <DemoBadge label="회차·정원 데모" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-ds-4">
          <Kpi icon="🗂️" label="등록 회차" value={DEMO_EXAMS.length} sub={`접수 중 ${OPEN}건`} demo />
          <Kpi icon="👥" label="총 정원" value={CAP.toLocaleString()} sub="전 회차 합계" demo />
          <Kpi icon="📝" label="총 접수" value={APPLIED.toLocaleString()} sub={`충원율 ${Math.round((APPLIED / CAP) * 100)}%`} demo />
          <Kpi icon="✅" label="접수 중" value={OPEN} sub="진행 회차" demo />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-ds-4">
        <section className="flex flex-col gap-ds-3">
          <div className="flex items-center gap-ds-3">
            <h3 className="text-subtitle font-bold m-0">📊 분야별 문항 수</h3>
            <span className="text-caption text-ds-muted">근거: 정리DB</span>
          </div>
          <Panel className="flex flex-col gap-ds-3">
            {byCount.map((x) => (
              <BarRow key={x.field} label={x.field} value={x.count} max={MAX_Q} suffix="문항" />
            ))}
          </Panel>
        </section>

        <section className="flex flex-col gap-ds-3">
          <div className="flex items-center gap-ds-3">
            <h3 className="text-subtitle font-bold m-0">📈 시험별 접수율</h3>
            <DemoBadge />
          </div>
          <Panel className="flex flex-col gap-ds-3">
            {examRates.map((e, i) => (
              <BarRow
                key={i}
                label={e.label}
                value={e.rate}
                max={100}
                suffix="%"
                tone={e.rate >= 90 ? "danger" : e.rate >= 60 ? "warning" : "brand-2"}
              />
            ))}
          </Panel>
        </section>
      </div>

      {/* 관리 메뉴 바로가기 (예정) */}
      <section className="flex flex-col gap-ds-3">
        <h2 className="text-title font-bold m-0">🧭 관리 메뉴</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-ds-3">
          {ADMIN_MENU.map((m) => (
            <div
              key={m.href}
              className="bg-ds-base border border-ds-border rounded-ds-md p-ds-6 flex items-center gap-ds-3 opacity-70"
              title="다음 회차 구현 예정"
            >
              <span className="text-h2">{m.icon}</span>
              <span className="flex flex-col">
                <span className="text-body font-medium">{m.label}</span>
                <span className="text-[10px] text-ds-muted">예정</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <Notice tone="info">
        vibecoding 고밀도 통합 관리(대량 필터 · 엑셀 업로드/다운로드 · SMS/메일 일괄
        발송)는 운영 데이터 축적 후 단계적으로 연동 예정입니다. 위 통계 중 시험
        회차·정원·접수는 시연용 데모, 데이터 자산 수치는 실제 정리DB 집계입니다.
      </Notice>
    </div>
  );
}
