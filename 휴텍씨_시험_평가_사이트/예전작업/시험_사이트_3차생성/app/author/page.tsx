import Link from "next/link";
import { AppShell, DataTable, StatusBadge } from "@/components/ui";
import { authorItems } from "@/lib/data";

export default function AuthorHomePage() {
  return (
    <AppShell role="author" title="출제자 홈">
      <div className="content grid">
        <section className="grid four">
          <div className="stat"><span>배정 문항</span><strong>12</strong></div>
          <div className="stat"><span>임시저장</span><strong>4</strong></div>
          <div className="stat"><span>검수중</span><strong>5</strong></div>
          <div className="stat"><span>반려</span><strong>3</strong></div>
        </section>
        <section className="panel">
          <h2>최근 출제내역</h2>
          <DataTable
            headers={["ID", "시험", "유형", "문항", "상태", "수정일", "액션"]}
            rows={authorItems.map((item) => [item.id, item.exam, item.type, item.title, <StatusBadge key="s" value={item.status} />, item.updatedAt, <Link className="btn primary" key="go" href="/author/items">작성/수정</Link>])}
          />
        </section>
      </div>
    </AppShell>
  );
}
