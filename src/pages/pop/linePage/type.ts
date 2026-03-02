export type WorkOrder = {
  id: string;
  productName: string;
  plannedQty: number;
  completedQty: number;
  defectQty?: number;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  assignedLine: string;
  startDate: string;
  dueDate: string;
};

export type LinePageProps = {
  refreshKey: number;
  onRefreshed: () => void;
};
