import * as XLSX from "xlsx";
import type { WorkOrder } from "./types";
import { statusLabel } from "./constants";

export interface ExcelRow {
  작업지시번호: string;
  제품명: string;
  계획수량: number;
  지시일: string;
}

export const useExcel = () => {
  const downloadExcel = (data: WorkOrder[]) => {
    const excelData = data.map((r) => ({
      작업지시번호: r.id,
      제품명: r.productName,
      계획수량: r.plannedQty ?? 0,
      지시일: r.startDate,
      상태: statusLabel[r.status] || r.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "작업지시현황");
    XLSX.writeFile(workbook, "WorkOrder_List.xlsx");
  };

  const uploadExcel = (file: File): Promise<Partial<WorkOrder>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

          const mapped = json.map((row) => ({
            id: String(row.작업지시번호),
            productName: row.제품명,
            plannedQty: row.계획수량,
            startDate: row.지시일,
          }));
          resolve(mapped);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsBinaryString(file);
    });
  };

  return { downloadExcel, uploadExcel };
};
