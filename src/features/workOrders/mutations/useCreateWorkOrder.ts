import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { WorkOrder } from "../types";
import { workOrdersApi } from "../api/workOrders.api";
import { workOrdersKeys } from "../api/workOrders.key";

export const useCreateWorkOrder = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: WorkOrder) => workOrdersApi.create(payload),
    onSuccess: () => {
      toast.success("저장되었습니다.");
      qc.invalidateQueries({ queryKey: workOrdersKeys.list() });
    },
    onError: () => {
      toast.error("저장에 실패했습니다.");
    },
  });
};
