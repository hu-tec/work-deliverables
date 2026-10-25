"use client";
// 공통 프레임: Header(역할 스위처) + Sidebar(역할별 메뉴) + Footer.
// 사이드바 border-radius 최소화(작업지시). 미구현 메뉴는 숨기지 않고 '예정' 표식.
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ROLES, ROLE_MENUS, type Role } from "@/lib/roles";
import { useStore } from "./providers";
import { cx } from "./ui";

const ROLE_ORDER: Role[] = ["guest", "examinee", "author", "grader", "admin"];

function RoleSwitcher() {
  const { role, setRole } = useStore();
  const router = useRouter();
  return (
    <div className="flex items-center gap-ds-2">
      <span className="text-caption text-ds-muted mr-ds-1 hidden md:inline">
        역할 전환
      </span>
      {ROLE_ORDER.map((r) => {
        const active = r === role;
        return (
          <button
            key={r}
            onClick={() => {
              setRole(r);
              router.push(ROLES[r].home);
            }}
            title={ROLES[r].desc}
            className={cx(
              "h-7 px-ds-4 rounded-ds-xs text-caption border transition-colors",
              active
                ? "bg-ds-primary text-ds-inverse border-ds-primary font-medium"
                : "bg-ds-base text-ds-secondary border-ds-border hover:bg-ds-soft",
            )}
            style={active ? { background: "#222", borderColor: "#222" } : undefined}
          >
            {ROLES[r].short}
          </button>
        );
      })}
    </div>
  );
}

function Header() {
  const { role } = useStore();
  return (
    <header className="sticky top-0 z-30 h-[60px] flex items-center gap-ds-7 px-ds-8 bg-ds-base border-b border-ds-border">
      <Link href="/" className="flex items-center gap-ds-3 shrink-0">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-ds-sm bg-ds-brand text-ds-inverse text-caption font-bold">
          H
        </span>
        <span className="text-subtitle font-bold">휴텍씨 시험 플랫폼</span>
        <span className="text-caption text-ds-muted hidden lg:inline">통합</span>
      </Link>
      <div className="flex-1" />
      <RoleSwitcher />
      <div className="hidden md:flex items-center gap-ds-3 pl-ds-6 ml-ds-2 border-l border-ds-border shrink-0">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-ds-full bg-ds-page text-caption">
          👤
        </span>
        <span className="text-caption text-ds-secondary">
          {ROLES[role].label}
        </span>
      </div>
    </header>
  );
}

function Sidebar() {
  const { role } = useStore();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const groups = ROLE_MENUS[role];

  return (
    <aside
      className={cx(
        "shrink-0 bg-ds-sidebar border-r border-ds-border transition-all",
        open ? "w-[220px]" : "w-[52px]",
      )}
    >
      <div className="sticky top-[60px] p-ds-4">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full h-8 mb-ds-3 flex items-center justify-center rounded-ds-xs text-caption text-ds-muted hover:bg-ds-soft border border-transparent hover:border-ds-border"
          title={open ? "접기" : "펼치기"}
        >
          {open ? "◀ 메뉴 접기" : "▶"}
        </button>
        {groups.map((g) => (
          <div key={g.group} className="mb-ds-5">
            {open && (
              <div className="px-ds-3 mb-ds-2 text-[10px] font-bold tracking-wide text-ds-muted uppercase">
                {g.group}
              </div>
            )}
            <nav className="flex flex-col gap-[2px]">
              {g.items.map((it) => {
                const active =
                  pathname === it.href ||
                  (it.href !== "/" &&
                    it.ready &&
                    pathname.startsWith(it.href + "/"));
                if (!it.ready) {
                  // 미구현 — 숨기지 않고 비활성 표시 (삭제 금지 규칙)
                  return (
                    <div
                      key={it.href}
                      title="다음 회차 구현 예정"
                      className="flex items-center gap-ds-3 h-9 px-ds-3 rounded-ds-xs text-caption text-ds-disabled cursor-default select-none"
                    >
                      <span className="w-4 text-center">{it.icon}</span>
                      {open && (
                        <>
                          <span className="flex-1 truncate">{it.label}</span>
                          <span className="text-[9px] px-ds-2 rounded-ds-full bg-ds-base border border-ds-border text-ds-muted">
                            예정
                          </span>
                        </>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cx(
                      "flex items-center gap-ds-3 h-9 px-ds-3 rounded-ds-xs text-caption transition-colors",
                      active
                        ? "bg-ds-selected text-ds-brand font-semibold"
                        : "text-ds-secondary hover:bg-ds-soft",
                    )}
                  >
                    <span className="w-4 text-center">{it.icon}</span>
                    {open && <span className="flex-1 truncate">{it.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="h-[60px] flex items-center justify-center px-ds-8 bg-ds-footer border-t border-ds-border text-caption text-ds-muted">
      휴텍씨 시험 홈페이지 통합 · 2024 토대 + 2025 UX + vibecoding 관리 · 디자인
      시스템 v1
    </footer>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const { role } = useStore();
  // 게스트 홈은 사이드바 없이 풀폭 랜딩
  const showSidebar = role !== "guest";
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        {showSidebar && <Sidebar />}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 px-ds-8 py-ds-7">
            <div className="ds-content">{children}</div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
