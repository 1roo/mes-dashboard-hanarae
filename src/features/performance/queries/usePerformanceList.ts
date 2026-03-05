import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { performanceApi } from "../api/performance.api";
import { performanceKeys } from "../api/performance.key";

export const usePerformanceList = () => {
  const perfQ = useQuery({
    queryKey: performanceKeys.list(),
    queryFn: performanceApi.list,
  });

  const usersQ = useQuery({
    queryKey: performanceKeys.users(),
    queryFn: performanceApi.users,
  });

  const rows = perfQ.data ?? [];
  const users = usersQ.data ?? [];

  const nameByEmployeeId = useMemo(() => {
    const m = new Map<string, string>();
    for (const u of usersQ.data ?? []) {
      m.set(u.employeeId, u.name);
    }
    return m;
  }, [usersQ.data]);

  const loading = perfQ.isLoading || usersQ.isLoading;
  const error = perfQ.error || usersQ.error;

  return {
    rows,
    users,
    nameByEmployeeId,
    loading,
    error,
    refetch: () => {
      perfQ.refetch();
      usersQ.refetch();
    },
  };
};
