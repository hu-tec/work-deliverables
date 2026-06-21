"use client";

import Link from "next/link";
import * as React from "react";
import { HelpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InquiryStatus = "답변대기" | "답변완료" | "처리중";

type Inquiry = {
  id: string;
  title: string;
  body: string;
  status: InquiryStatus;
  updatedAt: string;
  answer?: string;
};

const initialInquiries: Inquiry[] = [
  {
    id: "INQ-2026-001",
    title: "시험장 입장 버튼이 보이지 않습니다",
    body: "시험 시작 전 입장 버튼이 비활성화되어 확인 요청드립니다.",
    status: "답변대기",
    updatedAt: "2026-05-18"
  },
  {
    id: "INQ-2026-002",
    title: "영수증 재발급 요청",
    body: "회사 제출용 결제 영수증을 다시 발급받고 싶습니다.",
    status: "답변완료",
    updatedAt: "2026-05-17",
    answer: "마이페이지 > 결제내역에서 영수증 재발급을 선택하면 PDF로 다시 다운로드할 수 있습니다."
  },
  {
    id: "INQ-2026-003",
    title: "자격증 출력 오류",
    body: "PDF 다운로드 후 QR 코드가 흐리게 출력됩니다.",
    status: "처리중",
    updatedAt: "2026-05-16",
    answer: "출력 파일 상태를 확인 중입니다. 재발급이 필요한 경우 처리 완료 후 별도 안내드리겠습니다."
  }
];

const storageKey = "hutechc-inquiries";

const statusTones: Record<InquiryStatus, string> = {
  답변대기: "border-amber-200 bg-amber-50 text-amber-900",
  답변완료: "border-teal-200 bg-teal-50 text-teal-900",
  처리중: "border-blue-200 bg-blue-50 text-blue-900"
};

function readStoredInquiries() {
  if (typeof window === "undefined") {
    return initialInquiries;
  }

  const saved = window.localStorage.getItem(storageKey);

  if (!saved) {
    return initialInquiries;
  }

  try {
    const parsed = JSON.parse(saved) as Inquiry[];
    return Array.isArray(parsed) ? parsed : initialInquiries;
  } catch {
    return initialInquiries;
  }
}

export function InquiryWorkspace({ locale }: { locale: string }) {
  const [inquiries, setInquiries] = React.useState<Inquiry[]>(initialInquiries);
  const [keyword, setKeyword] = React.useState("");
  const [pendingOnly, setPendingOnly] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");

  React.useEffect(() => {
    setInquiries(readStoredInquiries());
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(inquiries));
  }, [inquiries]);

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesKeyword =
      normalizedKeyword.length === 0 ||
      inquiry.title.toLowerCase().includes(normalizedKeyword) ||
      inquiry.body.toLowerCase().includes(normalizedKeyword) ||
      inquiry.id.toLowerCase().includes(normalizedKeyword);
    const matchesStatus = !pendingOnly || inquiry.status === "답변대기";

    return matchesKeyword && matchesStatus;
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextTitle = title.trim();
    const nextBody = body.trim();

    if (!nextTitle || !nextBody) {
      return;
    }

    const nextInquiry: Inquiry = {
      id: `INQ-2026-${String(inquiries.length + 1).padStart(3, "0")}`,
      title: nextTitle,
      body: nextBody,
      status: "답변대기",
      updatedAt: "2026-05-20"
    };

    setInquiries((current) => [nextInquiry, ...current]);
    setTitle("");
    setBody("");
    setPendingOnly(false);
    setKeyword("");
  }

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="grid gap-3">
        <div className="grid gap-2 rounded-lg border border-slate-200 bg-white p-2 md:grid-cols-[minmax(220px,1fr)_auto_auto]">
          <Input
            className="h-9"
            placeholder="키워드 검색"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Button
            type="button"
            variant={pendingOnly ? "default" : "outline"}
            size="sm"
            aria-pressed={pendingOnly}
            onClick={() => setPendingOnly((current) => !current)}
          >
            답변대기
          </Button>
          <Button type="button" size="sm">검색</Button>
        </div>
        <Panel title="문의 목록">
          {filteredInquiries.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredInquiries.map((inquiry) => (
                <article key={inquiry.id} className="grid gap-1 px-3 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <Link className="min-w-0 truncate text-sm font-black hover:text-primary" href={`/${locale}/inquiry/${inquiry.id}`}>
                      {inquiry.title}
                    </Link>
                    <StatusBadge status={inquiry.status} />
                  </div>
                  <p className="line-clamp-2 text-xs font-semibold leading-5 text-slate-600">{inquiry.body}</p>
                  <p className="text-xs font-semibold text-slate-500">
                    {inquiry.id} · 수험자 지원센터 · 최근 업데이트 {inquiry.updatedAt}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="px-3 py-8 text-center text-sm font-semibold text-slate-500">검색 결과가 없습니다.</div>
          )}
        </Panel>
      </section>
      <Panel title="문의 작성" icon={<HelpCircle className="size-4 text-slate-500" />}>
        <form className="grid gap-2 p-3" onSubmit={handleSubmit}>
          <Input placeholder="제목" value={title} onChange={(event) => setTitle(event.target.value)} />
          <textarea
            className="min-h-40 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="문의 내용을 입력하세요."
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
          <Button type="submit">문의 접수</Button>
        </form>
      </Panel>
    </div>
  );
}

