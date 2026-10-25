import { AppShell } from "./AppShell";
import { PageHeader } from "./PageHeader";
import { roles } from "../lib/ia";

type Role = "candidate" | "author" | "grader" | "admin";

export function RouteFallback({
  role,
  section
}: {
  role: Role;
  section: string[];
}) {
  const roleInfo = roles[role];
  const path = `/${role}/${section.join("/")}`;
  const menuTitle = Object.entries(roleInfo.menuLinks).find(([, href]) => href === path)?.[0] ?? "페이지";

  return (
    <AppShell role={role} title={menuTitle}>
      <main data-design-source="pending">
        <PageHeader
          title={menuTitle}
          description="해당 메뉴는 현재 라우터에 연결되어 있으며, 상세 화면은 후속 구현 대상입니다."
        />
        <section className="surface empty-state">
          <h2>준비 중인 화면입니다</h2>
          <p>사이드바 이동은 정상 동작합니다. 화면 상세 UI가 확정되면 이 영역에 구현됩니다.</p>
        </section>
      </main>
    </AppShell>
  );
}
