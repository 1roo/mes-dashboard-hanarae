import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { WorkOrder } from "../types";
import { workOrdersApi } from "../api/workOrders.api";
import { workOrdersKeys } from "../api/workOrders.key";

export const useUploadWorkOrdersExcel = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payloads: WorkOrder[]) => {
      let successCount = 0;

      await Promise.all(
        payloads.map(async (p) => {
          await workOrdersApi.create(p);
          successCount += 1;
        }),
      );

      return successCount;
    },
    onSuccess: (successCount) => {
      toast.success(`${successCount}건 업로드 완료`);
      qc.invalidateQueries({ queryKey: workOrdersKeys.list() });
    },
    onError: () => {
      toast.error("업로드 중 오류 발생");
    },
  });
};
