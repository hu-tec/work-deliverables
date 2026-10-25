export function SaveResultModal() {
  return (
    <section className="save-panel" aria-label="저장 결과">
      <strong>저장/반영 대기</strong>
      <p>검수 완료 항목은 관리자 데이터에 반영할 수 있습니다. 실패 항목은 이력에서 다시 확인합니다.</p>
      <div>
        <button className="outline-button">임시저장</button>
        <button className="primary-button">최종 반영</button>
      </div>
    </section>
  );
}
