import { PublicShell } from "@/components/AppShell";
import { CartList, CheckoutSummary } from "@/components/Commerce";

export default function CheckoutPage() {
  return (
    <PublicShell active="장바구니">
      <main className="commerce-main">
        <div className="breadcrumb">홈 &gt; 창작마켓 &gt; 상세</div>
        <h1>장바구니</h1>
        <div className="commerce-layout">
          <CartList single />
          <CheckoutSummary count={1} total={385000} />
        </div>
      </main>
    </PublicShell>
  );
}
