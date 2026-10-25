import { ExamPortal } from "@/components/exam-portal";
import { isLocale, defaultLocale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: paramLocale } = await params;
  const locale = isLocale(paramLocale) ? paramLocale : defaultLocale;

  return <ExamPortal locale={locale} />;
}
