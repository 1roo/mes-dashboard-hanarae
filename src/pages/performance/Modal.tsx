import * as React from "react";
import { cn } from "../../shared/lib/utils";

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
    const saved = localStorage.getItem("workOrders");
    if (!saved) return;

    try {
      const parsed: WorkOrder[] = JSON.parse(saved);
      setWorkOrders(parsed);
    } catch (err) {
      console.error("workOrders 파싱 실패", err);
    }
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

  const onSubmit = () => {
    if (!validate()) return;

    const payload = {
      workOrderId,
      productName: selectedWorkOrderObj?.productName ?? "",
      producedQty: Number(producedQty),
      defectQty: Number(defectQty),
      startTime: toDbDateTime(startTime),
      endTime: toDbDateTime(endTime),
      operatorId: localStorage.getItem("operatorId") ?? "",
      note: note.trim() ? note.trim() : undefined,
    };

    console.log("DB로 보낼 payload:", payload);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-1/2 rounded-md p-4 shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold">생산실적 등록</div>
          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="flex flex-col" ref={dropdownRef}>
            <span>작업지시 *</span>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "border p-1 text-left flex items-center justify-between bg-gray-100",
                errors.workOrderId && "border-red-500",
              )}
            >
              <span
                className={cn(
                  "truncate",
                  workOrderId ? "text-gray-900" : "text-gray-500",
                )}
              >
                {displayLabel}
              </span>
              <span className="ml-2 text-gray-500">{open ? "▲" : "▼"}</span>
            </button>

            {errors.workOrderId && (
              <span className="text-xs text-red-500 mt-1">
                {errors.workOrderId}
              </span>
            )}

            {open && (
              <div className="relative">
                <ul
                  className="absolute z-10 mt-1 w-full border bg-white shadow overflow-auto"
                  style={{ maxHeight: 40 * 6 }}
                >
                  {workOrders.length === 0 ? (
                    <li className="px-3 py-2 text-sm text-gray-500">
                      작업지시가 없습니다.
                    </li>
                  ) : (
                    workOrders.map((wo) => {
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
                    })
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span>생산수량 *</span>
            <input
              value={producedQty}
              onChange={(e) => setProducedQty(e.target.value)}
              type="text"
              placeholder="예) 180"
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
            <span>불량수량 *</span>
            <input
              value={defectQty}
              onChange={(e) => setDefectQty(e.target.value)}
              type="text"
              placeholder="예) 3"
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
            <span>시작시간 *</span>
            <input
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              type="text"
              placeholder="2024-01-16 08:00"
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
            <span>종료시간 *</span>
            <input
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              type="text"
              placeholder="2024-01-16 13:00"
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
            <span>비고</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              type="text"
              placeholder="선택입력"
              className="border p-1 bg-gray-100"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border border-blue-400 px-3 py-1 rounded-md mr-3"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="border px-3 py-1 rounded-md bg-blue-400 hover:bg-blue-500 text-white"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
