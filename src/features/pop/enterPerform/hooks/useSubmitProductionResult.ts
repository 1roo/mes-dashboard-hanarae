import toast from "react-hot-toast";
import { instance } from "../../../../shared/axios/axios";
import type { WorkOrder } from "../../../workOrders/types";
import type { ProductionResultPayload } from "../type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enterPerformKeys } from "../enterperform.key";

export const useSubmitProductionResult = (opts: {
  operatorId: string;
  operatorName: string;
  ymd: string;
  getSelectedWorkOrder: () => WorkOrder | null;
}) => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (
      form: Omit<
        ProductionResultPayload,
        "workOrderId" | "productName" | "operatorId"
      >,
    ) => {
      const selectedWorkOrder = opts.getSelectedWorkOrder();
      if (!selectedWorkOrder) throw new Error("NO_WORKORDER");
      if (!opts.operatorId) throw new Error("NO_OPERATOR");

      const payload: ProductionResultPayload = {
        workOrderId: selectedWorkOrder.id,
        productName: selectedWorkOrder.productName,
        operatorId: opts.operatorId,
        ...form,
      };

      const res = await instance.post("/productionResults", payload);
      return res.data;
    },

    onMutate: () => {
      toast.loading("등록 중...", { id: "productionResult" });
    },

    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: enterPerformKeys.workOrdersByOperator(opts.operatorName),
        }),
        qc.invalidateQueries({
          queryKey: enterPerformKeys.todayResultsByOperator(
            opts.operatorId,
            opts.ymd,
          ),
        }),
      ]);

      toast.success("등록 완료", { id: "productionResult" });
    },

    onError: (e) => {
      console.error(e);
      const msg =
        e instanceof Error && e.message === "NO_WORKORDER"
          ? "작업지시를 선택해주세요."
          : e instanceof Error && e.message === "NO_OPERATOR"
            ? "로그인 정보를 확인할 수 없습니다."
            : "등록 실패";
      toast.error(msg, { id: "productionResult" });
    },
  });

  return {
    submit: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
