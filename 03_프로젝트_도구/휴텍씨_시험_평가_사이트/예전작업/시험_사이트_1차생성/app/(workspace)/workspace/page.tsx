import { PublicShell } from "@/components/AppShell";
import { CategoryTabs, PillSteps, WorkspacePanel } from "@/components/WorkspaceControls";

export default function WorkspacePage() {
  return (
    <PublicShell>
      <main className="workspace-main">
        <div className="breadcrumb">홈 &gt; 창작작업실</div>
        <div className="workspace-actions"><span>↺</span><button>임시저장</button><button className="outline">카드</button><button className="primary">적용</button></div>
        <h1>창작작업실</h1>
        <CategoryTabs />
        <PillSteps />
        <WorkspacePanel />
      </main>
    </PublicShell>
  );
}
