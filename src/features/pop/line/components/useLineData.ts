import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { instance } from "../../../../shared/axios/axios";
import type { WorkOrder, HourlyRow, Equipment } from "../type";

type Params = {
  refreshKey: number;
  onRefreshed: () => void;
};

export const useLineData = ({ refreshKey, onRefreshed }: Params) => {
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

  return { loading, rows, hourlyProduction, equipment };
};
