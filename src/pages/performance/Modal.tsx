import * as React from "react";
import toast from "react-hot-toast";
import { cn } from "../../shared/lib/utils";
import { instance } from "../../shared/axios/axios";
import Spinner from "../../shared/ui/Spinner";

type WorkOrder = {
  id: string;
  productName: string;
  plannedQty: number;
  completedQty: number;
  status: string;
  assignedLine: string;
  startDate: string;
  dueDate: string;
};

type ModalProps = {
  onClose: () => void;
};

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
      if (e.target instanceof Node && !el.contains(e.target)) {
        onOutside();
      }
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

  const dropdownRef = useClickOutside<HTMLDivElement>(
    () => setOpen(false),
    open,
  );

  React.useEffect(() => {
    const fetchWorkOrders = async () => {
      setWorkOrdersLoading(true);
      setWorkOrdersError(null);

      try {
        const res = await instance.get<WorkOrder[]>("/workOrders");
        setWorkOrders(res.data);
      } catch (err) {
        const msg = "작업지시 목록을 불러오지 못했습니다.";
        setWorkOrdersError(msg);
        toast.error(msg);
        console.error(err);
      } finally {
        setWorkOrdersLoading(false);
      }
    };

    fetchWorkOrders();
  }, []);

  const displayLabel = workOrderId || (workOrders[0]?.id ?? "작업지시 선택");

  const selectedWorkOrderObj = React.useMemo(() => {
    return workOrders.find((w) => w.id === workOrderId);
  }, [workOrders, workOrderId]);

  const validate = () => {
    const next: Record<string, string> = {};

    if (!workOrderId) next.workOrderId = "작업지시를 선택해주세요.";

    if (!producedQty.trim()) next.producedQty = "생산수량은 필수입니다.";
    else if (!isDigitsOnly(producedQty))
      next.producedQty = "생산수량은 숫자만 입력하세요.";

    if (!defectQty.trim()) next.defectQty = "불량수량은 필수입니다.";
    else if (!isDigitsOnly(defectQty))
      next.defectQty = "불량수량은 숫자만 입력하세요.";

    if (!startTime.trim()) next.startTime = "시작시간은 필수입니다.";
    else if (!isRealDateTime(startTime))
      next.startTime = "시작시간 형식은 YYYY-MM-DD HH:mm 입니다.";

    if (!endTime.trim()) next.endTime = "종료시간은 필수입니다.";
    else if (!isRealDateTime(endTime))
      next.endTime = "종료시간 형식은 YYYY-MM-DD HH:mm 입니다.";

    if (isRealDateTime(startTime) && isRealDateTime(endTime)) {
      const startDt = new Date(toDbDateTime(startTime));
      const endDt = new Date(toDbDateTime(endTime));

      if (startDt.getTime() > endDt.getTime()) {
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
      producedQty: Number(producedQty),
      defectQty: Number(defectQty),
      startTime: toDbDateTime(startTime),
      endTime: toDbDateTime(endTime),
      note: note.trim() ? note.trim() : undefined,
    };

    setSaving(true);
    try {
      await instance.post("/productionResults", payload, {
        headers: { "Content-Type": "application/json" },
      });

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
          <div className="font-bold mb-4">생산실적 등록</div>
          <Spinner />
        </div>
      </div>
    );
  }

  const disableWorkOrderSelect = !!workOrdersError || workOrders.length === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-1/2 rounded-md p-4 shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold">생산실적 등록</div>
          <button type="button" onClick={onClose} disabled={saving}>
            ✕
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="flex flex-col" ref={dropdownRef}>
            <span>작업지시 *</span>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              disabled={disableWorkOrderSelect || saving}
              className={cn(
                "border p-1 text-left flex items-center justify-between bg-gray-100",
                errors.workOrderId && "border-red-500",
                (disableWorkOrderSelect || saving) && "opacity-60",
              )}
            >
              <span
                className={cn(
                  "truncate",
                  workOrderId ? "text-gray-900" : "text-gray-500",
                )}
              >
                {disableWorkOrderSelect
                  ? (workOrdersError ?? "작업지시가 없습니다.")
                  : displayLabel}
              </span>
              <span className="ml-2 text-gray-500">{open ? "▲" : "▼"}</span>
            </button>

            {errors.workOrderId && (
              <span className="text-xs text-red-500 mt-1">
                {errors.workOrderId}
              </span>
            )}

            {open && !disableWorkOrderSelect && (
              <div className="relative">
                <ul
                  className="absolute z-10 mt-1 w-full border bg-white shadow overflow-auto"
                  style={{ maxHeight: 40 * 6 }}
                >
                  {workOrders.map((wo) => {
                    const active = wo.id === workOrderId;
                    return (
                      <li key={wo.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setWorkOrderId(wo.id);
                            setErrors((prev) => {
                              const { workOrderId: _, ...rest } = prev;
                              return rest;
                            });
                            setOpen(false);
                          }}
                          className={cn(
                            "w-full px-3 py-2 text-left hover:bg-gray-100",
                            active && "bg-gray-100 font-semibold",
                          )}
                        >
                          {wo.id}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="produced-qty">생산수량 *</label>
            <input
              id="produced-qty"
              value={producedQty}
              onChange={(e) => setProducedQty(e.target.value)}
              type="text"
              placeholder="예) 180"
              disabled={saving}
              className={cn(
                "border p-1 bg-gray-100",
                errors.producedQty && "border-red-500",
              )}
            />
            {errors.producedQty && (
              <span className="text-xs text-red-500 mt-1">
                {errors.producedQty}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="defect-qty">불량수량 *</label>
            <input
              id="defect-qty"
              value={defectQty}
              onChange={(e) => setDefectQty(e.target.value)}
              type="text"
              placeholder="예) 3"
              disabled={saving}
              className={cn(
                "border p-1 bg-gray-100",
                errors.defectQty && "border-red-500",
              )}
            />
            {errors.defectQty && (
              <span className="text-xs text-red-500 mt-1">
                {errors.defectQty}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="start-time">시작시간 *</label>
            <input
              id="start-time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              type="text"
              placeholder="2024-01-16 08:00"
              disabled={saving}
              className={cn(
                "border p-1 bg-gray-100",
                errors.startTime && "border-red-500",
              )}
            />
            {errors.startTime && (
              <span className="text-xs text-red-500 mt-1">
                {errors.startTime}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="end-time">종료시간 *</label>
            <input
              id="end-time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              type="text"
              placeholder="2024-01-16 13:00"
              disabled={saving}
              className={cn(
                "border p-1 bg-gray-100",
                errors.endTime && "border-red-500",
              )}
            />
            {errors.endTime && (
              <span className="text-xs text-red-500 mt-1">
                {errors.endTime}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="note">비고</label>
            <input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              type="text"
              placeholder="선택입력"
              disabled={saving}
              className="border p-1 bg-gray-100"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="border border-blue-400 px-3 py-1 rounded-md mr-3"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className={cn(
              "border px-3 py-1 rounded-md bg-blue-400 hover:bg-blue-500 text-white",
              saving && "opacity-60",
            )}
          >
            {saving ? "등록중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
