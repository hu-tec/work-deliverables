export function filterRows(rows, { query = "", status = "all" } = {}) {
  const normalizedQuery = query.trim().toLowerCase();
  return rows.filter((row) => {
    const matchesQuery =
      !normalizedQuery ||
      Object.values(row).some((value) => String(value).toLowerCase().includes(normalizedQuery));
    const matchesStatus = status === "all" || row.status === status;
    return matchesQuery && matchesStatus;
  });
}

export function paginateRows(rows, page = 1, pageSize = 10) {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export function toggleSelection(selectedIds, id) {
  const next = new Set(selectedIds);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return Array.from(next);
}
