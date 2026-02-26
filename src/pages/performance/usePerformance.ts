import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { instance } from "../../shared/axios/axios";
import type { Performance, User } from "./types";

export const usePerformance = () => {
  const [rows, setRows] = useState<Performance[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

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

  return {
    rows,
    loading,
    fetchResults,
    nameByEmployeeId,
  };
};
