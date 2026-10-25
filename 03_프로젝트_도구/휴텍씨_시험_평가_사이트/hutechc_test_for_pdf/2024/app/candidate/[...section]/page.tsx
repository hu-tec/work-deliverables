import { RouteFallback } from "../../../components/RouteFallback";

export default async function CandidateFallbackPage({ params }: { params: Promise<{ section: string[] }> }) {
  const { section } = await params;

  return <RouteFallback role="candidate" section={section} />;
}
