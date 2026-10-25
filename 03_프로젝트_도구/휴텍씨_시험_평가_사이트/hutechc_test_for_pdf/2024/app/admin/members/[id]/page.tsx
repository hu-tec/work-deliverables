import { Button } from "../../../../components/Button";
import { PageHeader } from "../../../../components/PageHeader";
import { members } from "../../../../lib/mock-data";

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = members.find((item) => item.id === id) ?? members[0];

  return (
    <main data-design-source="../../figma_pdf/2024/회원관리_상세_전체.pdf">
      <PageHeader title="회원 상세" description={`${member.name} 회원의 기본 정보와 상태 이력을 확인합니다.`} />
      <div className="detail-grid">
        <section className="surface detail-section">
          <h2>기본 정보</h2>
          <dl>
            <div className="kv"><dt>회원 ID</dt><dd>{member.id}</dd></div>
            <div className="kv"><dt>이름</dt><dd>{member.name}</dd></div>
            <div className="kv"><dt>이메일</dt><dd>{member.email}</dd></div>
            <div className="kv"><dt>권한</dt><dd>{member.role}</dd></div>
          </dl>
        </section>
        <section className="surface detail-section">
          <h2>상태 관리</h2>
          <div className="form-stack">
            <div className="field">
              <label htmlFor="status">회원 상태</label>
              <select id="status" defaultValue={member.status}>
                <option value="approved">승인</option>
                <option value="pending">대기</option>
                <option value="rejected">반려</option>
                <option value="stopped">정지</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="memo">처리 메모</label>
              <textarea id="memo" />
            </div>
            <Button>저장</Button>
          </div>
        </section>
      </div>
    </main>
  );
}
