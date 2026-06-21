import { Button } from "./Button";

export function ConfirmModal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">{title}</div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <Button variant="outline">취소</Button>
          <Button>확인</Button>
        </div>
      </section>
    </div>
  );
}
