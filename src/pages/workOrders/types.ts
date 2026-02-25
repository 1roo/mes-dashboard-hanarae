export type Status = "COMPLETED" | "IN_PROGRESS" | "PENDING";

export type WorkOrder = {
  id: string;
  productName: string;
  plannedQty: number;
  completedQty: number;
  status: Status;
  assignedLine: string;
  startDate: string;
  dueDate: string;
};

export type NewWorkOrderForm = {
  id: string;
  productName: string;
  plannedQty: string;
  startDate: string;
};
