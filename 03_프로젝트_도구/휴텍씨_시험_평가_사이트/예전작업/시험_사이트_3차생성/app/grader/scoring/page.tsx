"use client";

import { useMemo, useState } from "react";
import { ActionLog, AppShell, DataTable, StatusBadge } from "@/components/ui";
import { gradingJobs } from "@/lib/data";

export default function GraderScoringPage() {
  const [jobs, setJobs] = useState(gradingJobs);
  const [selectedId, setSelectedId] = useState(gradingJobs[0].id);
  const [logs, setLogs] = useState<string[]>(["채점 대상 로드 완료"]);
  const selected = useMemo(() => jobs.find((job) => job.id === selectedId) ?? jobs[0], [jobs, selectedId]);

  function log(message: string) {
    setLogs((prev) => [`${new Date().toLocaleTimeString("ko-KR")} ${message}`, ...prev].slice(0, 8));
  }

  function complete(score: number) {
    setJobs((prev) => prev.map((job) => job.id === selectedId ? { ...job, score, status: "완료" as const } : job));
    log(`${selectedId} ${score}점 채점완료`);
  }

  return (
    <AppShell role="grader" title="채점관리 / 개별 답안 채점">
      <div className="content grid">
        <section className="panel">
          <h2>채점 대상 시험</h2>
          <DataTable
            headers={["선택", "배정ID", "시험", "유형", "수험생", "상태", "점수", "액션"]}
            rows={jobs.map((job) => [
              <input key="pick" type="radio" checked={job.id === selectedId} onChange={() => { setSelectedId(job.id); log(`${job.id} 답안 열기`); }} />,
              job.id,
              job.exam,
              job.type,
              job.candidate,
              <StatusBadge key="status" value={job.status} />,
              job.score || "-",
              <button className="btn primary" key="open" onClick={() => setSelectedId(job.id)}>개별채점</button>
            ])}
          />
        </section>

        <section className="split scoring-split" id="score">
          <div className="panel">
            <h2>개별 답안 채점</h2>
            <p><strong>{selected.candidate}</strong> / {selected.exam} / {selected.type}</p>
            <label className="field full">수험생 답안<textarea value={selected.answer} readOnly /></label>
            <div className="form">
              <label className="field">정확성<input defaultValue="36" type="number" /></label>
              <label className="field">용어<input defaultValue="25" type="number" /></label>
              <label className="field">문체<input defaultValue="18" type="number" /></label>
              <label className="field">형식<input defaultValue="8" type="number" /></label>
              <label className="field full">채점 의견<textarea defaultValue="용어 일관성이 좋고 일부 문체 표현만 보완하면 됩니다." /></label>
            </div>
            <div className="actions"><button className="btn" onClick={() => log("채점 임시저장")}>임시저장</button><button className="btn primary" onClick={() => complete(87)}>채점완료</button><button className="btn" onClick={() => log("평가서 확인")}>평가서 보기</button></div>
          </div>

          <aside className="panel report-panel" id="report">
            <h2>평가서</h2>
            <div className="report-score">
              <span>총점</span>
              <strong>87</strong>
              <span>/ 100</span>
            </div>
            <div className="report-items">
              {[
                ["정확성", "36/40"],
                ["용어", "25/30"],
                ["문체", "18/20"],
                ["형식", "8/10"]
              ].map(([label, score]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{score}</strong>
                </div>
              ))}
            </div>
            <label className="field full">평가 요약<textarea defaultValue="법률 용어 일관성과 문맥 이해가 우수합니다. 일부 문체 표현만 보완하면 실무 적용 가능합니다." readOnly /></label>
          </aside>
        </section>
        <ActionLog logs={logs} />
      </div>
    </AppShell>
  );
}
