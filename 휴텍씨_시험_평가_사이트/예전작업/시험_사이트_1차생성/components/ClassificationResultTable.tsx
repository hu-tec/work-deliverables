"use client";

import { useMemo, useState } from "react";
import { applyInlineEdit, bulkSelectRows, type ClassificationRow } from "@/lib/classification-state";
import { ProcessingStatusBadge } from "@/components/ProcessingStatusBadge";

export function ClassificationResultTable({ rows: initialRows }: { rows: ClassificationRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const selectedCount = useMemo(() => rows.filter((row) => row.selected).length, [rows]);

  return (
    <section className="table-section" aria-label="전체 정보">
      <div className="table-actions">
        <strong>전체 정보</strong>
        <BulkSelectToolbar
          selectedCount={selectedCount}
          onSelectAll={() => setRows((current) => bulkSelectRows(current, true))}
          onClear={() => setRows((current) => bulkSelectRows(current, false))}
        />
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  aria-label="전체 선택"
                  type="checkbox"
                  checked={selectedCount === rows.length}
                  onChange={(event) => setRows((current) => bulkSelectRows(current, event.target.checked))}
                />
              </th>
              <th>번호</th>
              <th>회원 유형</th>
              <th>이름/나이/성별</th>
              <th>구분 결과</th>
              <th>시험 종목</th>
              <th>시험 상태</th>
              <th>검수 상태</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <input
                    aria-label={`${row.id} 선택`}
                    type="checkbox"
                    checked={row.selected}
                    onChange={(event) =>
                      setRows((current) =>
                        current.map((item) => (item.id === row.id ? { ...item, selected: event.target.checked } : item))
                      )
                    }
                  />
                </td>
                <td>{index + 1}</td>
                <td>{index % 3 === 0 ? "정식 회원" : "일반 회원"}</td>
                <td>
                  <InlineEditCell
                    value={row.member}
                    label={`${row.id} 회원명`}
                    onCommit={(value) => setRows((current) => applyInlineEdit(current, row.id, "member", value))}
                  />
                </td>
                <td>
                  <InlineEditCell
                    value={row.category}
                    label={`${row.id} 구분 결과`}
                    onCommit={(value) => setRows((current) => applyInlineEdit(current, row.id, "category", value))}
                  />
                </td>
                <td>번역 전문가 전문1급</td>
                <td>{index % 4 === 0 ? "미응시" : "시험 시작"}</td>
                <td>
                  <ProcessingStatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BulkSelectToolbar({
  selectedCount,
  onSelectAll,
  onClear
}: {
  selectedCount: number;
  onSelectAll: () => void;
  onClear: () => void;
}) {
  return (
    <div className="bulk-toolbar">
      <span>선택 {selectedCount}</span>
      <button className="outline-button" onClick={onSelectAll}>
        전체선택
      </button>
      <button className="outline-button" onClick={onClear}>
        선택해제
      </button>
      <button className="outline-button">선택항목삭제</button>
      <button className="outline-button">SMS전송</button>
    </div>
  );
}

function InlineEditCell({ value, label, onCommit }: { value: string; label: string; onCommit: (value: string) => void }) {
  const [draft, setDraft] = useState(value);

  return (
    <input
      aria-label={label}
      className="inline-input"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => onCommit(draft)}
    />
  );
}
