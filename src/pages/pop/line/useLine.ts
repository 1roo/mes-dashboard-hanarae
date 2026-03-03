import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { instance } from "../../../shared/axios/axios";
import type {
  WorkOrder,
  LineMetrics,
  LineValue,
  HourlyRow,
  Equipment,
} from "./type";

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

type Params = {
  refreshKey: number;
  onRefreshed: () => void;
  selectedLine: LineValue;
};

export const useLine = ({ refreshKey, onRefreshed, selectedLine }: Params) => {
  const [rows, setRows] = useState<WorkOrder[]>([]);
  const [hourlyProduction, setHourlyProduction] = useState<HourlyRow[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [woRes, hpRes, eqRes] = await Promise.all([
          instance.get<WorkOrder[]>("/workOrders"),
          instance.get<HourlyRow[]>("/hourlyProduction"),
          instance.get<Equipment[]>("/equipment"),
        ]);

        setRows(Array.isArray(woRes.data) ? woRes.data : []);
        setHourlyProduction(Array.isArray(hpRes.data) ? hpRes.data : []);
        setEquipment(Array.isArray(eqRes.data) ? eqRes.data : []);

        onRefreshed();
      } catch (error) {
        toast.error("데이터를 불러오지 못했습니다.");
        console.error(error);
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

  return {
    loading,
    metrics,
    lineRows,
    hourlyProduction,
    equipment,
  };
};
