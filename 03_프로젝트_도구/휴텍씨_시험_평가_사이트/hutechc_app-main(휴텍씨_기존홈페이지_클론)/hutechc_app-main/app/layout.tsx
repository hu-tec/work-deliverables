import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HutechC Exam | 시험 접수·응시",
  description: "AI + Human 기반 CBT 시험 운영 포털"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
