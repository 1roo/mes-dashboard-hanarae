import * as React from "react";
import toast from "react-hot-toast";
import { cn } from "../../shared/lib/utils";
import { instance } from "../../shared/axios/axios";
import Spinner from "../../shared/ui/Spinner";
import { useAuth } from "../../auth/useAuth";

type WorkOrder = {
  id: string;
  productName: string;
  plannedQty: number;
  completedQty: number;
  status: string;
  assignedLine: string;
  startDate: string;
  dueDate: string;
  operatorName: string;
};

type ModalProps = {
  onClose: () => void;
};

const formatNumberWithComma = (v: string) => {
  const onlyDigits = v.replace(/[^0-9]/g, "");
  if (!onlyDigits) return "";
  return Number(onlyDigits).toLocaleString();
};

const unformatNumber = (v: string) => v.replace(/,/g, "");

const isDigitsOnly = (v: string) => /^[0-9]+$/.test(v.trim());
const isValidDateTimeFormat = (v: string) =>
  /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(v.trim());

const isRealDateTime = (v: string) => {
  if (!isValidDateTimeFormat(v)) return false;
  const [datePart, timePart] = v.trim().split(" ");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  if (hh < 0 || hh > 23) return false;
  if (mm < 0 || mm > 59) return false;
  const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
  return (
    dt.getFullYear() === y &&
    dt.getMonth() === m - 1 &&
    dt.getDate() === d &&
    dt.getHours() === hh &&
    dt.getMinutes() === mm
  );
};

const toDbDateTime = (v: string) => {
  const [datePart, timePart] = v.trim().split(" ");
  return `${datePart}T${timePart}:00`;
};

function useClickOutside<T extends HTMLElement>(
  onOutside: () => void,
  enabled: boolean,
) {
  const ref = React.useRef<T | null>(null);
  React.useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [enabled, onOutside]);
  return ref;
}

