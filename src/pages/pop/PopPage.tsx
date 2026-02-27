import { useState } from "react";
import LinePage from "./pages/LinePage";
import PerformPage from "./pages/PerformPage";

type View = "LINE" | "PERFORM";

const PopPage = () => {
  const [view, setView] = useState<View>("LINE");

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setView("LINE")}
          className={`w-20 ${view === "LINE" ? "border-b" : ""}`}
        >
          현황판
        </button>

        <button
          type="button"
          onClick={() => setView("PERFORM")}
          className={`w-20 ml-5 ${view === "PERFORM" ? "border-b" : ""}`}
        >
          실적입력
        </button>
      </div>

      {view === "LINE" ? <LinePage /> : <PerformPage />}
    </div>
  );
};

export default PopPage;
