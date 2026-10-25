"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type GradingRole = "expert" | "grader";

type RubricRow = [string, string, string];

type GradingCandidate = {
  name: string;
  examNo: string;
  aiScore: string;
  humanScore: string;
  status: string;
  submittedAt: string;
  elapsed: string;
  original: string;
  answer: string;
  comment: string;
  rubric: RubricRow[];
};

const gradingCandidates: GradingCandidate[] = [
  {
    name: "김서연",
    examNo: "HCT-2407-103",
    aiScore: "82",
    humanScore: "대기",
    status: "휴먼검수",
    submittedAt: "10:24:12",
    elapsed: "41:08",
    original: "Business plan and travel proposal content for a Thailand travel package targeting young professionals.",
    answer: "태국 여행 상품의 사업계획을 자연스럽게 번역했습니다. 방콕과 치앙마이를 연결하는 일정의 장점을 고객 관점에서 설명했습니다.",
    comment: "핵심 의미는 유지됐지만 상품 소개문 특유의 설득력이 조금 부족합니다.",
    rubric: [["정확성", "82%", "bg-blue-500"], ["표현력", "74%", "bg-teal-500"], ["일관성", "68%", "bg-amber-500"]]
  },
  {
    name: "이정우",
    examNo: "HCT-2407-119",
    aiScore: "70",
    humanScore: "68",
    status: "재검토",
    submittedAt: "10:31:44",
    elapsed: "38:22",
    original: "The voucher will be issued within 24 hours after the booking is confirmed.",
    answer: "예약이 확인된 뒤 24시간 안에 바우처가 발급될 것입니다. 현지 사정에 따라 일정은 바뀔 수 있습니다.",
    comment: "문장 단위 번역은 가능하지만 이메일 안내문으로서의 정중한 톤 보강이 필요합니다.",
    rubric: [["정확성", "70%", "bg-blue-500"], ["표현력", "64%", "bg-teal-500"], ["일관성", "72%", "bg-amber-500"]]
  },
  {
    name: "박지원",
    examNo: "HCT-2407-128",
    aiScore: "90",
    humanScore: "92",
    status: "확정대기",
    submittedAt: "10:18:03",
    elapsed: "44:55",
    original: "The service provider shall notify the client of any material delay no later than three business days.",
    answer: "서비스 제공자는 중대한 지연이 발생하거나 합리적으로 예상되는 경우, 늦어도 영업일 기준 3일 이내에 고객에게 알려야 합니다.",
    comment: "법률 문서의 조건과 기한 표현을 명확하게 유지했습니다. 확정 처리해도 무리가 없습니다.",
    rubric: [["정확성", "90%", "bg-blue-500"], ["표현력", "88%", "bg-teal-500"], ["일관성", "94%", "bg-amber-500"]]
  },
  {
    name: "최민준",
    examNo: "HCT-2407-141",
    aiScore: "77",
    humanScore: "대기",
    status: "휴먼검수",
    submittedAt: "10:42:19",
    elapsed: "29:17",
    original: "This wireless charger supports simultaneous charging for smartphones and earbuds.",
    answer: "이 무선 충전기는 스마트폰과 이어폰의 동시 충전을 지원하며 과열 방지 센서가 있습니다.",
    comment: "필수 정보는 포함됐지만 상세 페이지 문구로는 장점 표현이 단조롭습니다.",
    rubric: [["정확성", "77%", "bg-blue-500"], ["표현력", "71%", "bg-teal-500"], ["일관성", "76%", "bg-amber-500"]]
  },
  {
    name: "정하린",
    examNo: "HCT-2407-152",
    aiScore: "86",
    humanScore: "대기",
    status: "검수중",
    submittedAt: "10:50:08",
    elapsed: "35:40",
    original: "Some services will be unavailable due to scheduled system maintenance.",
    answer: "예정된 시스템 점검으로 인해 일부 서비스 이용이 제한됩니다. 점검 완료 후 모든 기능은 정상 복구됩니다.",
    comment: "공지문 형식에 적합하고 의미 전달이 안정적입니다. 세부 시간 표기만 확인하면 됩니다.",
    rubric: [["정확성", "86%", "bg-blue-500"], ["표현력", "84%", "bg-teal-500"], ["일관성", "88%", "bg-amber-500"]]
  },
  {
    name: "윤태오",
    examNo: "HCT-2407-164",
    aiScore: "62",
    humanScore: "대기",
    status: "보류",
    submittedAt: "10:57:33",
    elapsed: "24:11",
    original: "The administrator must classify duplicate applications and payment errors into a separate list.",
    answer: "관리자는 중복 신청과 결제 오류를 따로 목록화해야 합니다. 전일 접수 내역은 오전에 확인합니다.",
    comment: "핵심 조건 일부가 빠져 있어 운영 매뉴얼 문장으로 보완이 필요합니다.",
    rubric: [["정확성", "62%", "bg-blue-500"], ["표현력", "58%", "bg-teal-500"], ["일관성", "60%", "bg-amber-500"]]
  },
  {
    name: "한유진",
    examNo: "HCT-2407-177",
    aiScore: "88",
    humanScore: "대기",
    status: "휴먼검수",
    submittedAt: "11:04:51",
    elapsed: "18:26",
    original: "The new AI-powered platform reduced document processing time by 42 percent during a three-month pilot program.",
    answer: "새로운 AI 기반 플랫폼은 3개월간 진행된 파일럿 프로그램에서 문서 처리 시간을 42% 단축했다고 회사가 밝혔습니다.",
    comment: "기사체 문장 흐름이 안정적이며 수치와 기간 정보도 정확합니다.",
    rubric: [["정확성", "88%", "bg-blue-500"], ["표현력", "86%", "bg-teal-500"], ["일관성", "90%", "bg-amber-500"]]
  }
];

