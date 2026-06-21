import { historyRows } from "@/lib/fixtures";

export function ProcessingHistoryTable() {
  return (
    <section className="table-section" aria-label="처리 이력">
      <div className="table-actions">
        <strong>처리 이력</strong>
        <button className="outline-button">파일다운로드</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>작업번호</th>
            <th>파일명</th>
            <th>상태</th>
            <th>최근 처리일</th>
          </tr>
        </thead>
        <tbody>
          {historyRows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.file}</td>
              <td>{row.status}</td>
              <td>{row.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
