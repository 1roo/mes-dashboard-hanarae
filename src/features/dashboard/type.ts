export type DashboardSummary = {
  id: string;
  date: string;
  plannedQty: number;
  actualQty: number;
  achievementRate: number;
  defectRate: number;
  activeEquipment: number;
  totalEquipment: number;
};

export type HourlyProductionData = {
  id: string;
  hour: string;
  planned: number;
  actual: number;
};

export type EquipmentData = {
  id: string;
  equipmentCode: string;
  equipmentName: string;
  line: string;
  status: "RUNNING" | "MAINTENANCE" | "STOPPED";
  operationRate: number;
};
