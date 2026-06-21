import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2025 Website",
  description: "2025 신규 화면 구현"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
