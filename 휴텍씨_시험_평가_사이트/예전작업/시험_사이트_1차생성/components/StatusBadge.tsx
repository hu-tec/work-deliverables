const labels: Record<string, string> = {
  approved: "승인",
  pending: "대기",
  stopped: "정지",
  rejected: "반려",
  paid: "결제완료",
  refunded: "환불",
  waiting: "대기",
  complete: "완료"
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{labels[status] ?? status}</span>;
}
