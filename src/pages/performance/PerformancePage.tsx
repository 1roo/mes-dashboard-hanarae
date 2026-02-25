import { useState } from "react";
import PerformanceTable from "./PerformanceTable";
import { usePerformance } from "./usePerformance";
import Modal from "./Modal";

const PerformancePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { rows, loading, nameByEmployeeId } = usePerformance();

  return (
    <div>
      <div className="mx-auto">
        <div className="bg-gray-950 p-3 flex justify-between items-center rounded-md mb-5">
          <span className="text-white font-bold text-2xl">생산실적 목록</span>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-sm bg-violet-600 hover:bg-violet-400 text-white font-bold text-xl px-4 py-2"
          >
            + 실적 등록
          </button>
        </div>
      </div>

      <PerformanceTable
        rows={rows}
        loading={loading}
        nameByEmployeeId={nameByEmployeeId}
      />

      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default PerformancePage;
