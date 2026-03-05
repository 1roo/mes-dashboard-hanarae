import type { WorkOrder } from "./type";

const formatNumber = (v: number) => Number(v ?? 0).toLocaleString("ko-KR");
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const WorkOrderCard = ({ row }: { row: WorkOrder }) => {
  const planned = Number(row.plannedQty ?? 0);
  const completed = Number(row.completedQty ?? 0);
  const remaining = Math.max(planned - completed, 0);
  const rate = planned <= 0 ? 0 : clamp((completed / planned) * 100, 0, 100);

  const isProgress = row.status === "IN_PROGRESS";
  const isPending = row.status === "PENDING";

  return (
    <div
      className={[
        "rounded-xl p-4 border mb-3",
        isProgress ? " border-blue-500/70" : " border-slate-400/60 opacity-70",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-slate-500 text-xs">{row.id}</div>
          <div className="text-slate-600 text-lg font-extrabold mt-1">
            {row.productName}
          </div>
        </div>

        <span
          className={[
            "px-3 py-1 rounded-full text-xs font-bold",
            isProgress
              ? "bg-blue-600 text-white"
              : "bg-slate-700 text-slate-200",
          ].join(" ")}
        >
          {isProgress ? "진행중" : isPending ? "대기" : "완료"}
        </span>
      </div>

      {isProgress && (
        <>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div>
              <div className="text-slate-500 text-xs">계획</div>
              <div className="text-violet-400 text-xl font-extrabold">
                {formatNumber(planned)}
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-xs">완료</div>
              <div className="text-blue-400 text-xl font-extrabold">
                {formatNumber(completed)}
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-xs">잔여</div>
              <div className="text-slate-400 text-xl font-extrabold">
                {formatNumber(remaining)}
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="w-full bg-slate-500/70 rounded-full h-2.5">
              <div
                className="bg-blue-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${rate.toFixed(1)}%` }}
              />
            </div>
            <div className="text-blue-300 font-bold mt-2">
              {rate.toFixed(1)}%
            </div>
          </div>
        </>
      )}

      {isPending && (
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <div className="text-slate-500 text-xs">계획</div>
            <div className="text-slate-400 text-xl font-extrabold">
              {formatNumber(planned)}
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">시작예정</div>
            <div className="text-slate-400 text-xl font-extrabold">
              {row.startDate ?? "-"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrderCard;
