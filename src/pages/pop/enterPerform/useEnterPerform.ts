import { useEffect, useMemo, useState } from "react";
import { instance } from "../../../shared/axios/axios";
import type { User } from "../../../shared/types";
import type { WorkOrder } from "../../workOrders/types";
import type { ProductionResult } from "./type";

export const useEnterPerform = () => {
  const [user, setUser] = useState<User | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [productionResults, setProductionResults] = useState<
    ProductionResult[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const stored = sessionStorage.getItem("auth_user");
        if (!stored) return;

        const authUser = JSON.parse(stored);
        const employeeId = String(authUser.employeeId ?? "").trim();

        const userRes = await instance.get<User[]>("/users", {
          params: { employeeId },
        });

        const fetchedUser = userRes.data?.[0] ?? null;
        setUser(fetchedUser);

        const [woRes, prRes] = await Promise.all([
          instance.get<WorkOrder[]>("/workOrders", {
            params: { operatorName: fetchedUser?.name },
          }),
          instance.get<ProductionResult[]>("/productionResults"),
        ]);

        setWorkOrders(woRes.data ?? []);
        setProductionResults(prRes.data ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const assignedLines = useMemo(() => {
    const set = new Set<string>();
    workOrders.forEach((w) => {
      const line = w.assignedLine == null ? "" : String(w.assignedLine).trim();
      if (line) set.add(line);
    });
    return Array.from(set);
  }, [workOrders]);

  const assignedLine = assignedLines[0] ?? "";

  const todayResults = useMemo(() => {
    if (!user?.employeeId) return [];

    const today = new Date().toISOString().slice(0, 10);

    return productionResults.filter((r) => {
      const operatorMatch =
        String(r.operatorId ?? "").trim() === String(user.employeeId).trim();

      const dateMatch = String(r.createdAt ?? "").slice(0, 10) === today;

      return operatorMatch && dateMatch;
    });
  }, [productionResults, user?.employeeId]);

  return {
    user,
    workOrders,
    assignedLine,
    assignedLines,
    productionResults: todayResults,
    loading,
  };
};
