import { useEffect, useState } from "react";
import { instance } from "../../shared/axios/axios";
import type {
  DashboardSummary,
  EquipmentData,
  HourlyProductionData,
} from "./type";

export const useDashBoard = () => {
  const [summaryData, setSummaryData] = useState<DashboardSummary[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyProductionData[]>([]);
  const [equipData, setEquipData] = useState<EquipmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [resSum, resHourly, resEquip] = await Promise.all([
          instance.get<DashboardSummary[]>("/dashboardSummary"),
          instance.get<HourlyProductionData[]>("/hourlyProduction"),
          instance.get<EquipmentData[]>("/equipment"),
        ]);

        if (!mounted) return;

        setSummaryData(resSum.data);
        setHourlyData(resHourly.data);
        setEquipData(resEquip.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const summary = summaryData[0];

  return {
    summary,
    summaryData,
    hourlyData,
    equipData,
    loading,
  };
};
