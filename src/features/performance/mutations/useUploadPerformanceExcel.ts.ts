import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Performance } from "../types";
import { performanceApi } from "../api/performance.api";
import { performanceKeys } from "../api/performance.key";

export const useUploadPerformanceExcel = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Performance>[]) => {
      const promises = data.map(async (item) => {
        const payload: Performance = {
          ...(item as Performance),
          id: crypto.randomUUID(),
          endTime: item.startTime || new Date().toISOString(),
        };
        return performanceApi.create(payload);
      });

      return Promise.all(promises);
    },

    onSuccess: (created) => {
      toast.success(`${created.length}건 업로드 성공`);
      qc.invalidateQueries({ queryKey: performanceKeys.list() });
    },

    onError: () => {
      toast.error("업로드 중 오류 발생");
    },
  });
};
