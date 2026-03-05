import toast from "react-hot-toast";

import AddWorkOrderForm from "../../workOrders/components/AddWorkOrderForm";
import WorkOrderTable from "./WorkOrderTable";

import { statusOptions, PAGE_SIZE } from "../constants";
import type { Status, WorkOrder } from "../types";

import { useAuth } from "../../../auth/useAuth";

import { useWorkOrdersList } from "../queries/useWorkOrdersList";
import { useWorkOrderFilters } from "../hooks/useWorkOrderFilters";
import { useReversePagination } from "../../../features/workOrders/hooks/useReversePagination";
import { useNewWorkOrderForm } from "../hooks/useNewWorkOrderForm";

import { workOrdersExcel } from "../excel/workOrdersExcel";
import { useCreateWorkOrder } from "../mutations/useCreateWorkOrder";
import { useUploadWorkOrdersExcel } from "../mutations/useUploadWorkOrdersExcel";
import { calcDueDate, validateNewForm } from "../lib/workOrders.logic";

const WorkOrdersPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const { rows, loading } = useWorkOrdersList();
  const { keyword, setKeyword, status, setStatus, filteredRows } =
    useWorkOrderFilters(rows);

  const {
    page,
    setPage,
    totalPages,
    pagedItems: pagedRows,
  } = useReversePagination(filteredRows, PAGE_SIZE);

  const form = useNewWorkOrderForm();

  const createWO = useCreateWorkOrder();
  const uploadExcelMut = useUploadWorkOrdersExcel();

  const isLoading = loading || createWO.isPending || uploadExcelMut.isPending;

  const onSaveNew = async () => {
    const msg = validateNewForm(form.newForm, rows);
    if (msg) {
      toast.error(msg);
      return;
    }

    const payload: WorkOrder = {
      id: form.newForm.id.trim(),
      productName: form.newForm.productName.trim(),
      plannedQty: Number(form.newForm.plannedQty),
      completedQty: 0,
      status: "PENDING",
      assignedLine: "",
      startDate: form.newForm.startDate,
      dueDate: calcDueDate(form.newForm.startDate, 3),
      operatorName: "",
    };

    await createWO.mutateAsync(payload);

    form.onCancelNew();
    form.reset?.(); // 너가 reset을 안 만들었으면 이 줄은 지워도 됨
    setPage(1); // "최신(뒤에서부터)" pagination에서 첫 페이지가 최신이라 유지
  };

  const onUploadExcel = async (raw: Partial<WorkOrder>[]) => {
    // 기존 onUploadExcel에서 하던 것처럼 "중복/필수 누락" 필터링
    const payloads: WorkOrder[] = [];

    for (const item of raw) {
      if (!item.id || !item.productName || !item.startDate) continue;
      if (rows.some((r) => r.id === item.id)) continue;

      payloads.push({
        id: String(item.id),
        productName: String(item.productName),
        plannedQty: Number(item.plannedQty) || 0,
        completedQty: 0,
        status: "PENDING",
        assignedLine: "",
        startDate: String(item.startDate),
        dueDate: calcDueDate(String(item.startDate)),
        operatorName: "",
      });
    }

    if (payloads.length === 0) {
      toast.error("업로드할 데이터가 없습니다.");
      return;
    }

    const task = uploadExcelMut.mutateAsync(payloads);

    toast.promise(task, {
      loading: "엑셀 업로드 중...",
      success: (count) => `${count}건 업로드 완료`,
      error: "업로드 중 오류 발생",
    });

    await task;

    setPage(1);
  };

  return (
    <div className="relative pb-24">
      <div className="bg-gray-200 h-16 p-3 flex justify-between items-center rounded-md mb-5">
        <span className="text-gray-900 font-bold text-2xl">작업 지시 목록</span>
      </div>

      <div className="grid grid-cols-10 gap-2 mb-3">
        <input
          type="text"
          placeholder="제품명 검색..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="col-span-6 border bg-gray-100 border-gray-300 p-2 rounded-sm"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "" | Status)}
          className="col-span-2 border bg-gray-100 border-gray-300 p-2 rounded-sm"
        >
          {statusOptions.map((o) => (
            <option key={o.label} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {isAdmin && (
          <button
            type="button"
            onClick={form.onClickAdd}
            className="col-span-2 p-2 bg-blue-600 text-white font-semibold rounded-sm hover:bg-blue-700"
          >
            + 행추가
          </button>
        )}
      </div>

      <WorkOrderTable
        loading={isLoading}
        rows={pagedRows}
        onUpload={onUploadExcel}
        showEmpty={!isLoading && filteredRows.length === 0}
        onDownloadTemplate={workOrdersExcel.downloadTemplate}
      >
        {form.isAdding && (
          <AddWorkOrderForm
            newForm={form.newForm}
            onChangeNewForm={form.onChangeNewForm}
            onSaveNew={onSaveNew}
            onCancelNew={form.onCancelNew}
          />
        )}
      </WorkOrderTable>

      {totalPages > 1 && (
        <div className="fixed bottom-5 left-64 right-0 flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const n = idx + 1;
              const active = n === page;

              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={[
                    "w-10 h-10 border rounded-sm font-semibold",
                    active
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-100",
                  ].join(" ")}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrdersPage;
