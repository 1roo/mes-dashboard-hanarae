import { GroupedBarChart } from "../../../../shared/ui/charts/GroupedBarChart";
import type { HourlyRow } from "../type";

type Props = {
  data: HourlyRow[];
};

const HourlyProduction = ({ data }: Props) => {
  const chartData = data.map(({ hour, planned, actual }) => ({
    hour,
    planned,
    actual,
  }));

  return (
    <section className="h-136 overflow-hidden bg-white p-3 rounded-md shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-bold">시간별 생산 현황</h3>
        <div className="text-xs text-slate-600 rounded-md bg-slate-300 px-2 py-1">
          오늘
        </div>
      </div>

      <div className="p-4 overflow-y-auto ">
        <GroupedBarChart
          data={chartData}
          showNowLine
          nowLineColor="#111827"
          nowLineDash="4 4"
        />
      </div>
    </section>
  );
};

export default HourlyProduction;
