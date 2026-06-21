import { RouteFallback } from "../../../components/RouteFallback";

export default async function GraderFallbackPage({ params }: { params: Promise<{ section: string[] }> }) {
  const { section } = await params;

  return <RouteFallback role="grader" section={section} />;
}
