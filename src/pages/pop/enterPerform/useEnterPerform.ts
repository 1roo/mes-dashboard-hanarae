import { useEffect, useMemo, useState } from "react";
import { instance } from "../../../shared/axios/axios";
import type { User } from "../../../shared/types";
import type { WorkOrder } from "../../workOrders/types";

export const useEnterPerform = () => {
  const [user, setUser] = useState<User | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const stored = sessionStorage.getItem("auth_user");
        if (!stored) {
          setUser(null);
          setWorkOrders([]);
          return;
        }

        const authUser = JSON.parse(stored);
        const employeeId = String(authUser.employeeId ?? "").trim();

        if (!employeeId) {
          setUser(null);
          setWorkOrders([]);
          return;
        }

        const userRes = await instance.get<User[]>("/users", {
          params: { employeeId },
        });

        const fetchedUser = userRes.data?.[0] ?? null;
        setUser(fetchedUser);

        if (!fetchedUser?.name) {
          setWorkOrders([]);
          return;
        }

        const woRes = await instance.get<WorkOrder[]>("/workOrders", {
          params: { operatorName: fetchedUser.name },
        });

        setWorkOrders(woRes.data ?? []);
      } catch (error) {
        console.error("Failed to fetch user/workOrders", error);
        setUser(null);
        setWorkOrders([]);
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

  return { user, workOrders, assignedLine, assignedLines, loading };
};
