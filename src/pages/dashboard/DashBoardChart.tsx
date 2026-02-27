import { GroupedBarChart } from "../../shared/ui/GroupedBarChart";
import { TrendLineChart } from "../../shared/ui/TrendLineChart";
import type { HourlyProductionData } from "./type";
import { CHART_BADGES } from "./constants";

type Props = {
  hourlyData: HourlyProductionData[];
};

const DashBoardChart = ({ hourlyData }: Props) => {
  return (
    <section className="flex gap-4 mt-5">
      <div className="w-1/2 border border-gray-200 rounded-md p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-700 font-bold text-sm">
            시간별 생산 현황
          </span>
          <span
            className={`${CHART_BADGES.BAR.className} text-[10px] font-bold px-2 py-1 rounded`}
          >
            {CHART_BADGES.BAR.text}
          </span>
        </div>
        <GroupedBarChart data={hourlyData} />
      </div>

      <div className="w-1/2 border border-gray-200 rounded-md p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-700 font-bold text-sm">생산 추이</span>
          <span
            className={`${CHART_BADGES.LINE.className} text-[10px] font-bold px-2 py-1 rounded`}
          >
            {CHART_BADGES.LINE.text}
          </span>
        </div>
        <TrendLineChart data={hourlyData} />
      </div>
    </section>
  );
};

export default DashBoardChart;
