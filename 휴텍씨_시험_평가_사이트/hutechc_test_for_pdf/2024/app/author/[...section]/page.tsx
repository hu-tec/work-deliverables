import { RouteFallback } from "../../../components/RouteFallback";

export default async function AuthorFallbackPage({ params }: { params: Promise<{ section: string[] }> }) {
  const { section } = await params;

  return <RouteFallback role="author" section={section} />;
}
