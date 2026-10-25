const statusLabels = {
  uploaded: "업로드완료",
  valid: "정상",
  invalid: "오류있음",
  complete: "처리완료",
  failed: "실패",
  "in-review": "검수중",
  "needs-review": "수정필요",
  confirmed: "확정",
  saved: "저장완료",
  applied: "반영완료"
} as const;

export function ProcessingStatusBadge({ status }: { status: keyof typeof statusLabels }) {
  return <span className={`status-badge status-${status}`}>{statusLabels[status]}</span>;
}
