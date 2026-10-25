import { StatusBadge } from "./StatusBadge";

export type Column<T> = {
  key: keyof T | "select" | "actions";
  label: string;
  render?: (row: T) => React.ReactNode;
};

export function DataTable<T extends { id: string; status?: string }>({
  columns,
  rows,
  selectedIds = []
}: {
  columns: Column<T>[];
  rows: T[];
  selectedIds?: string[];
}) {
  return (
    <div className="surface table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => {
                if (column.key === "select") {
                  return (
                    <td key="select">
                      <input aria-label={`${row.id} 선택`} checked={selectedIds.includes(row.id)} readOnly type="checkbox" />
                    </td>
                  );
                }
                if (column.render) {
                  return <td key={String(column.key)}>{column.render(row)}</td>;
                }
                const value = row[column.key as keyof T];
                return <td key={String(column.key)}>{column.key === "status" ? <StatusBadge status={String(value)} /> : String(value)}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button className="button button-outline">이전</button>
        <span>1 / 1</span>
        <button className="button button-outline">다음</button>
      </div>
    </div>
  );
}
