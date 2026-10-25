import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2024 시험 플랫폼",
  description: "2024 베이스 시험 운영 플랫폼"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
