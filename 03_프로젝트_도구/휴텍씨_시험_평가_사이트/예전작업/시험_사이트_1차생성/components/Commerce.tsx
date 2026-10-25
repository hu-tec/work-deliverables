import { cartItems } from "@/lib/fixtures";

export function CartList({ single = false }: { single?: boolean }) {
  const items = single ? cartItems.slice(0, 1) : cartItems;
  return (
    <section className="cart-list">
      {!single && <label className="select-all"><input type="checkbox" defaultChecked />전체선택</label>}
      {items.map((item, index) => (
        <article className={`cart-item ${item.selected ? "selected" : ""}`} key={item.id}>
          <input type="checkbox" defaultChecked={item.selected} />
          <div className="cart-main">
            <h2>{item.title}</h2>
            <p>{item.files}</p>
            <strong>{item.from} › <span>{item.to}</span></strong>
          </div>
          <div className="cart-meta">
            <span>번역기 1</span><span>번역기 2</span><span>번역기 3</span>
          </div>
          <div className="cart-detail">
            <b>문서 변환 <em>PPTX</em></b>
            <b>에디팅 <span>사용</span></b>
            <b>글자수 <span>10,000자</span></b>
            <strong>{item.price.toLocaleString()}원</strong>
          </div>
        </article>
      ))}
    </section>
  );
}

export function CheckoutSummary({ total = 440000, count = 2 }: { total?: number; count?: number }) {
  return (
    <aside className="checkout-card">
      <h2>{count === 1 ? "총 1건" : "선택 번역 총 2건"}</h2>
      <p>The letter name name name name The letter name name name name.mp4</p>
      <div className="summary-line"><span>220,000원</span><span>⌃</span></div>
      {count > 1 && <div className="summary-breakdown"><span>원문번역 <b>400,000원</b></span><span>후면번역 감수 요청 <b>10,000원</b></span><span>긴급작업 <b>20,000원</b></span></div>}
      <div className="total"><strong>Total</strong><b>{total.toLocaleString()} 원</b></div>
      <button className="pay">▣ 신용카드 / 페이 결제</button>
      <button className="pay">포인트 결제 <small>(현재 보유 포인트: 50,000)</small></button>
      <div className="summary-buttons"><button>구독 신청</button><button>전문가 견적 받아보기</button></div>
    </aside>
  );
}
