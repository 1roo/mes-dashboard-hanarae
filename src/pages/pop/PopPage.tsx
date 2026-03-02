import { useEffect, useState, useCallback } from "react";
import LinePage from "./linePage/LinePage";
import PerformPage from "./performPage/PerformPage";
import { RiResetRightFill } from "react-icons/ri";

type View = "LINE" | "PERFORM";

const PopPage = () => {
  const [view, setView] = useState<View>("LINE");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setRefreshKey((v) => v + 1);
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  const handleRefreshed = useCallback(() => {
    setLastUpdated(new Date());
  }, []);

  const formatTime = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-md shadow-sm">
        <div className="flex flex-col">
          <div className="flex bg-gray-100 p-1 rounded-md w-fit">
            <button
              onClick={() => setView("LINE")}
              className={`px-4 py-1 rounded-sm font-medium transition-all duration-200
                ${
                  view === "LINE"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-500 hover:text-blue-600"
                }`}
            >
              현황판
            </button>

            <button
              onClick={() => setView("PERFORM")}
              className={`px-4 py-1 rounded-md font-medium transition-all duration-200
                ${
                  view === "PERFORM"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-500 hover:text-blue-600"
                }`}
            >
              실적입력
            </button>
          </div>
        </div>

        <div className="flex items-center text-sm">
          <span className="flex items-center mr-4 text-gray-400 text-xs">
            <RiResetRightFill className="mr-1" />
            5분마다 갱신
          </span>

          <div className="flex items-center text-sm">
            <div className="w-2 h-2 rounded-full bg-green-600 mr-2 animate-pulse" />
            <span className="text-gray-700 font-medium">
              {formatTime(lastUpdated)}
            </span>
          </div>
        </div>
      </div>

      {view === "LINE" ? (
        <LinePage refreshKey={refreshKey} onRefreshed={handleRefreshed} />
      ) : (
        <PerformPage />
      )}
    </div>
  );
};

export default PopPage;
