import { useMemo, useState } from "react";

export function useReversePagination<T>(rows: T[], pageSize: number) {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(rows.length / pageSize)),
    [rows.length, pageSize],
  );

  const safePage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    const total = rows.length;
    const end = total - (safePage - 1) * pageSize;
    const start = Math.max(0, end - pageSize);
    return rows.slice(start, end);
  }, [rows, safePage, pageSize]);

  return { page: safePage, setPage, totalPages, pagedRows };
}
