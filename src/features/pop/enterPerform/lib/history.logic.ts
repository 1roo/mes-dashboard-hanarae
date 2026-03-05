import type { ProductionResult, WorkStatus } from "../type";

const num = (v: number) => (Number.isFinite(v) ? v : 0);

export const formatTimeHHmm = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export const getStatus = (r: ProductionResult): WorkStatus => {
  if (r.status) return r.status;
  if (r.endTime) return "COMPLETED";
  if (r.startTime) return "IN_PROGRESS";
  return "PENDING";
};

export const dotClassByStatus = (status: WorkStatus) => {
  if (status === "COMPLETED") return "bg-green-400";
  if (status === "IN_PROGRESS") return "bg-blue-400";
  return "bg-yellow-400";
};

export const sortByCreatedAtDesc = (items: ProductionResult[]) =>
  [...items].sort((a, b) => {
    const at = new Date(a.createdAt).getTime();
    const bt = new Date(b.createdAt).getTime();
    return bt - at;
  });

export const calcSummary = (items: ProductionResult[]) => {
  const totalProduced = items.reduce((s, r) => s + num(r.producedQty), 0);
  const totalDefect = items.reduce((s, r) => s + num(r.defectQty), 0);
  const defectRate =
    totalProduced > 0 ? (totalDefect / totalProduced) * 100 : 0;

  return { totalProduced, totalDefect, defectRate };
};
