import WorkOrderCard from "./WorkOrderCard";
import type { WorkOrder, LineValue } from "./type";

const orderByStatus = (s: WorkOrder["status"]) => {
  if (s === "IN_PROGRESS") return 0;
  if (s === "PENDING") return 1;
  return 2;
};

type Props = {
  rows: WorkOrder[];
  selectedLine: LineValue;
};

const WorkOrderPanel = ({ rows, selectedLine }: Props) => {
  const visible = rows
    .filter((r) => r.status !== "COMPLETED")
    .slice()
    .sort((a, b) => orderByStatus(a.status) - orderByStatus(b.status));

  return (
    <section className="h-full min-h-0 bg-white p-3 rounded-md shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-slate-800/70">
        <h3 className="text-sm font-bold">현재 작업지시</h3>

        <div className="text-xs text-slate-600 rounded-md bg-slate-300 px-2 py-1 min-h-0">
          {selectedLine}
        </div>
      </div>

      <div className="p-4 overflow-y-auto flex-1 min-h-0">
        {visible.length === 0 ? (
          <div className="text-slate-400 text-sm">
            진행중/대기 작업지시가 없습니다.
          </div>
        ) : (
          visible.map((row) => <WorkOrderCard key={row.id} row={row} />)
        )}
      </div>
    </section>
  );
};

export default WorkOrderPanel;
