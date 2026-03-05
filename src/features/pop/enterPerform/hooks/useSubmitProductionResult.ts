import toast from "react-hot-toast";
import { instance } from "../../../../shared/axios/axios";
import type { WorkOrder } from "../../../workOrders/types";
import type { ProductionResultPayload } from "../type";
import { useQueryClient } from "@tanstack/react-query";
import { enterPerformKeys } from "../enterperform.key";

export const useSubmitProductionResult = (opts: {
  operatorId: string;
  operatorName: string;
  ymd: string;
  getSelectedWorkOrder: () => WorkOrder | null;
}) => {
  const qc = useQueryClient();

  const submit = async (
    form: Omit<
      ProductionResultPayload,
      "workOrderId" | "productName" | "operatorId"
    >,
  ) => {
    const selectedWorkOrder = opts.getSelectedWorkOrder();
    if (!selectedWorkOrder) {
      toast.error("작업지시를 선택해주세요.");
      return;
    }
    if (!opts.operatorId) {
      toast.error("로그인 정보를 확인할 수 없습니다.");
      return;
    }

    const payload: ProductionResultPayload = {
      workOrderId: selectedWorkOrder.id,
      productName: selectedWorkOrder.productName,
      operatorId: opts.operatorId,
      ...form,
    };

    try {
      toast.loading("등록 중...", { id: "productionResult" });
      await instance.post("/productionResults", payload);

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
    } catch (e) {
      console.error(e);
      toast.error("등록 실패", { id: "productionResult" });
    }
  };

  return { submit };
};
