import { instance } from "../../../shared/axios/axios";
import type { WorkOrder } from "../types";

export const workOrdersApi = {
  list: async (): Promise<WorkOrder[]> => {
    const res = await instance.get<WorkOrder[]>("/workOrders");
    return res.data;
  },
  create: async (payload: WorkOrder): Promise<WorkOrder> => {
    const res = await instance.post<WorkOrder>("/workOrders", payload);
    return res.data;
  },
  bulkCreate: async (payloads: WorkOrder[]): Promise<WorkOrder[]> => {
    const res = await instance.post<WorkOrder[]>("/workOrders", payloads);
    return res.data;
  },
};
