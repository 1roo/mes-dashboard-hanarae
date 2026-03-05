import { useMemo, useState } from "react";

export const useReversePagination = <T>(items: T[], pageSize: number) => {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize],
  );

  const safePage = Math.min(Math.max(page, 1), totalPages);

  const pagedItems = useMemo(() => {
    const total = items.length;
    const end = total - (safePage - 1) * pageSize;
    const start = Math.max(0, end - pageSize);
    return items.slice(start, end);
  }, [items, safePage, pageSize]);

  return {
    page: safePage,
    setPage,
    totalPages,
    pagedItems,
  };
};
