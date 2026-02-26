import { useState } from "react";
import PerformanceTable from "./PerformanceTable";
import { usePerformance } from "./usePerformance";
import Modal from "./Modal";

const PerformancePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // up 객체 하나로 관리하여 코드를 깔끔하게 정리합니다.
  const up = usePerformance();

  return (
    <div>
      <div className="mx-auto">
        <div className="bg-gray-950 p-3 flex justify-between items-center rounded-md mb-5">
          <span className="text-white font-bold text-2xl">생산실적 목록</span>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-sm bg-blue-600 hover:bg-blue-400 text-white font-bold text-xl px-4 py-2"
          >
            + 실적 등록
          </button>
        </div>
      </div>

      {/* 핵심 수정: rows 대신 up.pagedRows를 전달하여 현재 페이지 데이터만 표시합니다. */}
      <PerformanceTable
        rows={up.pagedRows}
        loading={up.loading}
        nameByEmployeeId={up.nameByEmployeeId}
      />

      {/* 페이지네이션 컨트롤러 */}
      <div className="flex justify-center gap-2 mt-4">
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

      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default PerformancePage;
