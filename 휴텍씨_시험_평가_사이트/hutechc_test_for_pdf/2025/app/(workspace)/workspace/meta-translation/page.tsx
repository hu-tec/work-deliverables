import { PublicShell } from "@/components/AppShell";
import { CategoryTabs, WorkspacePanel } from "@/components/WorkspaceControls";

export default function MetaTranslationPage() {
  return (
    <PublicShell>
      <main className="workspace-main purple-page">
        <div className="breadcrumb">홈 &gt; 메타T 번역</div>
        <div className="workspace-actions"><span>↺</span><button>임시저장</button><button className="primary purple">적용</button></div>
        <h1>메타-T 번역</h1>
        <CategoryTabs mode="meta" />
        <div className="pill-steps purple compact-pills"><button>아나운서</button><button>관광가이드</button><button className="selected">큐레이터</button><button>안내</button></div>
        <WorkspacePanel accent="purple" meta />
      </main>
    </PublicShell>
  );
}
