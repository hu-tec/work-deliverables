import Link from "next/link";
import type { ReactNode } from "react";

const workspaceLinks = [
  { href: "/workspace", label: "창작작업실" },
  { href: "/workspace/meta-translation", label: "메타번역" },
  { href: "/workspace/cart", label: "장바구니" },
  { href: "/workspace/checkout", label: "결제" }
];

export function PublicShell({ children, active = "창작작업실" }: { children: ReactNode; active?: string }) {
  return (
    <div className="shell public-shell">
      <header className="topbar">
        <Link className="logo" href="/workspace">LOGO</Link>
        <nav className="topnav" aria-label="서비스 메뉴">
          {workspaceLinks.slice(0, 1).map((link) => (
            <Link key={link.href} className={active === link.label ? "active" : ""} href={link.href}>{link.label}</Link>
          ))}
          <Link href="#">요금제</Link>
          <Link href="#">고객센터</Link>
          <Link href="#">회사소개</Link>
        </nav>
        <div className="top-icons" aria-label="사용자 도구">
          <span>⌁</span>
          <Link className={active === "장바구니" ? "icon-active" : ""} href="/workspace/cart">⌗</Link>
          <span>◎</span>
        </div>
      </header>
      <aside className="rail" aria-label="빠른 메뉴">
        <span>▤</span>
        <span>◌</span>
        <span>▧</span>
        <span>◇</span>
        <span>▣</span>
        <span>✉</span>
        <span className="rail-bottom">▤</span>
      </aside>
      {children}
      <footer className="footer">
        <span>CompanyName @ 202X. All rights reserved.</span>
        <span>이용약관</span>
        <span>개인정보보호정책</span>
      </footer>
    </div>
  );
}

export function AdminShell({ children, title, crumb = "회원관리" }: { children: ReactNode; title: string; crumb?: string }) {
  return (
    <div className="admin-shell">
      <aside className="admin-rail" aria-label="관리자 메뉴">
        <span>☰</span>
        <Link href="/admin/dashboard">⌂</Link>
        <Link href="/admin/forms">♙</Link>
        <Link href="/admin/templates">▧</Link>
        <Link href="/upload-classification/upload">▣</Link>
        <span>⚙</span>
      </aside>
      <header className="admin-topbar">
        <label className="search"><span>⌕</span><input placeholder="검색" /></label>
        <div><strong>관리자</strong><span>로그아웃</span></div>
      </header>
      <main className="admin-main">
        <div className="breadcrumb">홈 &gt; {crumb}</div>
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}
