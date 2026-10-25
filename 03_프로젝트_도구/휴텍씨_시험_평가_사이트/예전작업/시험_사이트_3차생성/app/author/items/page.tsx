"use client";

import { useMemo, useState } from "react";
import { ActionLog, AppShell, DataTable, StatusBadge } from "@/components/ui";
import { authorItems } from "@/lib/data";

export default function AuthorItemsPage() {
  const [items, setItems] = useState(authorItems);
  const [selectedId, setSelectedId] = useState(authorItems[0].id);
  const [type, setType] = useState(authorItems[0].type);
  const [preview, setPreview] = useState(false);
  const [logs, setLogs] = useState<string[]>(["출제내역 로드 완료"]);
  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? items[0], [items, selectedId]);

  function log(message: string) {
    setLogs((prev) => [`${new Date().toLocaleTimeString("ko-KR")} ${message}`, ...prev].slice(0, 8));
  }

  function updateStatus(status: string) {
    setItems((prev) => prev.map((item) => item.id === selectedId ? { ...item, status: status as typeof item.status, updatedAt: "방금 전" } : item));
    log(`${selectedId} ${status} 처리`);
  }

  function selectItem(id: string) {
    const item = items.find((entry) => entry.id === id);
    setSelectedId(id);
    if (item) setType(item.type);
    setPreview(false);
    log(`${id} 문항 상세 열기`);
  }

  return (
    <AppShell role="author" title="출제내역 / 문제 작성">
      <div className="content grid">
        <section className="panel">
          <h2>출제내역</h2>
          <DataTable
            headers={["선택", "ID", "시험", "유형", "문항", "배점", "상태", "수정일", "액션"]}
            rows={items.map((item) => [
              <input key="radio" type="radio" checked={item.id === selectedId} onChange={() => selectItem(item.id)} />,
              item.id,
              item.exam,
              item.type,
              item.title,
              item.score,
              <StatusBadge key="status" value={item.status} />,
              item.updatedAt,
              <button className="btn primary" key="open" onClick={() => selectItem(item.id)}>상세</button>
            ])}
          />
        </section>

        <section className="split" id="editor">
          <div className="panel">
            <h2>문제 상세 작성</h2>
            <div className="toolbar">
              {["번역형", "프롬프트형", "단답형"].map((value) => <button className={`btn ${type === value ? "primary" : ""}`} key={value} onClick={() => setType(value)}>{value}</button>)}
            </div>
            <div className="form">
              <label className="field">시험명<input defaultValue={selected.exam} /></label>
              <label className="field">문항 ID<input value={selected.id} readOnly /></label>
              <label className="field">회차<input defaultValue="28회" /></label>
              <label className="field">등급<input defaultValue="일반 2급" /></label>
              <label className="field">언어쌍<input defaultValue="한국어 > 영어" /></label>
              <label className="field">배점<input defaultValue={selected.score} /></label>
              <label className="field full">지문<textarea defaultValue={`${type} 지문을 입력합니다. 첨부 파일 설명과 응시자 안내를 포함합니다.`} /></label>
              <label className="field full">문제<textarea defaultValue={selected.title} /></label>
              <label className="field">정답/예시<textarea defaultValue="모범 답안 또는 허용 정답을 입력합니다." /></label>
              <label className="field">해설/평가기준<textarea defaultValue="정확성 40, 용어 30, 문체 20, 제출형식 10" /></label>
            </div>
            <div className="actions">
              <button className="btn" onClick={() => { setPreview(true); log("미리보기 생성"); }}>미리보기</button>
              <button className="btn" onClick={() => updateStatus("임시저장")}>임시저장</button>
              <button className="btn primary" onClick={() => updateStatus("검수중")}>최종 제출</button>
              <button className="btn danger" onClick={() => updateStatus("반려")}>반려 표시</button>
              <button className="btn good" id="revision" onClick={() => updateStatus("검수중")}>반려 문항 재제출</button>
            </div>
          </div>

          <aside className="panel">
            <h2>문항 미리보기</h2>
            {preview ? (
              <div className="grid">
                <strong>{selected.title}</strong>
                <p className="muted">{type} / {selected.exam} / {selected.score}점</p>
                <label className="field full">수험생 답안<textarea defaultValue="수험생이 보게 될 답안 입력 영역입니다." /></label>
              </div>
            ) : <p className="muted">미리보기를 누르면 실제 수험생 화면 형태로 확인됩니다.</p>}
          </aside>
        </section>
        <ActionLog logs={logs} />
      </div>
    </AppShell>
  );
}
