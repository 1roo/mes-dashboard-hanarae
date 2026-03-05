// src/features/pop/enterPerform/components/EnterPerformPage.tsx

import Spinner from "../../../../shared/ui/Spinner";
import { useEnterPerform } from "../hooks/useEnterPerform";
import PerformForm from "./PerformForm";
import History from "./History";
import { todayYmd } from "../lib/date";
import { useSelectedWorkOrder } from "../hooks/useSelectedWorkOrder";
import { useSubmitProductionResult } from "../hooks/useSubmitProductionResult";
import type { PerformFormPayload } from "../hooks/usePerformForm";

const EnterPerformPage = () => {
  const {
    user,
    workOrders,
    loading,
    productionResults,
    operatorId,
    operatorName,
    ymd,
  } = useEnterPerform();

  const { setSelectedId, filteredWorkOrders, selectedWorkOrder } =
    useSelectedWorkOrder(workOrders);

  const submitter = useSubmitProductionResult({
    operatorId,
    operatorName,
    ymd,
    getSelectedWorkOrder: () => selectedWorkOrder,
  });

  const handleSubmit = async (form: PerformFormPayload) => {
    await submitter.submit(form);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <article className="flex items-center mb-4 bg-white p-3 rounded-md shadow-sm">
        <div className="border-r border-gray-300 px-5">
          <span className="text-sm text-gray-500">담당 라인</span>
          <p className="text-lg font-bold text-blue-500">
            {selectedWorkOrder?.assignedLine ?? ""}
          </p>
        </div>

        <div className="border-r border-gray-300 px-5">
          <span className="text-sm text-gray-500">작업자</span>
          <p className="text-lg font-bold text-blue-700">{user?.name ?? ""}</p>
        </div>

        <div className="border-r border-gray-300 px-5">
          <span className="text-sm text-gray-500">날짜</span>
          <p className="text-lg font-bold text-gray-500">{todayYmd()}</p>
        </div>

        <div className="flex flex-col px-5">
          <span className="text-sm text-gray-500">작업지시선택</span>

          <select
            className="w-64 border border-gray-500 rounded-md"
            value={selectedWorkOrder?.id ?? ""}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={filteredWorkOrders.length === 0}
          >
            {filteredWorkOrders.length === 0 ? (
              <option value="">작업지시가 없습니다</option>
            ) : (
              filteredWorkOrders.map((wo) => (
                <option key={wo.id} value={wo.id}>
                  {wo.id}-{wo.productName}
                </option>
              ))
            )}
          </select>
        </div>
      </article>

      <article className="flex justify-between items-center mb-4 bg-blue-300/30 border border-blue-300 p-3 rounded-md shadow-sm">
        <div className="w-full flex justify-between">
          <div className="flex items-center gap-6">
            <div className="rounded-md text-blue-600 bg-blue-300/30 px-2 py-1">
              <p className="font-bold">{selectedWorkOrder?.id}</p>
            </div>

            <div>
              <p className="font-extrabold text-xl text-blue-700">
                {selectedWorkOrder?.productName}
              </p>

              <div className="flex justify-center items-center text-sm">
                <span>{selectedWorkOrder?.assignedLine}</span>
                <div className="rounded-full w-1 h-1 bg-gray-400 mx-1" />
                <span>마감 {selectedWorkOrder?.startDate}</span>
                <div className="rounded-full w-1 h-1 bg-gray-400 mx-1" />
                <span>
                  {selectedWorkOrder?.status === "COMPLETED"
                    ? "완료"
                    : selectedWorkOrder?.status === "IN_PROGRESS"
                      ? "진행중"
                      : "대기"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-end">
            <div>
              <span className="text-xs text-gray-600">계획</span>
              <p className="font-bold text-xl text-violet-400 text-center">
                {selectedWorkOrder?.plannedQty?.toLocaleString?.() ??
                  selectedWorkOrder?.plannedQty}
              </p>
            </div>

            <div className="mx-5">
              <span className="text-xs text-gray-600">완료</span>
              <p className="font-bold text-xl text-yellow-500 text-center">
                {selectedWorkOrder?.completedQty?.toLocaleString?.() ??
                  selectedWorkOrder?.completedQty}
              </p>
            </div>

            <div className="mr-5">
              <span className="text-xs text-gray-600">잔여</span>
              <p className="font-bold text-xl text-gray-400 text-center">
                {selectedWorkOrder
                  ? (
                      selectedWorkOrder.plannedQty -
                      selectedWorkOrder.completedQty
                    ).toLocaleString()
                  : "0"}
              </p>
            </div>

            <div>
              <span className="text-xs text-gray-600">진행률</span>
              <p className="font-bold text-xl text-orange-400 text-center">
                {selectedWorkOrder && selectedWorkOrder.plannedQty > 0
                  ? Math.round(
                      (selectedWorkOrder.completedQty /
                        selectedWorkOrder.plannedQty) *
                        100,
                    ) + "%"
                  : "0%"}
              </p>
            </div>
          </div>
        </div>
      </article>

      <article className="flex justify-between">
        <div className="w-1/2 bg-white p-3 rounded-md shadow-sm mr-2">
          <PerformForm onSubmit={handleSubmit} />
        </div>

        <div className="w-1/2 bg-white p-3 rounded-md shadow-sm ml-2">
          <History productionResults={productionResults} />
        </div>
      </article>
    </div>
  );
};

export default EnterPerformPage;
