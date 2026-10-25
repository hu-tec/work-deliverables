import { RouteFallback } from "../../../components/RouteFallback";

export default async function AdminFallbackPage({ params }: { params: Promise<{ section: string[] }> }) {
  const { section } = await params;

  return <RouteFallback role="admin" section={section} />;
}
