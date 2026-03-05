import { useMemo } from "react";
import type { ProductionResult, WorkStatus } from "../type";

type Props = {
  productionResults: ProductionResult[];
};

const num = (v: number) => (Number.isFinite(v) ? v : 0);

const formatTime = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const getStatus = (r: ProductionResult): WorkStatus => {
  if (r.status) return r.status;
  if (r.endTime) return "COMPLETED";
  if (r.startTime) return "IN_PROGRESS";
  return "PENDING";
};

const dotClassByStatus = (status: WorkStatus) => {
  if (status === "COMPLETED") return "bg-green-400";
  if (status === "IN_PROGRESS") return "bg-blue-400";
  return "bg-yellow-400";
};

const History = ({ productionResults }: Props) => {
  const sorted = useMemo(() => {
    return [...productionResults].sort((a, b) => {
      const at = new Date(a.createdAt).getTime();
      const bt = new Date(b.createdAt).getTime();
      return bt - at;
    });
  }, [productionResults]);

  const summary = useMemo(() => {
    const totalProduced = sorted.reduce((s, r) => s + num(r.producedQty), 0);
    const totalDefect = sorted.reduce((s, r) => s + num(r.defectQty), 0);
    const defectRate =
      totalProduced > 0 ? (totalDefect / totalProduced) * 100 : 0;

    return {
      totalProduced,
      totalDefect,
      defectRate,
    };
  }, [sorted]);

  return (
    <div>
      <div className="flex items-center mb-3">
        <div className="w-1 h-3 bg-blue-400 mr-2" />
        <span className="font-bold">오늘 내 입력 히스토리</span>
      </div>

      <div className="space-y-4">
        {sorted.length === 0 && (
          <div className="text-slate-400 text-sm py-10 text-center">
            오늘 입력한 실적이 없습니다.
          </div>
        )}

        {sorted.map((r) => (
          <div key={r.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 text-slate-500 text-sm font-semibold">
                {formatTime(r.createdAt)}
              </div>

              <div className="flex items-start gap-3">
                <span
                  className={`w-2 h-2 rounded-full mt-2 ${dotClassByStatus(getStatus(r))}`}
                />
                <div className="leading-tight">
                  <div className="font-semibold">{r.productName}</div>
                  <div className="text-xs text-slate-500">{r.workOrderId}</div>
                </div>
              </div>
            </div>

            <div className="text-right leading-tight">
              <div className="font-extrabold text-lg">
                +{num(r.producedQty).toLocaleString("ko-KR")}{" "}
                <span className="text-sm font-bold text-slate-400">EA</span>
              </div>
              <div className="text-xs">
                <span
                  className={
                    r.defectQty === 0
                      ? "text-gray-400 font-bold"
                      : "text-red-400 font-bold"
                  }
                >
                  불량
                </span>{" "}
                <span className="text-slate-400 font-semibold">
                  {r.defectQty}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border border-slate-100 bg-white p-3 rounded-md shadow-sm">
        <div className="grid grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-extrabold text-emerald-400">
              {summary.totalProduced.toLocaleString("ko-KR")}
            </div>
            <div className="text-xs text-slate-400 mt-1">생산수량</div>
          </div>

          <div className="text-center border-x border-slate-700/60">
            <div className="text-2xl font-extrabold text-rose-400">
              {summary.totalDefect.toLocaleString("ko-KR")}
            </div>
            <div className="text-xs text-slate-400 mt-1">불량수량</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-extrabold text-amber-300">
              {summary.defectRate.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400 mt-1">불량률</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
