import { useMemo } from "react";
import type { ProductionResult } from "../type";

export const useTodayProductionResults = (
  productionResults: ProductionResult[],
  employeeId?: string,
) => {
  return useMemo(() => {
    if (!employeeId) return [];

    const today = new Date().toISOString().slice(0, 10);

    return productionResults.filter((r) => {
      const operatorMatch =
        String(r.operatorId ?? "").trim() === String(employeeId).trim();

      const dateMatch = String(r.createdAt ?? "").slice(0, 10) === today;

      return operatorMatch && dateMatch;
    });
  }, [productionResults, employeeId]);
};
