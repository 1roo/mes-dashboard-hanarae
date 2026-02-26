import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { instance } from "../../shared/axios/axios";
import type { Performance, User } from "./types";
import { PAGE_SIZE } from "../workOrders/constants";

export const usePerformance = () => {
  const [rows, setRows] = useState<Performance[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const [resPerf, resUsers] = await Promise.all([
        instance.get<Performance[]>("/productionResults"),
        instance.get<User[]>("/users"),
      ]);

      setRows(resPerf.data);
      setPage(1);
      setUsers(resUsers.data);
    } catch (e) {
      toast.error("조회에 실패했습니다.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const nameByEmployeeId = useMemo(() => {
    const m = new Map<string, string>();
    for (const u of users) m.set(u.employeeId, u.name);
    return m;
  }, [users]);

  const totalPages = useMemo(() => {
    const n = Math.ceil(rows.length / PAGE_SIZE);
    return n === 0 ? 1 : n;
  }, [rows.length]);

  const pagedRows = useMemo(() => {
    const total = rows.length;
    const end = total - (page - 1) * PAGE_SIZE;
    const start = Math.max(0, end - PAGE_SIZE);
    return rows.slice(start, end);
  }, [rows, page]);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  return {
    rows,
    loading,
    fetchResults,
    nameByEmployeeId,

    // paging
    page,
    setPage,
    totalPages,
    pagedRows,
  };
};
