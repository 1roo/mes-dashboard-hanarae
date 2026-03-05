export type LineValue = "라인 A" | "라인 B" | "라인 C" | "라인 D";

export type Status = "IN_PROGRESS" | "PENDING" | "COMPLETED";

export type WorkOrder = {
  id: string;
  productName: string;
  assignedLine: string;
  status: Status;

  plannedQty: number;
  completedQty: number;
  defectQty: number;

  startDate?: string;
};

export type LineMetrics = {
  plannedTotal: number;
  completedTotal: number;
  achievementRate: number;
  defectRate: number;
  defectTotal: number;
};

export type HourlyRow = {
  id: number;
  hour: string;
  planned: number;
  actual: number;
};

export type HourlyProduction = {
  hourlyProduction: HourlyRow[];
};

export type Equipment = {
  id: number;
  equipmentCode: string;
  equipmentName: string;
  line: "라인 A" | "라인 B" | "라인 C" | "라인 D";
  status: "RUNNING" | "MAINTENANCE" | "STOPPED";
  operationRate: number;
};
