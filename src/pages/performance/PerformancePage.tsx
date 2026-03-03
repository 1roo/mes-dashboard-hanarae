import { useState } from "react";
import toast from "react-hot-toast";
import PerformanceTable from "./PerformanceTable";
import { usePerformance } from "./usePerformance";
import Modal from "./Modal";
import type { Performance } from "./types";
import { useExcel } from "./useExcel";
import { instance } from "../../shared/axios/axios";

type UploadRow = Partial<Performance>;

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

const PerformancePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const up = usePerformance();
  const { downloadTemplate } = useExcel();

  const handleUpload = async (rawRows: UploadRow[]) => {
    const rows = rawRows.filter((r) => !isEmptyRow(r));

    if (rows.length === 0) {
      toast.error("업로드할 데이터가 없습니다.");
      return;
    }

    const errors: string[] = [];
    const valid: Array<{
      workOrderId: string;
      productName: string;
      producedQty: number;
      defectQty: number;
      startTime: string;
      operatorId: string;
      note: string;
    }> = [];

    rows.forEach((r, idx) => {
      const rowNo = idx + 2; // 헤더 1행 기준

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

    if (errors.length > 0) {
      toast.error(
        `엑셀 업로드 오류가 있습니다.\n${errors.slice(0, 6).join("\n")}`,
      );
      return;
    }

    try {
      toast.loading("엑셀 데이터를 등록 중...", { id: "excel-upload" });
      await instance.post("/productionResults", valid);
      toast.success(`등록 완료 (${valid.length}건)`, { id: "excel-upload" });
    } catch (e) {
      toast.error("등록에 실패했습니다. 서버 상태를 확인하세요.", {
        id: "excel-upload",
      });
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="h-16 mx-auto w-full">
        <div className="bg-gray-200 p-2 flex justify-between items-center rounded-md mb-5">
          <span className="text-gray-900 font-bold text-2xl">
            생산실적 목록
          </span>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-sm bg-blue-600 hover:bg-blue-400 text-white font-bold text-xl px-4 py-2"
          >
            + 실적 등록
          </button>
        </div>
      </div>

      <div className="flex-1 mt-5">
        <PerformanceTable
          rows={up.pagedRows}
          loading={up.loading}
          nameByEmployeeId={up.nameByEmployeeId}
          onUpload={handleUpload}
          onDownloadTemplate={downloadTemplate}
        />
      </div>

      <div className="fixed bottom-5 left-64 right-0 flex justify-center">
        <div className="flex gap-2">
          {Array.from({ length: up.totalPages }).map((_, idx) => {
            const n = idx + 1;
            const active = n === up.page;

            return (
              <button
                key={n}
                type="button"
                onClick={() => up.setPage(n)}
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

      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default PerformancePage;
