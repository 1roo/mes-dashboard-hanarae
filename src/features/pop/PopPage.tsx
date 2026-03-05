import { useEffect, useState, useCallback } from "react";
import { RiResetRightFill } from "react-icons/ri";
import LinePage from "../../features/pop/line/components/LinePage";
import type { LineValue } from "./line/type";
import EnterPerformPage from "./enterPerform/components/EnterPerformPage";

type View = "LINE" | "PERFORM";

const LINE_TABS: Array<{ label: string; value: LineValue }> = [
  { label: "라인 A", value: "라인 A" },
  { label: "라인 B", value: "라인 B" },
  { label: "라인 C", value: "라인 C" },
  { label: "라인 D", value: "라인 D" },
];

const VIEW_KEY = "pop:view";
const LINE_KEY = "pop:selectedLine";

const isView = (v: unknown): v is View => v === "LINE" || v === "PERFORM";
const isLine = (v: unknown): v is LineValue =>
  v === "라인 A" || v === "라인 B" || v === "라인 C" || v === "라인 D";

const PopPage = () => {
  // ✅ 최초 1회만 sessionStorage에서 복원 (없으면 기본값 LINE / 라인A)
  const [view, setView] = useState<View>(() => {
    const raw = sessionStorage.getItem(VIEW_KEY);
    return isView(raw) ? raw : "LINE";
  });

  const [selectedLine, setSelectedLine] = useState<LineValue>(() => {
    const raw = sessionStorage.getItem(LINE_KEY);
    return isLine(raw) ? raw : "라인 A";
  });

  // ✅ 값이 바뀔 때마다 저장 -> 다음 진입/리마운트에도 유지
  useEffect(() => {
    sessionStorage.setItem(VIEW_KEY, view);
  }, [view]);

  useEffect(() => {
    sessionStorage.setItem(LINE_KEY, selectedLine);
  }, [selectedLine]);

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
    <div className="flex flex-col h-screen min-h-0 overflow-hidden">
      <div className="shrink-0 flex justify-between items-center mb-4 bg-white p-3 rounded-md shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex bg-gray-100 p-1 rounded-md w-fit">
            <button
              type="button"
              onClick={() => setView("LINE")}
              className={`px-4 py-1 rounded-sm ${
                view === "LINE" ? "bg-blue-600 text-white" : "text-gray-500"
              }`}
            >
              현황판
            </button>

            <button
              type="button"
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
        <div className="shrink-0 flex gap-2 mb-2">
          {LINE_TABS.map((t) => (
            <button
              key={t.value}
              type="button"
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

      <div className="flex-1 min-h-0 overflow-auto">
        {view === "LINE" ? (
          <LinePage
            refreshKey={refreshKey}
            onRefreshed={handleRefreshed}
            selectedLine={selectedLine}
          />
        ) : (
          <EnterPerformPage />
        )}
      </div>
    </div>
  );
};

export default PopPage;
