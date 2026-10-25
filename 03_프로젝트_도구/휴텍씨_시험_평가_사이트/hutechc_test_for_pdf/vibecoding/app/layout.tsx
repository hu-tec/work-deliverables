import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "vibecoding 파일 구분",
  description: "파일 업로드와 구분 처리 관리자 모듈"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
