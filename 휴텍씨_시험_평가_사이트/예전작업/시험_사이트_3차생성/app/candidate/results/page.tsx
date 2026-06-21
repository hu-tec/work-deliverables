"use client";

import { useState } from "react";
import { ActionLog, AppShell, DataTable, StatusBadge } from "@/components/ui";
import { exams } from "@/lib/data";

export default function CandidateResultsPage() {
  const [selected, setSelected] = useState("EX-2402");
  const [published, setPublished] = useState(true);
  const [logs, setLogs] = useState<string[]>(["시험 결과 목록 로드 완료"]);
  const selectedExam = exams.find((exam) => exam.id === selected) ?? exams[1];
  const selectedResult = published ? "합격" : "채점중";

  function log(message: string) {
    setLogs((prev) => [`${new Date().toLocaleTimeString("ko-KR")} ${message}`, ...prev].slice(0, 8));
  }

  return (
    <AppShell role="candidate" title="시험 결과">
      <div className="content grid">
        <section className="panel">
          <h2>시험 결과 목록</h2>
          <DataTable
            headers={["선택", "시험명", "유형", "응시일", "점수", "결과", "평가서", "액션"]}
            rows={exams.map((exam, index) => {
              const isCurrent = exam.id === selected;
              const result = isCurrent ? selectedResult : index % 2 ? "합격" : "채점중";
              return [
                <input key="pick" type="radio" checked={isCurrent} onChange={() => { setSelected(exam.id); log(`${exam.title} 결과 상세 열기`); }} />,
                exam.title,
                exam.type,
                exam.date,
                result === "합격" ? `${82 + index}점` : "-",
                <StatusBadge key="result" value={result} />,
                <button className="btn" key="report" onClick={() => log(`${exam.title} 평가서 확인`)}>평가서</button>,
                result === "합격" ? <a className="btn good" key="cert" href="/candidate/certificates">자격증 신청</a> : <button className="btn" key="wait" onClick={() => log("채점 완료 후 자격증 신청 가능")}>대기</button>
              ];
            })}
          />
        </section>

        <section className="grid two">
          <div className="panel">
            <h2>결과 상세</h2>
            <div className="grid four">
              <div className="stat"><span>총점</span><strong>{published ? "87" : "-"}</strong></div>
              <div className="stat"><span>정확성</span><strong>{published ? "36/40" : "-"}</strong></div>
              <div className="stat"><span>용어</span><strong>{published ? "25/30" : "-"}</strong></div>
              <div className="stat"><span>결과</span><strong>{selectedResult}</strong></div>
            </div>
            <label className="field full">채점 의견<textarea value={published ? "법률 용어 일관성과 문맥 이해가 우수합니다. 일부 문체 표현만 보완하면 실무 적용 가능합니다." : "아직 채점 중입니다."} readOnly /></label>
            <div className="actions">
              <button className="btn primary" onClick={() => { setPublished(true); log("결과 발표 상태로 갱신"); }}>결과 새로고침</button>
              <a className="btn good" href="/candidate/certificates">자격증 신청</a>
            </div>
          </div>

          <div className="panel">
            <h2>선택 시험</h2>
            <dl className="summary">
              <div><dt>시험명</dt><dd>{selectedExam.title}</dd></div>
              <div><dt>회차</dt><dd>{selectedExam.round}</dd></div>
              <div><dt>등급</dt><dd>{selectedExam.grade}</dd></div>
              <div><dt>유형</dt><dd>{selectedExam.type}</dd></div>
              <div><dt>응시일</dt><dd>{selectedExam.date}</dd></div>
            </dl>
          </div>
        </section>
        <ActionLog logs={logs} />
      </div>
    </AppShell>
  );
}
