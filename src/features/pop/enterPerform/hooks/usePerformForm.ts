import { useMemo, useState } from "react";

export type WorkStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type PerformFormPayload = {
  producedQty: number;
  defectQty: number;
  startTime: string; // API로 보낼 값(iso)
  endTime: string; // API로 보낼 값(iso)
  note: string;
  createdAt: string;
  status: WorkStatus;
};

const toApiIso = (v: string) => {
  if (!v) return "";
  return `${v}:00`;
};

const nowApiIso = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
};

export const usePerformForm = () => {
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
    if (!Number.isFinite(producedNum) || !Number.isFinite(defectNum))
      return false;
    if (producedNum < 0 || defectNum < 0) return false;
    if (defectNum > producedNum) return false;

    if (!startTime || !endTime) return false;

    const st = new Date(startTime).getTime();
    const et = new Date(endTime).getTime();
    if (!Number.isFinite(st) || !Number.isFinite(et)) return false;
    if (et < st) return false;

    return true;
  }, [producedQty, defectQty, producedNum, defectNum, startTime, endTime]);

  const buildPayload = (): PerformFormPayload | null => {
    if (!isValid) return null;

    return {
      producedQty: producedNum,
      defectQty: defectNum,
      startTime: toApiIso(startTime),
      endTime: toApiIso(endTime),
      note: note.trim(),
      createdAt: nowApiIso(),
      status,
    };
  };

  return {
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
  };
};
