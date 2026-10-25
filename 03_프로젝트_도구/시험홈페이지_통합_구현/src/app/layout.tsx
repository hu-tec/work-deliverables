import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/components/providers";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "휴텍씨 시험 플랫폼 · 통합",
  description:
    "2024 토대 + 2025 UX + vibecoding 관리 — 시험 접수·결제·응시·채점·결과·자격증 통합 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AppProvider>
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}
