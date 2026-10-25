"use client";
// 내 정보: 수험생 기본정보 수정 + 접수/합격/자격증 진행 요약.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/components/providers";
import {
  Button,
  Chip,
  EmptyState,
  Kpi,
  Notice,
  Panel,
  SectionHead,
  StatusBadge,
} from "@/components/ui";
import type { ExamineeProfile } from "@/lib/types";
import { getExamById } from "@/lib/demo-exams";

export default function ProfilePage() {
  const { hydrated, profile, updateProfile, applications } = useStore();
  const [form, setForm] = useState<ExamineeProfile>(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const summary = useMemo(() => {
    const active = applications.filter((a) => a.registerStatus !== "접수 취소");
    return {
      active: active.length,
      paid: active.filter((a) => a.paymentStatus === "결제완료").length,
      submitted: active.filter((a) => a.examStatus === "시험 완료").length,
      passed: active.filter((a) => a.resultStatus === "합격").length,
      certs: active.filter(
        (a) => a.certStatus === "신청완료" || a.certStatus === "발급완료",
      ).length,
    };
  }, [applications]);

  if (!hydrated)
    return <Panel><p className="text-body text-ds-muted m-0">불러오는 중…</p></Panel>;

  const save = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      alert("이름, 이메일, 휴대폰 번호는 필수입니다.");
      return;
    }
    updateProfile({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const recent = applications.slice(0, 4);

  return (
    <div className="flex flex-col gap-ds-5">
      <SectionHead
        title="👤 내 정보"
        desc="수험생 기본정보와 내 시험 진행 현황을 관리합니다."
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-ds-4">
        <Kpi icon="📝" label="진행 접수" value={summary.active} sub="취소 제외" />
        <Kpi icon="💳" label="결제완료" value={summary.paid} sub="응시 대상" />
        <Kpi icon="📤" label="제출완료" value={summary.submitted} sub="채점 대상" />
        <Kpi icon="🎯" label="합격" value={summary.passed} sub="자격증 가능" />
        <Kpi icon="🏅" label="자격증 신청" value={summary.certs} sub="신청/발급" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-ds-5">
        <Panel className="flex flex-col gap-ds-4">
          <h2 className="text-title font-bold m-0">기본정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-ds-4">
            <Field label="이름">
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full h-8 px-ds-5 text-body bg-ds-base border border-ds-border rounded-ds-sm focus:border-ds-brand"
              />
            </Field>
            <Field label="생년월일">
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, birthDate: e.target.value }))
                }
                className="w-full h-8 px-ds-5 text-body bg-ds-base border border-ds-border rounded-ds-sm focus:border-ds-brand"
              />
            </Field>
            <Field label="이메일">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full h-8 px-ds-5 text-body bg-ds-base border border-ds-border rounded-ds-sm focus:border-ds-brand"
              />
            </Field>
            <Field label="휴대폰">
              <input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full h-8 px-ds-5 text-body bg-ds-base border border-ds-border rounded-ds-sm focus:border-ds-brand"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="주소">
                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                  className="w-full h-8 px-ds-5 text-body bg-ds-base border border-ds-border rounded-ds-sm focus:border-ds-brand"
                />
              </Field>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-ds-3 border-t border-ds-border pt-ds-4">
            <Chip
              selected={form.marketingConsent}
              onClick={() =>
                setForm((p) => ({
                  ...p,
                  marketingConsent: !p.marketingConsent,
                }))
              }
            >
              시험·자격증 안내 수신 동의
            </Chip>
            <div className="flex items-center gap-ds-3">
              {saved && <span className="text-caption text-ds-success">저장됨</span>}
              <Button onClick={save}>저장하기</Button>
            </div>
          </div>
        </Panel>

        <Panel className="flex flex-col gap-ds-4">
          <div className="flex items-center justify-between gap-ds-3">
            <h2 className="text-title font-bold m-0">최근 시험</h2>
            <Link href="/examinee/applications" className="text-caption text-ds-brand">
              전체 보기 →
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              title="최근 접수가 없습니다"
              desc="시험을 접수하면 진행 상태가 표시됩니다."
              action={
                <Link href="/examinee/exams">
                  <Button size="sm">시험 접수</Button>
                </Link>
              }
            />
          ) : (
            <div className="flex flex-col gap-ds-3">
              {recent.map((a) => {
                const ex = getExamById(a.examId);
                return (
                  <div
                    key={a.id}
                    className="border border-ds-border rounded-ds-sm p-ds-4 flex flex-col gap-ds-2"
                  >
                    <div className="flex items-center justify-between gap-ds-3">
                      <span className="text-caption font-semibold truncate">
                        {ex?.subject} {ex?.grade}
                      </span>
                      <StatusBadge status={a.registerStatus} />
                    </div>
                    <span className="text-caption text-ds-muted truncate">
                      {ex?.round}
                    </span>
                    <div className="flex flex-wrap gap-ds-2">
                      <StatusBadge status={a.paymentStatus} />
                      <StatusBadge status={a.examStatus} />
                      <StatusBadge status={a.resultStatus} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      <Notice tone="demo">
        내 정보는 브라우저에 저장되는 데모 데이터입니다. 실제 서비스에서는 본인인증,
        이메일/휴대폰 중복 확인, 개인정보 변경 이력이 필요합니다.
      </Notice>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-ds-2">
      <span className="text-caption text-ds-secondary font-medium">{label}</span>
      {children}
    </label>
  );
}