const Modal = ({ onClose }: ModalProps) => {
  const [workOrders, setWorkOrders] = React.useState<WorkOrder[]>([]);
  const [workOrdersLoading, setWorkOrdersLoading] = React.useState(false);
  const [workOrdersError, setWorkOrdersError] = React.useState<string | null>(
    null,
  );
  const [saving, setSaving] = React.useState(false);

  const [workOrderId, setWorkOrderId] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [producedQty, setProducedQty] = React.useState("");
  const [defectQty, setDefectQty] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [note, setNote] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const { user } = useAuth();
  const dropdownRef = useClickOutside<HTMLDivElement>(
    () => setOpen(false),
    open,
  );

  React.useEffect(() => {
    const fetchWorkOrders = async () => {
      setWorkOrdersLoading(true);
      try {
        const res = await instance.get<WorkOrder[]>("/workOrders");
        setWorkOrders(res.data);
      } catch (err) {
        setWorkOrdersError("작업지시 목록을 불러오지 못했습니다.");
        toast.error("작업지시 목록 로딩 실패");
        console.error(err);
      } finally {
        setWorkOrdersLoading(false);
      }
    };
    fetchWorkOrders();
  }, []);

  const selectedWorkOrderObj = React.useMemo(() => {
    return workOrders.find((w) => w.id === workOrderId);
  }, [workOrders, workOrderId]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!workOrderId) next.workOrderId = "작업지시를 선택해주세요.";
    if (!producedQty.trim()) next.producedQty = "생산수량은 필수입니다.";
    else if (!isDigitsOnly(unformatNumber(producedQty)))
      next.producedQty = "생산수량은 숫자만 입력하세요.";
    if (!defectQty.trim()) next.defectQty = "불량수량은 필수입니다.";
    else if (!isDigitsOnly(unformatNumber(defectQty)))
      next.defectQty = "불량수량은 숫자만 입력하세요.";
    if (!startTime.trim()) next.startTime = "시작시간 필수 (YYYY-MM-DD HH:mm)";
    else if (!isRealDateTime(startTime))
      next.startTime = "올바른 형식이 아닙니다.";
    if (!endTime.trim()) next.endTime = "종료시간 필수 (YYYY-MM-DD HH:mm)";
    else if (!isRealDateTime(endTime)) next.endTime = "올바른 형식이 아닙니다.";

    if (isRealDateTime(startTime) && isRealDateTime(endTime)) {
      if (new Date(toDbDateTime(startTime)) > new Date(toDbDateTime(endTime))) {
        next.endTime = "종료시간은 시작시간 이후여야 합니다.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    const payload = {
      workOrderId,
      productName: selectedWorkOrderObj?.productName ?? "",
      producedQty: Number(unformatNumber(producedQty)),
      defectQty: Number(unformatNumber(defectQty)),
      startTime: toDbDateTime(startTime),
      endTime: toDbDateTime(endTime),
      operatorId: user?.employeeId ?? user?.id ?? "",
      note: note.trim() || undefined,
    };

    setSaving(true);
    try {
      await instance.post("/productionResults", payload);
      toast.success("등록되었습니다.");
      onClose();
    } catch (err) {
      toast.error("등록에 실패했습니다.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (workOrdersLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <div className="bg-white w-1/2 rounded-md p-6 shadow">
          <Spinner />
        </div>
      </div>
    );
  }

  const disableWorkOrderSelect = !!workOrdersError || workOrders.length === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-1/2 rounded-md p-4 shadow">
        <div className="flex items-center justify-between mb-3 font-bold">
          <span>생산실적 등록</span>
          <button type="button" onClick={onClose} disabled={saving}>
            ✕
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          {/* 작업지시 드롭다운 */}
          <div className="flex flex-col relative" ref={dropdownRef}>
            <label className="text-sm">작업지시 *</label>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              disabled={disableWorkOrderSelect || saving}
              className={cn(
                "border p-2 text-left flex items-center justify-between bg-gray-100",
                errors.workOrderId && "border-red-500",
                (disableWorkOrderSelect || saving) && "opacity-60",
              )}
            >
              <span className="truncate">{workOrderId || "작업지시 선택"}</span>
              <span className="ml-2 text-gray-500">{open ? "▲" : "▼"}</span>
            </button>
            {open && !disableWorkOrderSelect && (
              <ul className="absolute z-10 top-full left-0 w-full border bg-white shadow-xl max-h-48 overflow-auto">
                {workOrders.map((wo) => (
                  <li key={wo.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setWorkOrderId(wo.id);
                        setOpen(false);
                        setErrors({});
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 text-sm"
                    >
                      {wo.id} | {wo.productName}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {errors.workOrderId && (
              <span className="text-xs text-red-500 mt-1">
                {errors.workOrderId}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm">생산수량 *</label>
            <input
              value={producedQty}
              onChange={(e) => {
                const raw = e.target.value;
                const onlyDigits = raw.replace(/[^0-9]/g, "");
                setProducedQty(formatNumberWithComma(onlyDigits));
              }}
              disabled={saving}
              className={cn(
                "border p-2 bg-gray-100",
                errors.producedQty && "border-red-500",
              )}
              placeholder="숫자 입력"
            />
            {errors.producedQty && (
              <span className="text-xs text-red-500 mt-1">
                {errors.producedQty}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm">불량수량 *</label>
            <input
              value={defectQty}
              onChange={(e) => {
                const raw = e.target.value;
                const onlyDigits = raw.replace(/[^0-9]/g, "");
                setDefectQty(formatNumberWithComma(onlyDigits));
              }}
              disabled={saving}
              className={cn(
                "border p-2 bg-gray-100",
                errors.defectQty && "border-red-500",
              )}
              placeholder="숫자 입력"
            />
            {errors.defectQty && (
              <span className="text-xs text-red-500 mt-1">
                {errors.defectQty}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm">시작시간 *</label>
            <input
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={saving}
              className={cn(
                "border p-2 bg-gray-100",
                errors.startTime && "border-red-500",
              )}
              placeholder="2024-01-16 08:00"
            />
            {errors.startTime && (
              <span className="text-xs text-red-500 mt-1">
                {errors.startTime}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm">종료시간 *</label>
            <input
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={saving}
              className={cn(
                "border p-2 bg-gray-100",
                errors.endTime && "border-red-500",
              )}
              placeholder="2024-01-16 13:00"
            />
            {errors.endTime && (
              <span className="text-xs text-red-500 mt-1">
                {errors.endTime}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm">비고</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={saving}
              className="border p-2 bg-gray-100"
              placeholder="선택 사항"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="border px-4 py-2 rounded hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
