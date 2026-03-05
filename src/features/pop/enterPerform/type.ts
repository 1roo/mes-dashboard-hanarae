export type WorkStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type ProductionResult = {
  id: string;
  workOrderId: string;
  productName: string;
  producedQty: number;
  defectQty: number;
  startTime: string;
  endTime: string;
  operatorId: string;
  note: string;
  status?: WorkStatus;
  createdAt: string;
};

export type ProductionResultPayload = {
  workOrderId: string;
  productName: string;
  producedQty: number;
  defectQty: number;
  startTime: string;
  endTime: string;
  operatorId: string;
  note: string;
  createdAt: string;
  status: WorkStatus;
};
