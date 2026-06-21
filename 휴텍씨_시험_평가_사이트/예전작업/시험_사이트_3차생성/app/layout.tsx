import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AITP 통합 시험 플랫폼",
  description: "시험 접수, 결제, 응시, 출제, 채점, 관리자 운영 Next.js 구현"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
