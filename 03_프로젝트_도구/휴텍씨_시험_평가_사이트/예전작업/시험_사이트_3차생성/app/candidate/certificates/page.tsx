"use client";

import { useState } from "react";
import { ActionLog, AppShell, DataTable, StatusBadge } from "@/components/ui";

const certificateRows = [
  ["C-801", "프롬프트 교육 3급", "합격", "온라인 발급", "발급대기"],
  ["C-802", "웹툰 번역 일반 1급", "합격", "우편 수령", "발급완료"]
];

export default function CandidateCertificatesPage() {
  const [rows, setRows] = useState(certificateRows);
  const [logs, setLogs] = useState<string[]>(["자격증 신청 화면 로드 완료"]);

  function log(message: string) {
    setLogs((prev) => [`${new Date().toLocaleTimeString("ko-KR")} ${message}`, ...prev].slice(0, 8));
  }

  function applyCertificate() {
    setRows((prev) => [["C-803", "AI번역 일반 2급", "합격", "온라인 발급", "발급대기"], ...prev]);
    log("AI번역 일반 2급 자격증 발급 신청 접수");
  }

  return (
    <AppShell role="candidate" title="자격증 신청">
      <div className="content grid">
        <section className="grid two">
          <div className="panel">
            <h2>자격증 발급 신청</h2>
            <div className="form">
              <label className="field">신청 시험<select><option>AI번역 일반 2급</option><option>프롬프트 교육 3급</option><option>웹툰 번역 일반 1급</option></select></label>
              <label className="field">수령 방식<select><option>온라인 발급</option><option>우편 수령</option></select></label>
              <label className="field">영문명<input defaultValue="MINSEO KIM" /></label>
              <label className="field">이메일<input defaultValue="candidate@example.com" /></label>
              <label className="field full">배송 주소<input defaultValue="서울시 강남구 테헤란로 00" /></label>
            </div>
            <div className="actions">
              <button className="btn good" onClick={applyCertificate}>발급 신청</button>
              <button className="btn" onClick={() => log("자격증 PDF 미리보기")}>PDF 미리보기</button>
            </div>
          </div>

          <div className="certificate">
            <div>
              <span>AITP Certificate</span>
              <strong>AI Translation Level 2</strong>
              <p>김민서 / 합격 / 2026.06.30</p>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>자격증 신청 내역</h2>
          <DataTable
            headers={["신청ID", "시험명", "결과", "수령 방식", "발급상태", "액션"]}
            rows={rows.map((row) => [row[0], row[1], <StatusBadge key="r" value={row[2]} />, row[3], <StatusBadge key="s" value={row[4]} />, <button className="btn" key="d" onClick={() => log(`${row[0]} 상세 확인`)}>상세</button>])}
          />
        </section>
        <ActionLog logs={logs} />
      </div>
    </AppShell>
  );
}
