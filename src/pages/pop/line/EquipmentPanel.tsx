import type { Equipment, LineValue } from "./type";

type Props = {
  rows: Equipment[];
  selectedLine: LineValue;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const isRunning = (s: Equipment["status"]) => s === "RUNNING";

const EquipmentPanel = ({ rows, selectedLine }: Props) => {
  const lineRows = rows.filter((r) => r.line === selectedLine);

  const runningCount = lineRows.filter((r) => isRunning(r.status)).length;
  const downCount = lineRows.length - runningCount;

  const avgRate =
    lineRows.length === 0
      ? 0
      : lineRows.reduce((acc, r) => acc + Number(r.operationRate ?? 0), 0) /
        lineRows.length;

  return (
    <section className="h-full min-h-0 bg-white p-3 rounded-md shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 mb-5">
        <h3 className="text-sm font-bold">설비 가동 현황</h3>
        <div className="text-xs text-slate-600 rounded-md bg-slate-300 px-2 py-1 ">
          {selectedLine}
        </div>
      </div>

      {/* 설비 카드 2열 */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-3">
        {lineRows.map((eq) => {
          const running = isRunning(eq.status);
          const rate = clamp(Number(eq.operationRate ?? 0), 0, 100);

          return (
            <div
              key={eq.id}
              className={[
                "rounded-xl p-3 border shadow-sm",
                running ? "border-slate-200" : "border-red-300",
                "bg-slate-50",
              ].join(" ")}
            >
              <div className="text-slate-800 font-extrabold">
                {eq.equipmentName}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span
                  className={[
                    "inline-block w-2 h-2 rounded-full",
                    running ? "bg-green-500" : "bg-red-500",
                  ].join(" ")}
                />
                <span
                  className={[
                    "font-bold",
                    running ? "text-green-600" : "text-red-500",
                  ].join(" ")}
                >
                  {running ? "가동중" : "비가동"}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={[
                      "h-full rounded-full",
                      running ? "bg-green-500" : "bg-slate-400",
                    ].join(" ")}
                    style={{ width: `${rate.toFixed(1)}%` }}
                  />
                </div>
                <div
                  className={[
                    "text-xs font-bold w-10 text-right",
                    running ? "text-slate-600" : "text-red-500",
                  ].join(" ")}
                >
                  {rate.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}

        {lineRows.length === 0 && (
          <div className="col-span-2 text-sm text-slate-400">
            설비 데이터가 없습니다.
          </div>
        )}
      </div>

      {/* 하단 요약 (3칸) */}
      <div className="mx-4 mb-4 rounded-xl bg-slate-100 border border-slate-200 grid grid-cols-3 text-center py-3">
        <div>
          <div className="text-3xl font-extrabold text-green-600">
            {runningCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">가동중</div>
        </div>

        <div className="border-x border-slate-200">
          <div className="text-3xl font-extrabold text-red-500">
            {downCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">비가동</div>
        </div>

        <div>
          <div className="text-3xl font-extrabold text-amber-500">
            {avgRate.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">평균가동률</div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentPanel;
