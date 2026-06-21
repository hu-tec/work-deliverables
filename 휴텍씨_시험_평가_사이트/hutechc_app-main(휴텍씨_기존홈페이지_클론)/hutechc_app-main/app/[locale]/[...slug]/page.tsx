import { notFound } from "next/navigation";

import { getPageConfig, PortalPage } from "@/components/portal-shell";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

const supported = new Set([
  "apply",
  "take",
  "results",
  "certificate",
  "orders",
  "inquiry",
  "expert",
  "grader",
  "admin",
  "login",
  "mypage",
  "profile",
  "notifications",
  "terms",
  "privacy"
]);

export default async function CatchAllPage({
  params
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale: paramLocale, slug } = await params;
  const locale: Locale = isLocale(paramLocale) ? paramLocale : defaultLocale;
  const first = slug?.[0];

  if (!first || !supported.has(first)) {
    notFound();
  }

  return <PortalPage locale={locale} config={getPageConfig(slug)} />;
}
