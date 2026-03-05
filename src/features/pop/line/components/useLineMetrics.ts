import { useMemo } from "react";
import type { WorkOrder, LineMetrics, LineValue } from "../type";

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

type Params = {
  rows: WorkOrder[];
  selectedLine: LineValue;
};

export const useLineMetrics = ({ rows, selectedLine }: Params) => {
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
    () => sum(lineRows.map((r) => r.defectQty)),
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

  const metrics: LineMetrics = useMemo(
    () => ({
      plannedTotal,
      completedTotal,
      achievementRate,
      defectRate,
      defectTotal,
    }),
    [plannedTotal, completedTotal, achievementRate, defectRate, defectTotal],
  );

  return { lineRows, metrics };
};
