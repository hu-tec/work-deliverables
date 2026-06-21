import { AppShell } from "../../../components/AppShell";

export default function AdminMembersLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell role="admin" title="회원관리">
      {children}
    </AppShell>
  );
}
