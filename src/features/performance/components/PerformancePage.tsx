import { useState } from "react";
import toast from "react-hot-toast";

import PerformanceTable from "./PerformanceTable";
import Modal from "./Modal";

import { usePerformanceList } from "../queries/usePerformanceList";
import { useUploadPerformanceExcel } from "../mutations/useUploadPerformanceExcel.ts";
import { validateExcelRows, type UploadRow } from "../excel/validateExcelRows";
import { performanceExcel } from "../excel/performanceExcel";
import { PAGE_SIZE } from "../constants";
import { useReversePagination } from "../hooks/useReversePagination";

const PerformancePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { rows, loading, nameByEmployeeId } = usePerformanceList();
  const uploadExcel = useUploadPerformanceExcel();

  const { page, setPage, totalPages, pagedRows } = useReversePagination(
    rows,
    PAGE_SIZE,
  );

  const handleUpload = async (rawRows: UploadRow[]) => {
    if (!rawRows || rawRows.length === 0) {
      toast.error("업로드할 데이터가 없습니다.");
      return;
    }

    const { valid, errors, hasData } = validateExcelRows(rawRows);

    if (!hasData || valid.length === 0) {
      toast.error("업로드할 데이터가 없습니다.");
      return;
    }

    if (errors.length > 0) {
      toast.error(
        `엑셀 업로드 오류가 있습니다.\n${errors.slice(0, 6).join("\n")}`,
      );
      return;
    }

    const task = uploadExcel.mutateAsync(valid);

    toast.promise(
      task,
      {
        loading: "엑셀 데이터를 등록 중...",
        success: `등록 완료 (${valid.length}건)`,
        error: "등록에 실패했습니다. 서버 상태를 확인하세요.",
      },
      { id: "excel-upload" },
    );

    await task;
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
          rows={pagedRows}
          loading={loading || uploadExcel.isPending}
          nameByEmployeeId={nameByEmployeeId}
          onUpload={handleUpload}
          onDownloadTemplate={performanceExcel.downloadTemplate}
        />
      </div>

      {/* ✅ 페이지네이션 */}
      {totalPages > 1 && (
        <div className="fixed bottom-5 left-64 right-0 flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const n = idx + 1;
              const active = n === page;

              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
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
      )}

      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default PerformancePage;
