import Link from "next/link";
import { Button } from "../../../components/Button";
import { DataTable } from "../../../components/DataTable";
import { PageHeader } from "../../../components/PageHeader";
import { members } from "../../../lib/mock-data";
import { filterRows } from "../../../lib/table";

export default function MembersPage() {
  const rows = filterRows(members, { query: "", status: "all" });

  return (
    <main data-design-source="../../figma_pdf/2024/회원관리.pdf">
      <PageHeader title="회원관리" description="회원 승인, 반려, 정지 상태를 관리합니다." action={<Button>회원 등록</Button>} />
      <div className="toolbar">
        <select aria-label="상태 필터">
          <option>전체 상태</option>
          <option>승인</option>
          <option>대기</option>
          <option>정지</option>
        </select>
        <input aria-label="회원 검색" placeholder="이름, 이메일, 회원 ID 검색" />
        <Button variant="secondary">검색</Button>
      </div>
      <DataTable
        selectedIds={["M-1002"]}
        columns={[
          { key: "select", label: "" },
          { key: "id", label: "회원 ID" },
          { key: "name", label: "이름" },
          { key: "email", label: "이메일" },
          { key: "role", label: "권한" },
          { key: "joinedAt", label: "가입일" },
          { key: "status", label: "상태" },
          { key: "actions", label: "관리", render: (row) => <Link href={`/admin/members/${row.id}`}>상세</Link> }
        ]}
        rows={rows}
      />
    </main>
  );
}
