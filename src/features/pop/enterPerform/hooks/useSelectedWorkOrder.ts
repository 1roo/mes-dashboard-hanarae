import { useMemo, useState } from "react";
import type { WorkOrder } from "../../../workOrders/types";

export const useSelectedWorkOrder = (workOrders: WorkOrder[]) => {
  const [selectedId, setSelectedId] = useState<string>("");

  const myLine = useMemo(() => workOrders[0]?.assignedLine ?? "", [workOrders]);

  const filteredWorkOrders = useMemo(() => {
    if (!myLine) return workOrders;
    return workOrders.filter((wo) => wo.assignedLine === myLine);
  }, [workOrders, myLine]);

  const selectedWorkOrder = useMemo(() => {
    const id = selectedId || filteredWorkOrders[0]?.id || "";
    return filteredWorkOrders.find((w) => w.id === id) || null;
  }, [selectedId, filteredWorkOrders]);

  return {
    selectedId,
    setSelectedId,
    myLine,
    filteredWorkOrders,
    selectedWorkOrder,
  };
};
