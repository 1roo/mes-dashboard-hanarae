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
    .filter((r) => r.status !== "COMPLETED") // 완료 제외
    .slice()
    .sort((a, b) => orderByStatus(a.status) - orderByStatus(b.status)); // 진행중 먼저

  return (
    <section className="bg-white p-3 rounded-md shadow-sm ">
      <div className="flex items-center justify-between px-4 py-3  border-slate-800/70">
        <h3 className="text-sm font-bold ">현재 작업지시</h3>

        <div className="text-xs text-slate-600  rounded-md bg-slate-300 px-2 py-1">
          {selectedLine}
        </div>
      </div>

      <div className="p-4 space-y-3">
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
