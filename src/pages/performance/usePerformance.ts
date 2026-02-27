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
      setUsers(resUsers.data);
    } catch (e) {
      toast.error("조회 실패");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const onUploadExcel = async (data: Partial<Performance>[]) => {
    setLoading(true);
    try {
      const promises = data.map((item) => {
        const payload = {
          ...item,
          id: crypto.randomUUID(),
          endTime: item.startTime || new Date().toISOString(),
        };
        return instance.post<Performance>("/productionResults", payload);
      });

      const results = await Promise.all(promises);
      setRows((prev) => [...prev, ...results.map((r) => r.data)]);
      toast.success(`${results.length}건 업로드 성공`);
    } catch (e) {
      toast.error("업로드 중 오류 발생");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const nameByEmployeeId = useMemo(() => {
    const m = new Map<string, string>();
    for (const u of users) m.set(u.employeeId, u.name);
    return m;
  }, [users]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(rows.length / PAGE_SIZE)),
    [rows.length],
  );
  const pagedRows = useMemo(() => {
    const total = rows.length;
    const end = total - (page - 1) * PAGE_SIZE;
    const start = Math.max(0, end - PAGE_SIZE);
    return rows.slice(start, end);
  }, [rows, page]);

  return {
    rows,
    loading,
    fetchResults,
    nameByEmployeeId,
    page,
    setPage,
    totalPages,
    pagedRows,
    onUploadExcel,
  };
};
