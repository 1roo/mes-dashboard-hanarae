import { useEffect, useState, useCallback } from "react";
import { RiResetRightFill } from "react-icons/ri";
import LinePage from "./line/LingPage";
import type { LineValue } from "./line/type";
import EnterPerformPage from "./enterPerform/EnterPerformPage";

type View = "LINE" | "PERFORM";

const LINE_TABS: Array<{ label: string; value: LineValue }> = [
  { label: "라인 A", value: "라인 A" },
  { label: "라인 B", value: "라인 B" },
  { label: "라인 C", value: "라인 C" },
  { label: "라인 D", value: "라인 D" },
];

const PopPage = () => {
  const [view, setView] = useState<View>("LINE");
  const [selectedLine, setSelectedLine] = useState<LineValue>("라인 A");

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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-md shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex bg-gray-100 p-1 rounded-md w-fit">
            <button
              onClick={() => setView("LINE")}
              className={`px-4 py-1 rounded-sm ${
                view === "LINE" ? "bg-blue-600 text-white" : "text-gray-500"
              }`}
            >
              현황판
            </button>

            <button
              onClick={() => setView("PERFORM")}
              className={`px-4 py-1 rounded-sm ${
                view === "PERFORM" ? "bg-blue-600 text-white" : "text-gray-500"
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

          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-600 mr-2 animate-pulse" />
            <span>{formatTime(lastUpdated)}</span>
          </div>
        </div>
      </div>

      {view === "LINE" && (
        <div className="flex gap-2">
          {LINE_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setSelectedLine(t.value)}
              className={`px-3 py-1 rounded-md border ${
                selectedLine === t.value
                  ? "bg-blue-400 text-black"
                  : "bg-white text-gray-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {view === "LINE" && (
        <LinePage
          refreshKey={refreshKey}
          onRefreshed={handleRefreshed}
          selectedLine={selectedLine}
        />
      )}

      {view === "PERFORM" && <EnterPerformPage />}
    </div>
  );
};

export default PopPage;
