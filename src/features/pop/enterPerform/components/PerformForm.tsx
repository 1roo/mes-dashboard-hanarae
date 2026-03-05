import {
  usePerformForm,
  type PerformFormPayload,
} from "../hooks/usePerformForm";

export type ProductionResultPayload = {
  workOrderId: string;
  productName: string;
  operatorId: string;
} & PerformFormPayload;

type Props = {
  onSubmit?: (payload: PerformFormPayload) => Promise<void> | void;
};

const PerformForm = ({ onSubmit }: Props) => {
  const {
    producedQty,
    setProducedQty,
    defectQty,
    setDefectQty,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    status,
    setStatus,
    note,
    setNote,
    submittedOnce,
    setSubmittedOnce,
    isValid,
    buildPayload,
  } = usePerformForm();

  const handleSubmit = async () => {
    setSubmittedOnce(true);
    const payload = buildPayload();
    if (!payload) return;
    await onSubmit?.(payload);
  };

  const getStatusClass = (type: PerformFormPayload["status"]) => {
    const base =
      "flex-1 border rounded-md h-12 text-center leading-[3rem] cursor-pointer transition-all";
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
          <button
            type="button"
            className={getStatusClass("PENDING")}
            onClick={() => setStatus("PENDING")}
          >
            ⏳대기
          </button>
          <button
            type="button"
            className={`${getStatusClass("IN_PROGRESS")} mx-2`}
            onClick={() => setStatus("IN_PROGRESS")}
          >
            ⚙️진행중
          </button>
          <button
            type="button"
            className={getStatusClass("COMPLETED")}
            onClick={() => setStatus("COMPLETED")}
          >
            ✅완료
          </button>
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
        type="button"
        onClick={handleSubmit}
        className="w-full h-12 font-bold rounded-md bg-blue-400 mt-3 hover:bg-blue-300"
      >
        ✔ 실적 등록
      </button>
    </div>
  );
};

export default PerformForm;
