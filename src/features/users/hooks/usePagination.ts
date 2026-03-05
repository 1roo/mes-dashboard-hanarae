import { useMemo, useState } from "react";

export const usePagination = <T>(items: T[], pageSize: number) => {
  const [requestedPage, setRequestedPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize],
  );

  const page = Math.min(Math.max(requestedPage, 1), totalPages);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }, [items, page, pageSize]);

  return {
    page,
    setPage: setRequestedPage,
    totalPages,
    pagedItems,
  };
};
