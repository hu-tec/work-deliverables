"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { roles } from "../lib/ia";

export function AppShell({
  role,
  title,
  children
}: {
  role: "candidate" | "author" | "grader" | "admin";
  title: string;
  children: React.ReactNode;
}) {
  const roleInfo = roles[role];
  const menuLinks: Record<string, string> = roleInfo.menuLinks;
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Sinbom 2024</div>
        <nav className="menu" aria-label={`${roleInfo.label} 메뉴`}>
          {roleInfo.menus.map((menu) => {
            const href = menuLinks[menu] ?? roleInfo.home;
            const isCurrent = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link key={menu} href={href} aria-current={isCurrent ? "page" : undefined}>
                {menu}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="topbar-title">{title}</div>
          <div>{roleInfo.label}</div>
        </header>
        <section className="content">{children}</section>
      </main>
    </div>
  );
}
