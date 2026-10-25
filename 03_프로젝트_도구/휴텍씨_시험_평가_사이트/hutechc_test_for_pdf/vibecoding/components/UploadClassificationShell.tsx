import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/upload-classification/upload", label: "파일업로드" },
  { href: "/upload-classification/rules", label: "구분기준" },
  { href: "/upload-classification/review", label: "검수" },
  { href: "/upload-classification/results", label: "결과" },
  { href: "/upload-classification/history", label: "이력" }
];

export function UploadClassificationShell({
  children,
  title,
  active
}: {
  children: ReactNode;
  title: string;
  active: string;
}) {
  return (
    <div className="admin-shell">
      <aside className="icon-rail" aria-label="관리자 메뉴">
        <button aria-label="메뉴 열기">☰</button>
        <Link href="/upload-classification/upload" aria-label="홈">⌂</Link>
        <Link href="/upload-classification/rules" aria-label="회원 구분">♙</Link>
        <Link href="/upload-classification/review" aria-label="검수">▤</Link>
        <Link href="/upload-classification/results" aria-label="결과">▣</Link>
        <Link href="/upload-classification/history" aria-label="이력">⚙</Link>
      </aside>
      <header className="topbar">
        <label className="search">
          <span>⌕</span>
          <input placeholder="검색" />
        </label>
        <div className="admin-account">
          <strong>관리자</strong>
          <span>로그아웃</span>
        </div>
      </header>
      <main className="workspace">
        <div className="breadcrumb">홈 &gt; 회원관리 &gt; 파일 구분</div>
        <div className="page-title-row">
          <h1>{title}</h1>
          <button className="primary-button">저장</button>
        </div>
        <nav className="module-tabs" aria-label="파일 구분 단계">
          {navItems.map((item) => (
            <Link key={item.href} className={active === item.label ? "active" : ""} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        {children}
      </main>
    </div>
  );
}
