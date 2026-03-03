import * as XLSX from "xlsx";
import type { Performance } from "./types";
import { formatDateTime } from "./constants";

export interface ExcelPerformanceRow {
  작업지시번호: string;
  제품명: string;
  생산수량: number;
  불량수량: number;
  시작일시: string;
  담당자ID: string;
  비고?: string;
}

export const useExcel = () => {
  const downloadExcel = (data: Performance[], nameMap: Map<string, string>) => {
    const excelData = data.map((r) => ({
      작업지시번호: r.workOrderId,
      제품명: r.productName,
      생산수량: r.producedQty ?? 0,
      불량수량: r.defectQty ?? 0,
      시작일시: formatDateTime(r.startTime),
      담당자: nameMap.get(r.operatorId) || r.operatorId,
      비고: r.note || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "생산실적현황");
    XLSX.writeFile(
      workbook,
      `Performance_${new Date().toLocaleDateString()}.xlsx`,
    );
  };

  const downloadTemplate = () => {
    const headers = [
      [
        "작업지시번호",
        "제품명",
        "생산수량",
        "불량수량",
        "시작일시",
        "담당자ID",
        "비고",
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(headers);

    ws["!cols"] = [
      { wch: 14 },
      { wch: 18 },
      { wch: 10 },
      { wch: 10 },
      { wch: 18 },
      { wch: 12 },
      { wch: 20 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "업로드양식");

    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Performance_Upload_Template_${today}.xlsx`);
  };

  const uploadExcel = (file: File): Promise<Partial<Performance>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json<ExcelPerformanceRow>(sheet);

          const mapped = json.map((row) => ({
            workOrderId: String(row.작업지시번호),
            productName: row.제품명,
            producedQty: Number(row.생산수량),
            defectQty: Number(row.불량수량),
            startTime: row.시작일시,
            operatorId: String(row.담당자ID),
            note: row.비고 || "",
          }));
          resolve(mapped);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsBinaryString(file);
    });
  };

  return { downloadExcel, downloadTemplate, uploadExcel };
};
