import { useMemo, useState } from "react";
import type { Status, WorkOrder } from "../types";

export const useWorkOrderFilters = (rows: WorkOrder[]) => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"" | Status>("");

  const filteredRows = useMemo(() => {
    const q = keyword.trim();
    return rows.filter(
      (r) =>
        (!q || r.productName.includes(q)) && (!status || r.status === status),
    );
  }, [rows, keyword, status]);

  return { keyword, setKeyword, status, setStatus, filteredRows };
};
