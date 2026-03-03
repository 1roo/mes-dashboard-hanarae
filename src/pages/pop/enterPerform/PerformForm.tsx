import { useMemo, useState } from "react";

type WorkStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type ProductionResultPayload = {
  workOrderId: string;
  productName: string;
  producedQty: number;
  defectQty: number;
  startTime: string;
  endTime: string;
  operatorId: string;
  note: string;
};

type Props = {
  onSubmit?: (
    payload: Omit<
      ProductionResultPayload,
      "workOrderId" | "productName" | "operatorId"
    >,
  ) => Promise<void> | void;
};

const toApiIso = (v: string) => {
  // datetime-local: "2024-01-15T08:00" -> "2024-01-15T08:00:00"
  if (!v) return "";
  return `${v}:00`;
};

const PerformForm = ({ onSubmit }: Props) => {
  const [producedQty, setProducedQty] = useState("");
  const [defectQty, setDefectQty] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState<WorkStatus>("PENDING");
  const [note, setNote] = useState("");
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const producedNum = Number(producedQty);
  const defectNum = Number(defectQty);

  const isValid = useMemo(() => {
    if (!producedQty || !defectQty) return false;
    if (producedNum < 0 || defectNum < 0) return false;
    if (defectNum > producedNum) return false;
    if (!startTime || !endTime) return false;
    if (new Date(endTime).getTime() < new Date(startTime).getTime())
      return false;
    return true;
  }, [producedQty, defectQty, producedNum, defectNum, startTime, endTime]);

  const handleSubmit = async () => {
    setSubmittedOnce(true);
    if (!isValid) return;

    await onSubmit?.({
      producedQty: producedNum,
      defectQty: defectNum,
      startTime: toApiIso(startTime),
      endTime: toApiIso(endTime),
      note: note.trim(),
    });
  };

  const getStatusClass = (type: WorkStatus) => {
    const base =
      "flex-1 border rounded-md h-12 text-center leading-12 cursor-pointer transition-all";
    if (status !== type) return base;
    if (type === "PENDING")
      return `${base} bg-gray-600 text-white border-blue-500`;
    if (type === "IN_PROGRESS")
      return `${base} bg-blue-600 text-white border-blue-500`;
    return `${base} bg-green-600 text-white border-blue-500`;
  };

  const inputBorder = (value: string) =>
    `w-full border rounded-md h-16 text-4xl font-bold text-center px-3 ${
      value ? "border-blue-500" : "border-gray-300"
    }`;

  const smallInputBorder = (value: string) =>
    `border rounded-md h-10 px-2 ${value ? "border-blue-500" : "border-gray-300"}`;

  return (
    <div>
      <div className="flex items-center">
        <div className="w-1 h-3 bg-blue-400 mr-1" />
        <span className="font-bold">생산 실적 입력</span>
      </div>

      <div className="flex justify-between mt-2">
        <div className="flex flex-col flex-1 mr-2">
          <label htmlFor="producedQty">생산수량*</label>
          <input
            id="producedQty"
            type="number"
            value={producedQty}
            onChange={(e) => setProducedQty(e.target.value)}
            className={inputBorder(producedQty)}
          />
        </div>

        <div className="flex flex-col flex-1">
          <label htmlFor="defectQty">불량수량*</label>
          <input
            id="defectQty"
            type="number"
            value={defectQty}
            onChange={(e) => setDefectQty(e.target.value)}
            className={inputBorder(defectQty)}
          />
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <div className="flex flex-col flex-1 mr-2">
          <label htmlFor="startTime">시작시간*</label>
          <input
            id="startTime"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={smallInputBorder(startTime)}
          />
        </div>

        <div className="flex flex-col flex-1">
          <label htmlFor="endTime">종료시간*</label>
          <input
            id="endTime"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={smallInputBorder(endTime)}
          />
        </div>
      </div>

      <div className="mt-2">
        <span>작업 상태</span>
        <div className="flex justify-between">
          <div
            className={getStatusClass("PENDING")}
            onClick={() => setStatus("PENDING")}
          >
            ⏳대기
          </div>
          <div
            className={`${getStatusClass("IN_PROGRESS")} mx-2`}
            onClick={() => setStatus("IN_PROGRESS")}
          >
            ⚙️진행중
          </div>
          <div
            className={getStatusClass("COMPLETED")}
            onClick={() => setStatus("COMPLETED")}
          >
            ✅완료
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-2">
        <label htmlFor="note">비고</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`border rounded-md h-20 p-3 resize-none ${
            note ? "border-blue-500" : "border-gray-300"
          }`}
          placeholder="특이사항(선택)"
        />
      </div>

      {submittedOnce && isValid && (
        <div className="w-full rounded-md bg-blue-300/30 p-2 border border-blue-400/40 text-blue-600 mt-3">
          ✔️입력값이 유효합니다. 등록 버튼을 눌러주세요.
        </div>
      )}

      {submittedOnce && !isValid && (
        <div className="w-full rounded-md bg-red-300/30 p-2 border border-red-400/40 text-red-600 mt-3">
          ❌입력값을 확인해주세요.
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full h-12 font-bold rounded-md bg-blue-400 mt-3 hover:bg-blue-300"
      >
        ✔ 실적 등록
      </button>
    </div>
  );
};

export default PerformForm;
