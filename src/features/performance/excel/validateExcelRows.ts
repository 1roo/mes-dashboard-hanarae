import type { Performance } from "../types";

export type UploadRow = Partial<Performance>;

const isBlank = (v: unknown) =>
  v == null || (typeof v === "string" && v.trim() === "");

const toNumber = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(String(v ?? "").trim());
  return Number.isFinite(n) ? n : NaN;
};

const normalizeDateTime = (v: unknown) => {
  if (typeof v !== "string") return "";
  const s = v.trim();
  if (!s) return "";
  return s.replace("T", " ");
};

const isValidDateTime = (v: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(v);
  if (!m) return false;

  const yyyy = Number(m[1]);
  const mm = Number(m[2]);
  const dd = Number(m[3]);
  const hh = Number(m[4]);
  const mi = Number(m[5]);

  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;
  if (hh < 0 || hh > 23) return false;
  if (mi < 0 || mi > 59) return false;

  const d = new Date(yyyy, mm - 1, dd, hh, mi);
  return (
    d.getFullYear() === yyyy &&
    d.getMonth() === mm - 1 &&
    d.getDate() === dd &&
    d.getHours() === hh &&
    d.getMinutes() === mi
  );
};

const isEmptyRow = (r: UploadRow) =>
  isBlank(r.workOrderId) &&
  isBlank(r.productName) &&
  (r.producedQty == null || String(r.producedQty).trim() === "") &&
  (r.defectQty == null || String(r.defectQty).trim() === "") &&
  isBlank(r.startTime) &&
  isBlank(r.operatorId) &&
  isBlank(r.note);

export type ValidUploadRow = {
  workOrderId: string;
  productName: string;
  producedQty: number;
  defectQty: number;
  startTime: string;
  operatorId: string;
  note: string;
};

export type ExcelValidationResult = {
  valid: ValidUploadRow[];
  errors: string[];
  hasData: boolean;
};

export function validateExcelRows(rawRows: UploadRow[]): ExcelValidationResult {
  const rows = rawRows.filter((r) => !isEmptyRow(r));

  const errors: string[] = [];
  const valid: ValidUploadRow[] = [];

  rows.forEach((r, idx) => {
    const rowNo = idx + 2;

    const workOrderId = String(r.workOrderId ?? "").trim();
    const productName = String(r.productName ?? "").trim();
    const producedQty = toNumber(r.producedQty);
    const defectQty = toNumber(r.defectQty);
    const startTime = normalizeDateTime(r.startTime);
    const operatorId = String(r.operatorId ?? "").trim();
    const note = String(r.note ?? "").trim();

    if (!workOrderId) errors.push(`${rowNo}행: 작업지시번호가 비어있습니다.`);
    if (!productName) errors.push(`${rowNo}행: 제품명이 비어있습니다.`);

    if (!Number.isFinite(producedQty) || producedQty < 0)
      errors.push(`${rowNo}행: 생산수량이 올바르지 않습니다.`);
    if (!Number.isFinite(defectQty) || defectQty < 0)
      errors.push(`${rowNo}행: 불량수량이 올바르지 않습니다.`);
    if (
      Number.isFinite(producedQty) &&
      Number.isFinite(defectQty) &&
      defectQty > producedQty
    )
      errors.push(`${rowNo}행: 불량수량이 생산수량보다 클 수 없습니다.`);

    if (!startTime) errors.push(`${rowNo}행: 시작일시가 비어있습니다.`);
    else if (!isValidDateTime(startTime))
      errors.push(
        `${rowNo}행: 시작일시 형식이 올바르지 않습니다. (예: 2026-03-03 08:00)`,
      );

    if (!operatorId) errors.push(`${rowNo}행: 담당자ID가 비어있습니다.`);

    const hasRowError = errors.some((e) => e.startsWith(`${rowNo}행:`));
    if (!hasRowError) {
      valid.push({
        workOrderId,
        productName,
        producedQty,
        defectQty,
        startTime,
        operatorId,
        note,
      });
    }
  });

  return {
    valid,
    errors,
    hasData: rows.length > 0,
  };
}