export function GradingWorkbench({ role }: { role: GradingRole }) {
  const [selectedExamNo, setSelectedExamNo] = useState(gradingCandidates[0].examNo);
  const selectedCandidate =
    gradingCandidates.find((candidate) => candidate.examNo === selectedExamNo) ?? gradingCandidates[0];
  const selectedIndex = gradingCandidates.findIndex((candidate) => candidate.examNo === selectedCandidate.examNo);
  const nextCandidate = gradingCandidates[(selectedIndex + 1) % gradingCandidates.length];

  return (
    <div className="grid gap-7">
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" size="sm">설정</Button>
        <Button size="sm">{role === "expert" ? "채점하기" : "검수 저장"}</Button>
      </div>
      <div className="grid gap-3 xl:grid-cols-[1fr_400px]">
        <Panel title="답안 정보" className="rounded-2xl shadow-portal">
          <div className="p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-sm font-semibold text-slate-700">
                  번역 자격증 <span className="font-black text-[#0788ff]">전문1급</span>
                </div>
                <h2 className="mt-4 text-2xl font-black text-slate-950">시험명이 나오는 영역</h2>
              </div>
              <div className="text-right text-sm font-semibold leading-6 text-slate-600">
                번역 &gt; 영상 &gt; 다큐멘터리
                <br />
                그룹(그룹명)
              </div>
            </div>
            <p className="mt-8 text-sm font-semibold text-slate-900">
              <span className="font-black">A형</span> 태국 여행에 대해서 기획서를 작성해보시고.
            </p>
          </div>
        </Panel>
        <Panel title="채점 메타" className="rounded-2xl shadow-portal">
          <FieldGrid
            rows={[
              ["점수", "정기 24년 10차"],
              ["출제 목적", "응시용"],
              ["교시", "1교시"],
              ["채점 기간", "YYYY.MM.DD ~ YYYY.MM.DD"],
              ["채점 완료", "YYYY.MM.DD"]
            ]}
          />
        </Panel>
      </div>
      <section className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {gradingCandidates.map((candidate) => {
            const active = candidate.examNo === selectedCandidate.examNo;
            return (
              <button
                key={candidate.examNo}
                className={cn(
                  "grid h-9 cursor-pointer place-items-center rounded-md border px-3 text-xs font-black transition-colors",
                  active
                    ? "border-[#0788ff] bg-[#eef6ff] text-[#0788ff]"
                    : "border-[#d9dee8] bg-white text-slate-600 hover:border-[#0788ff] hover:text-[#0788ff]"
                )}
                onClick={() => setSelectedExamNo(candidate.examNo)}
                type="button"
              >
                {candidate.name} · AI {candidate.aiScore}
              </button>
            );
          })}
          <span className="ml-auto text-xs font-semibold text-slate-500">
            선택: {selectedCandidate.name} · 저장 상태: 저장됨
          </span>
        </div>
        <article className="grid gap-3 xl:grid-cols-[1fr_1fr_280px]">
          <Panel title="원문/답안">
            <div className="grid gap-3 p-3 text-sm leading-6 text-slate-800">
              <p className="rounded-md bg-slate-50 p-3">원문: {selectedCandidate.original}</p>
              <p className="rounded-md bg-blue-50 p-3">응시자 답안: {selectedCandidate.answer}</p>
              <p className="rounded-md bg-amber-50 p-3">검수 메모: {selectedCandidate.comment}</p>
            </div>
          </Panel>
          <Panel title="기준표 점수">
            <Bars rows={selectedCandidate.rubric} />
            <div className="grid gap-2 p-3">
              <Input placeholder={`휴먼 점수 입력 · 현재 ${selectedCandidate.humanScore}`} />
              <textarea
                className="min-h-28 rounded-md border px-3 py-2 text-sm"
                placeholder={`${selectedCandidate.name} 검수 코멘트`}
              />
            </div>
          </Panel>
          <aside className="grid content-start gap-3">
            <Panel title="검수 액션">
              <div className="grid gap-2 p-3">
                <Button>검수 저장</Button>
                <Button variant="outline" onClick={() => setSelectedExamNo(nextCandidate.examNo)}>
                  다음 후보자
                </Button>
                <Button variant="outline">채점 설정</Button>
              </div>
            </Panel>
            <DarkGuide
              title="현재 응시자"
              text={`${selectedCandidate.name} (${selectedCandidate.examNo}), ${selectedCandidate.status}, 제출 ${selectedCandidate.submittedAt} · 소요 ${selectedCandidate.elapsed}`}
            />
          </aside>
        </article>
      </section>
    </div>
  );
}

