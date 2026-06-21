"use client";

import { useState } from "react";
import { ActionLog, AppShell, DataTable, StatusBadge } from "@/components/ui";
import { payments } from "@/lib/data";

export default function CandidatePaymentsPage() {
  const [rows, setRows] = useState(payments);
  const [logs, setLogs] = useState<string[]>(["결제내역 로드 완료"]);

  function log(message: string) {
    setLogs((prev) => [`${new Date().toLocaleTimeString("ko-KR")} ${message}`, ...prev].slice(0, 8));
  }

  function refund(id: string) {
    setRows((prev) => prev.map((row) => row[0] === id ? [row[0], row[1], row[2], row[3], "환불요청", "보류"] : row));
    log(`${id} 환불 요청 접수`);
  }

  return (
    <AppShell role="candidate" title="결제 내역">
      <div className="content grid">
        <section className="grid four">
          <div className="stat"><span>총 결제</span><strong>4건</strong></div>
          <div className="stat"><span>결제완료</span><strong>2건</strong></div>
          <div className="stat"><span>환불요청</span><strong>{rows.filter((row) => row[4] === "환불요청").length}건</strong></div>
          <div className="stat"><span>보유 포인트</span><strong>50,000P</strong></div>
        </section>

        <section className="panel">
          <h2>결제내역</h2>
          <DataTable
            headers={["결제ID", "내용", "수단", "금액", "결제상태", "정산/환불", "영수증", "액션"]}
            rows={rows.map((row) => [
              row[0],
              row[1],
              row[2],
              row[3],
              <StatusBadge key="pay" value={row[4]} />,
              <StatusBadge key="set" value={row[5]} />,
              <button className="btn" key="receipt" onClick={() => log(`${row[0]} 영수증 확인`)}>영수증</button>,
              <button className="btn danger" key="refund" onClick={() => refund(row[0])}>환불요청</button>
            ])}
          />
        </section>

        <section className="grid two">
          <div className="panel">
            <h2>새 결제</h2>
            <div className="form">
              <label className="field">결제 상품<select><option>AI번역 일반 2급</option><option>자격증 발급 수수료</option><option>포인트 충전</option></select></label>
              <label className="field">결제 수단<select><option>신용카드</option><option>포인트</option><option>가상계좌</option></select></label>
            </div>
            <div className="actions"><button className="btn primary" onClick={() => log("새 결제 승인 완료")}>결제하기</button><button className="btn" onClick={() => log("포인트 결제 확인")}>포인트 결제</button></div>
          </div>
          <div className="panel">
            <h2>환불 규정 확인</h2>
            <p className="muted">접수 기간 내 취소는 전액 환불, 시험 시작 후에는 관리자 승인 후 부분 환불로 처리합니다.</p>
          </div>
        </section>
        <ActionLog logs={logs} />
      </div>
    </AppShell>
  );
}
