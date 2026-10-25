import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { comparisonRows, comparisonSummary } from "@/lib/site-comparison";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

export default async function ComparisonPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: paramLocale } = await params;
  const locale: Locale = isLocale(paramLocale) ? paramLocale : defaultLocale;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="container grid gap-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-primary">사이트 비교 문서</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
              HutechC Exam 두 사이트 비교
            </h1>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
              원본 클론 대상은 밝은 운영 포털인 hutechc-exam.vercel.app입니다. vibe2는
              제품 소개형 랜딩 페이지로 성격이 달라 비교 기준으로만 사용했습니다.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/${locale}`}>클론 화면으로 돌아가기</Link>
          </Button>
        </div>

        <section className="grid gap-4 lg:grid-cols-2">
          {comparisonSummary.map((site) => (
            <Card key={site.label} className="rounded-lg shadow-none">
              <CardContent className="p-6">
                <div className="text-xs font-black text-slate-500">{site.label}</div>
                <h2 className="mt-2 text-xl font-black text-slate-950">{site.title}</h2>
                <ul className="mt-5 grid gap-3 text-sm font-semibold leading-6 text-slate-600">
                  {site.points.map((point) => (
                    <li key={point} className="rounded-md border bg-white px-4 py-3">
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="overflow-hidden rounded-lg shadow-none">
          <div className="grid grid-cols-[160px_1fr_1fr] border-b bg-muted px-4 py-3 text-sm font-black text-slate-700 max-md:hidden">
            <span>비교 항목</span>
            <span>hutechc-exam</span>
            <span>vibe2</span>
          </div>
          {comparisonRows.map(([area, original, vibe]) => (
            <div
              key={area}
              className="grid grid-cols-[160px_1fr_1fr] gap-3 border-b px-4 py-4 text-sm last:border-b-0 max-md:grid-cols-1"
            >
              <span className="font-black text-slate-950">{area}</span>
              <span className="font-semibold text-slate-700">{original}</span>
              <span className="font-semibold text-slate-700">{vibe}</span>
            </div>
          ))}
        </Card>
      </section>
    </main>
  );
}
