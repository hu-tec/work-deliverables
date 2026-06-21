"use client";

import { useMemo, useState } from "react";
import { ActionLog, AppShell, DataTable, StatusBadge } from "@/components/ui";
import { exams, payments } from "@/lib/data";

type Step = "apply" | "payment" | "exam" | "result" | "certificate";

export default function CandidatePage() {
  const [step, setStep] = useState<Step>("apply");
  const [examId, setExamId] = useState(exams[0].id);
  const [application, setApplication] = useState("미신청");
  const [payment, setPayment] = useState("미결제");
  const [examState, setExamState] = useState("응시대기");
  const [result, setResult] = useState("결과대기");
  const [certificate, setCertificate] = useState("미신청");
  const [logs, setLogs] = useState<string[]>(["수험생 플로우 준비 완료"]);
  const selectedExam = useMemo(() => exams.find((exam) => exam.id === examId) ?? exams[0], [examId]);

  function log(message: string) {
    setLogs((prev) => [`${new Date().toLocaleTimeString("ko-KR")} ${message}`, ...prev].slice(0, 8));
  }

  function applyExam() {
    setApplication("접수완료");
    setPayment("결제대기");
    setStep("payment");
    log(`${selectedExam.title} 접수 완료, 결제 단계 활성화`);
  }

  function payExam() {
    if (application !== "접수완료") return log("접수 완료 후 결제할 수 있습니다");
    setPayment("결제완료");
    setExamState("응시가능");
    setStep("exam");
    log("결제 완료, 시험 응시 화면 활성화");
  }

  function submitExam() {
    if (payment !== "결제완료") return log("결제 완료 후 응시할 수 있습니다");
    setExamState("제출완료");
    setResult("채점중");
    setStep("result");
    log("답안 제출 완료, 채점 대기 상태로 이동");
  }

  function publishResult() {
    if (examState !== "제출완료") return log("제출 완료 후 결과를 확인할 수 있습니다");
    setResult("합격");
    log("결과 발표: 합격, 자격증 신청 가능");
  }

  function requestCertificate() {
    if (result !== "합격") return log("합격 상태에서만 자격증 신청 가능");
    setCertificate("발급대기");
    log("자격증 발급 신청 접수");
  }

  const stepInfo = [
    ["apply", "시험 접수", application],
    ["payment", "결제", payment],
    ["exam", "시험 응시", examState],
    ["result", "결과 확인", result],
    ["certificate", "자격증 신청", certificate]
  ] as const;

  return (
    <AppShell role="candidate" title="수험생 시험 접수/응시">
      <div className="content">
        <section className="workflow">
          {stepInfo.map(([key, label, status], index) => (
            <button className={`step ${step === key ? "active" : ""} ${/완료|합격|발급/.test(status) ? "done" : ""}`} key={key} onClick={() => setStep(key)}>
              <span>STEP {index + 1}</span>
              <strong>{label}</strong>
              <p>{status}</p>
            </button>
          ))}
        </section>

        <section className="split">
          <div className="grid">
            {step === "apply" && (
              <section className="panel">
                <h2>시험 접수 목록</h2>
                <DataTable
                  headers={["선택", "시험명", "회차", "등급", "유형", "일시", "응시료", "상태", "액션"]}
                  rows={exams.map((exam) => [
                    <input key="pick" type="radio" checked={exam.id === examId} onChange={() => setExamId(exam.id)} />,
                    exam.title,
                    exam.round,
                    exam.grade,
                    exam.type,
                    exam.date,
                    `${exam.fee.toLocaleString()}원`,
                    <StatusBadge key="status" value={exam.id === examId ? application : exam.status} />,
                    <button className="btn primary" key="apply" onClick={applyExam}>신청 확정</button>
                  ])}
                />
                <div className="form" style={{ marginTop: 12 }}>
                  <label className="field">응시자명<input defaultValue="김민서" /></label>
                  <label className="field">휴대폰<input defaultValue="010-1234-5678" /></label>
                  <label className="field">언어쌍<select defaultValue="ko-en"><option value="ko-en">한국어 &gt; 영어</option><option>영어 &gt; 한국어</option></select></label>
                  <label className="field">수험표 수령<input defaultValue="이메일" /></label>
                </div>
              </section>
            )}

            {step === "payment" && (
              <section className="panel">
                <h2>결제</h2>
                <div className="grid two">
                  <div className="grid">
                    {["신용카드", "포인트 결제", "가상계좌", "간편결제"].map((method) => <label className="panel" key={method}><input type="radio" name="pay" defaultChecked={method === "신용카드"} /> {method}</label>)}
                  </div>
                  <aside className="panel">
                    <h2>결제 요약</h2>
                    <p>{selectedExam.title}</p>
                    <strong>{selectedExam.fee.toLocaleString()} 원</strong>
                    <div className="actions"><button className="btn primary" onClick={payExam}>결제 완료</button><button className="btn">영수증</button></div>
                  </aside>
                </div>
                <DataTable headers={["결제ID", "내용", "수단", "금액", "상태", "정산"]} rows={payments.map((row) => row.map((cell, index) => index >= 4 ? <StatusBadge key={cell} value={cell} /> : cell))} />
              </section>
            )}

            {step === "exam" && (
              <section className="panel">
                <h2>시험 응시 화면</h2>
                <div className="exam-room">
                  <aside>
                    <div className="timer">39:58</div>
                    <div className="qnav">{Array.from({ length: 10 }, (_, index) => <button className={index === 0 ? "active" : ""} key={index}>{index + 1}</button>)}</div>
                    <div className="actions"><button className="btn">전체화면 확인</button><button className="btn">다음 차시</button></div>
                  </aside>
                  <div className="grid">
                    <label className="field full">지문<textarea defaultValue="계약서 일부를 목적 언어로 정확하게 번역하고 법률 용어의 일관성을 유지하십시오." /></label>
                    <label className="field full">답안 에디터<textarea defaultValue="답안을 작성하면 자동저장됩니다." /></label>
                    <div className="actions"><button className="btn" onClick={() => log("답안 자동저장 완료")}>임시저장</button><button className="btn primary" onClick={submitExam}>제출 완료</button></div>
                  </div>
                </div>
              </section>
            )}

            {step === "result" && (
              <section className="panel" id="results">
                <h2>시험 결과</h2>
                <div className="grid four">
                  <div className="stat"><span>총점</span><strong>{result === "합격" ? "87" : "-"}</strong></div>
                  <div className="stat"><span>정확성</span><strong>{result === "합격" ? "36/40" : "-"}</strong></div>
                  <div className="stat"><span>용어</span><strong>{result === "합격" ? "25/30" : "-"}</strong></div>
                  <div className="stat"><span>결과</span><strong>{result}</strong></div>
                </div>
                <div className="actions"><button className="btn primary" onClick={publishResult}>결과 발표 처리</button><button className="btn good" onClick={() => setStep("certificate")}>자격증 신청으로 이동</button></div>
              </section>
            )}

            {step === "certificate" && (
              <section className="panel" id="certificate">
                <h2>자격증 신청</h2>
                <div className="grid two">
                  <div className="form">
                    <label className="field">신청 시험<input defaultValue={selectedExam.title} /></label>
                    <label className="field">수령 방식<select><option>온라인 발급</option><option>우편 수령</option></select></label>
                    <label className="field">영문명<input defaultValue="MINSEO KIM" /></label>
                    <label className="field">이메일<input defaultValue="candidate@example.com" /></label>
                  </div>
                  <div className="certificate"><div><span>AITP Certificate</span><strong>{selectedExam.title}</strong><p>김민서 / {result}</p></div></div>
                </div>
                <div className="actions"><button className="btn good" onClick={requestCertificate}>발급 신청</button><button className="btn">PDF 미리보기</button></div>
              </section>
            )}
          </div>

          <aside className="panel summary">
            <h2>진행 요약</h2>
            <dl>
              <div><dt>시험</dt><dd>{selectedExam.title}</dd></div>
              <div><dt>접수</dt><dd><StatusBadge value={application} /></dd></div>
              <div><dt>결제</dt><dd><StatusBadge value={payment} /></dd></div>
              <div><dt>응시</dt><dd><StatusBadge value={examState} /></dd></div>
              <div><dt>결과</dt><dd><StatusBadge value={result} /></dd></div>
              <div><dt>자격증</dt><dd><StatusBadge value={certificate} /></dd></div>
            </dl>
          </aside>
        </section>
        <ActionLog logs={logs} />
      </div>
    </AppShell>
  );
}
