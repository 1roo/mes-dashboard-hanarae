// src/features/pop/enterPerform/hooks/useEnterPerform.ts
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { instance } from "../../../../shared/axios/axios";
import type { User } from "../../../../shared/types";
import type { WorkOrder } from "../../../workOrders/types";
import type { ProductionResult } from "../../enterPerform/type";
import { enterPerformKeys } from "../enterperform.key";
import { todayYmd } from "../lib/date";

const AUTH_KEY = "auth_user";

const readOperatorIdFromSession = () => {
  const stored = sessionStorage.getItem(AUTH_KEY);
  if (!stored) return "";
  try {
    const authUser = JSON.parse(stored);
    return String(authUser.employeeId ?? "").trim();
  } catch {
    return "";
  }
};

export const useEnterPerform = () => {
  const operatorId = useMemo(() => readOperatorIdFromSession(), []);
  const ymd = useMemo(() => todayYmd(), []);

  const userQ = useQuery({
    queryKey: enterPerformKeys.me(),
    enabled: !!operatorId,
    queryFn: async () => {
      const res = await instance.get<User[]>("/users", {
        params: { employeeId: operatorId },
      });
      return res.data?.[0] ?? null;
    },
  });

  const operatorName = userQ.data?.name ?? "";

  const workOrdersQ = useQuery({
    queryKey: enterPerformKeys.workOrdersByOperator(operatorName),
    enabled: !!operatorName,
    queryFn: async () => {
      const res = await instance.get<WorkOrder[]>("/workOrders", {
        params: { operatorName },
      });
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const todayResultsQ = useQuery({
    queryKey: enterPerformKeys.todayResultsByOperator(operatorId, ymd),
    enabled: !!operatorId && !!ymd,
    queryFn: async () => {
      const res = await instance.get<ProductionResult[]>("/productionResults");
      const all = Array.isArray(res.data) ? res.data : [];
      return all.filter((r) => {
        const opMatch = String(r.operatorId ?? "").trim() === operatorId;
        const dateMatch = String(r.createdAt ?? "").slice(0, 10) === ymd;
        return opMatch && dateMatch;
      });
    },
  });

  const workOrders = useMemo<WorkOrder[]>(
    () => workOrdersQ.data ?? [],
    [workOrdersQ.data],
  );

  const assignedLines = useMemo(() => {
    const set = new Set<string>();
    workOrders.forEach((w) => {
      const line = String(w.assignedLine ?? "").trim();
      if (line) set.add(line);
    });
    return Array.from(set);
  }, [workOrders]);

  const loading =
    userQ.isLoading || workOrdersQ.isLoading || todayResultsQ.isLoading;

  return {
    user: userQ.data,
    workOrders,
    assignedLines,
    assignedLine: assignedLines[0] ?? "",
    productionResults: todayResultsQ.data ?? [],
    loading,

    operatorId,
    operatorName,
    ymd,

    refetch: async () => {
      await Promise.all([
        userQ.refetch(),
        workOrdersQ.refetch(),
        todayResultsQ.refetch(),
      ]);
    },
  };
};
