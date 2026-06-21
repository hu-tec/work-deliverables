import Link from "next/link";
import type { ReactNode } from "react";
import { roleMenus } from "@/lib/ia";

type Role = keyof typeof roleMenus;

export function StatusBadge({ value }: { value: string }) {
  const tone =
    /완료|합격|승인|결제완료|발급완료/.test(value) ? "good" :
    /반려|불합격|환불|보류/.test(value) ? "bad" :
    /중|대기|임시|검수|접수/.test(value) ? "wait" : "info";
  return <span className={`badge ${tone}`}>{value}</span>;
}

export function DataTable({ headers, rows }: { headers: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{headers.map((header, index) => <th key={index}>{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function AppShell({ role, title, children }: { role: Role; title: string; children: ReactNode }) {
  const roleLinks: [Role, string, string][] = [
    ["candidate", "수험생", "/candidate"],
    ["author", "출제자", "/author"],
    ["grader", "채점자", "/grader/scoring"],
    ["admin", "관리자", "/admin"]
  ];

  return (
    <div className="app-shell">
      <aside className="side">
        <Link className="brand" href="/">AITP</Link>
        <nav>
          {roleMenus[role].map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
        </nav>
      </aside>
      <main className="main">
        <header className="top">
          <div>
            <span className="eyebrow">2024 전체 플로우 + 2025 개편 + vibecoding</span>
            <h1>{title}</h1>
          </div>
          <div className="role-links">
            {roleLinks.map(([key, label, href]) => (
              <Link className={role === key ? `active role-${key}` : `role-${key}`} href={href} key={key}>
                {label}
              </Link>
            ))}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

export function ActionLog({ logs }: { logs: string[] }) {
  return (
    <section className="panel">
      <h2>처리 로그</h2>
      <div className="log-list">
        {logs.map((log, index) => <div key={`${log}-${index}`}>{log}</div>)}
      </div>
    </section>
  );
}
