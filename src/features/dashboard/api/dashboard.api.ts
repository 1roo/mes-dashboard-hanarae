import { instance } from "../../../shared/axios/axios";
import type {
  DashboardSummary,
  EquipmentData,
  HourlyProductionData,
} from "../type";

export const dashboardApi = {
  summary: async (): Promise<DashboardSummary[]> => {
    const res = await instance.get<DashboardSummary[]>("/dashboardSummary");
    return res.data;
  },

  hourly: async (): Promise<HourlyProductionData[]> => {
    const res = await instance.get<HourlyProductionData[]>("/hourlyProduction");
    return res.data;
  },

  equipment: async (): Promise<EquipmentData[]> => {
    const res = await instance.get<EquipmentData[]>("/equipment");
    return res.data;
  },
};
