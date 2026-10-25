import { PublicShell } from "@/components/AppShell";
import { CartList, CheckoutSummary } from "@/components/Commerce";

export default function CartPage() {
  return (
    <PublicShell active="장바구니">
      <main className="commerce-main">
        <div className="breadcrumb">홈 &gt; 장바구니</div>
        <h1>장바구니</h1>
        <div className="commerce-layout">
          <CartList />
          <CheckoutSummary />
        </div>
      </main>
    </PublicShell>
  );
}
