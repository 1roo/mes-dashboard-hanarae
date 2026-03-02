import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { instance } from "../../../shared/axios/axios";
import type { WorkOrder } from "./type";

export const LINES = [
  { label: "라인A", value: "라인 A" },
  { label: "라인B", value: "라인 B" },
  { label: "라인C", value: "라인 C" },
  { label: "라인D", value: "라인 D" },
] as const;

type LineValue = (typeof LINES)[number]["value"];

type Params = {
  refreshKey: number;
  onRefreshed: () => void;
  defaultLine?: LineValue;
};

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const useLine = ({
  refreshKey,
  onRefreshed,
  defaultLine = "라인 A",
}: Params) => {
  const [selectedLine, setSelectedLine] = useState<LineValue>(defaultLine);
  const [rows, setRows] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await instance.get<WorkOrder[]>("/workOrders");
        const data = res.data;
        setRows(Array.isArray(data) ? data : []);
        onRefreshed();
      } catch (error) {
        toast.error("데이터를 불러오지 못했습니다.");
        console.error("Failed to fetch workOrders", error);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [refreshKey, onRefreshed]);

  const lineRows = useMemo(
    () => rows.filter((r) => r.assignedLine === selectedLine),
    [rows, selectedLine],
  );

  const plannedTotal = useMemo(
    () => sum(lineRows.map((r) => Number(r.plannedQty ?? 0))),
    [lineRows],
  );

  const completedTotal = useMemo(
    () => sum(lineRows.map((r) => Number(r.completedQty ?? 0))),
    [lineRows],
  );

  const defectTotal = useMemo(
    () => sum(lineRows.map((r) => Number(r.defectQty ?? 0))),
    [lineRows],
  );

  const achievementRate = useMemo(() => {
    if (plannedTotal <= 0) return 0;
    return (completedTotal / plannedTotal) * 100;
  }, [plannedTotal, completedTotal]);

  const defectRate = useMemo(() => {
    if (completedTotal <= 0) return 0;
    return (defectTotal / completedTotal) * 100;
  }, [defectTotal, completedTotal]);

  const achievementWidth = Math.min(achievementRate, 100);

  return {
    selectedLine,
    setSelectedLine,
    rows,
    lineRows,
    loading,
    metrics: {
      plannedTotal,
      completedTotal,
      defectTotal,
      achievementRate,
      defectRate,
      achievementWidth,
    },
  };
};
