export type Performance = {
  id: string;
  workOrderId: string;
  productName: string;
  producedQty: number;
  defectQty: number;
  startTime: string;
  endTime: string;
  operatorId: string;
  note: string;
};

export type User = {
  id: number;
  employeeId: string;
  name: string;
};
