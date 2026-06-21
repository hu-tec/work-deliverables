import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sample",
  description: "2024 구조, 2025 UI/UX, vibecoding 신규 기능 통합 샘플"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
