import { useState } from "react";
import PerformanceTable from "./PerformanceTable";
import { usePerformance } from "./usePerformance";
import Modal from "./Modal";

const PerformancePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const up = usePerformance();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto w-full">
        <div className="bg-gray-200 p-3 flex justify-between items-center rounded-md mb-5">
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

      <div className="flex-1">
        <PerformanceTable
          rows={up.pagedRows}
          loading={up.loading}
          nameByEmployeeId={up.nameByEmployeeId}
        />
      </div>

      <div className="fixed bottom-5 left-0 right-0 flex justify-center">
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