export function InquiryDetail({ locale, inquiryId }: { locale: string; inquiryId: string }) {
  const [inquiries, setInquiries] = React.useState<Inquiry[]>(initialInquiries);

  React.useEffect(() => {
    setInquiries(readStoredInquiries());
  }, []);

  const inquiry = inquiries.find((item) => item.id === inquiryId);

  if (!inquiry) {
    return (
      <Panel title="문의 상세">
        <div className="grid gap-4 p-5">
          <p className="text-sm font-semibold text-slate-600">문의 내역을 찾을 수 없습니다.</p>
          <Button asChild variant="outline">
            <Link href={`/${locale}/inquiry`}>목록으로 돌아가기</Link>
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Panel title="문의 상세">
        <div className="grid gap-5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black text-slate-500">{inquiry.id}</p>
              <h2 className="mt-2 break-keep text-xl font-black text-slate-950">{inquiry.title}</h2>
            </div>
            <StatusBadge status={inquiry.status} />
          </div>
          <section className="rounded-md border border-slate-100 bg-slate-50 p-4">
            <h3 className="text-xs font-black text-slate-500">문의 내용</h3>
            <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-6 text-slate-800">{inquiry.body}</p>
          </section>
          <section className="rounded-md border border-slate-100 bg-white p-4">
            <h3 className="text-xs font-black text-slate-500">답변 내용</h3>
            <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-6 text-slate-800">
              {inquiry.answer ?? "아직 등록된 답변이 없습니다. 담당자 확인 후 답변이 등록됩니다."}
            </p>
          </section>
        </div>
      </Panel>
      <Panel title="처리 정보" icon={<HelpCircle className="size-4 text-slate-500" />}>
        <div className="grid gap-2 p-3">
          <InfoRow label="상태" value={inquiry.status} />
          <InfoRow label="최근 업데이트" value={inquiry.updatedAt} />
          <Button asChild variant="outline">
            <Link href={`/${locale}/inquiry`}>목록으로 돌아가기</Link>
          </Button>
        </div>
      </Panel>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[96px_1fr] rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-black">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900">{value}</span>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-portal">
      <div className="flex h-11 items-center gap-2 border-b border-slate-100 px-4 text-sm font-black text-slate-900">
        {icon}
        {title}
      </div>
      {children}
    </section>
  );
}

function StatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span className={cn("inline-flex shrink-0 rounded border px-1.5 py-1 text-[10px] font-black", statusTones[status])}>
      {status}
    </span>
  );
}