function Panel({ title, icon, children, className }: { title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("overflow-hidden rounded-lg border border-slate-200 bg-white", className)}>
      <div className="flex h-10 items-center gap-2 border-b border-slate-200 px-3 text-xs font-black">
        {icon}
        {title}
      </div>
      {children}
    </section>
  );
}

function FieldGrid({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="grid gap-2 p-3">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[82px_1fr] items-center rounded-md border border-slate-100 bg-slate-50 px-2 py-2">
          <span className="text-[11px] font-black text-slate-500">{label}</span>
          <span className="truncate text-sm font-semibold text-slate-900">{value}</span>
        </div>
      ))}
    </div>
  );
}

function Bars({ rows }: { rows: RubricRow[] }) {
  return (
    <div className="grid gap-2 p-3">
      {rows.map(([label, width, color]) => (
        <div key={label} className="grid gap-1">
          <div className="flex items-center justify-between text-[11px] font-black text-slate-700"><span>{label}</span><span>{width}</span></div>
          <div className="h-1.5 w-full overflow-hidden rounded bg-slate-200"><div className={cn("h-full rounded", color)} style={{ width }} /></div>
        </div>
      ))}
    </div>
  );
}

function DarkGuide({ title, text }: { title: string; text: string }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white">
      <div className="grid h-full content-between p-3">
        <div><div className="text-xs font-black text-white">{title}</div><p className="mt-2 text-xs leading-5 text-slate-300">{text}</p></div>
      </div>
    </section>
  );
}
