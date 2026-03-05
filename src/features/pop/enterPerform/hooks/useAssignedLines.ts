import { useMemo } from "react";
import type { WorkOrder } from "../../../workOrders/types";

export const useAssignedLines = (workOrders: WorkOrder[]) => {
  const assignedLines = useMemo(() => {
    const set = new Set<string>();

    workOrders.forEach((w) => {
      const line = w.assignedLine == null ? "" : String(w.assignedLine).trim();
      if (line) set.add(line);
    });

    return Array.from(set);
  }, [workOrders]);

  const assignedLine = assignedLines[0] ?? "";

  return { assignedLines, assignedLine };
};
