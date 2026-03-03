import { useMemo, useState } from "react";
import Spinner from "../../../shared/ui/Spinner";
import { useEnterPerform } from "./useEnterPerform";
import PerformForm, { type ProductionResultPayload } from "./PerformForm";
import { instance } from "../../../shared/axios/axios";
import toast from "react-hot-toast";
import History from "./History";

const today = () => new Date().toISOString().slice(0, 10);

const getOperatorIdFromSession = () => {
  const stored = sessionStorage.getItem("auth_user");
  if (!stored) return "";
  try {
    const authUser = JSON.parse(stored);
    return String(authUser.employeeId ?? "").trim();
  } catch {
    return "";
  }
};

type FormSubmitPayload = Omit<
  ProductionResultPayload,
  "workOrderId" | "productName" | "operatorId"
>;

const EnterPerformPage = () => {
  const { user, workOrders, loading } = useEnterPerform();
  const [selectedId, setSelectedId] = useState<string>("");

  const myLine = useMemo(() => workOrders[0]?.assignedLine ?? "", [workOrders]);

  const filteredWorkOrders = useMemo(() => {
    if (!myLine) return workOrders;
    return workOrders.filter((wo) => wo.assignedLine === myLine);
  }, [workOrders, myLine]);

  const selectedWorkOrder = useMemo(() => {
    const id = selectedId || filteredWorkOrders[0]?.id || "";
    return filteredWorkOrders.find((w) => w.id === id) || null;
  }, [selectedId, filteredWorkOrders]);

  const handleSubmit = async (form: FormSubmitPayload) => {
    if (!selectedWorkOrder) {
      toast.error("작업지시를 선택해주세요.");
      return;
    }

    const operatorId = getOperatorIdFromSession();
    if (!operatorId) {
      toast.error("로그인 정보를 확인할 수 없습니다.");
      return;
    }

    const payload: ProductionResultPayload = {
      workOrderId: selectedWorkOrder.id,
      productName: selectedWorkOrder.productName,
      producedQty: form.producedQty,
      defectQty: form.defectQty,
      startTime: form.startTime,
      endTime: form.endTime,
      operatorId,
      note: form.note ?? "",
    };

    try {
      toast.loading("등록 중...", { id: "productionResult" });
      await instance.post("/productionResults", payload);

      const woRes = await instance.get("/workOrders", {
        params: { operatorName: user?.name },
      });

      toast.success("등록 완료", { id: "productionResult" });

      console.log("최신 작업지시:", woRes.data);
    } catch (e) {
      console.error(e);
      toast.error("등록 실패", { id: "productionResult" });
    }
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
          <p className="text-lg font-bold text-gray-500">{today()}</p>
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
              <p className="font-bold text-xl text-violet-400">
                {selectedWorkOrder?.plannedQty?.toLocaleString?.() ??
                  selectedWorkOrder?.plannedQty}
              </p>
            </div>

            <div className="mx-5">
              <span className="text-xs text-gray-600">완료</span>
              <p className="font-bold text-xl text-yellow-500">
                {selectedWorkOrder?.completedQty?.toLocaleString?.() ??
                  selectedWorkOrder?.completedQty}
              </p>
            </div>

            <div className="mr-5">
              <span className="text-xs text-gray-600">잔여</span>
              <p className="font-bold text-xl text-gray-400">
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
              <p className="font-bold text-xl text-orange-400">
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
          <History />
        </div>
      </article>
    </div>
  );
};

export default EnterPerformPage;
