import { useEffect, useState } from "react";
import { instance } from "../../shared/axios/axios";
import { CircularProgress } from "../../shared/ui/DonutChart";
import { GroupedBarChart } from "../../shared/ui/GroupedBarChart";
import { TrendLineChart } from "../../shared/ui/TrendLineChart";

type DashboardSummary = {
  id: string;
  date: string;
  plannedQty: number;
  actualQty: number;
  achievementRate: number;
  defectRate: number;
  activeEquipment: number;
  totalEquipment: number;
};

type HourlyProductionData = {
  id: string;
  hour: string;
  planned: number;
  actual: number;
};

const DashBoardPage = () => {
  const [summaryData, setSummaryData] = useState<DashboardSummary[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyProductionData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resSum, resHourly] = await Promise.all([
          instance.get<DashboardSummary[]>("/dashboardSummary"),
          instance.get<HourlyProductionData[]>("/hourlyProduction"),
        ]);
        setSummaryData(resSum.data);
        setHourlyData(resHourly.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  const sData = summaryData[0];

  return (
    <div className="p-4">
      <style>{`
        @keyframes fillProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-fill {
          animation: fillProgress 1s ease-out forwards;
        }
      `}</style>

      <section className="grid grid-cols-4 gap-4">
        <article className="border border-violet-600 rounded-sm p-3">
          <span className="text-sm text-gray-500">생산계획</span>
          <p className="text-xl font-bold text-violet-600">
            {sData?.plannedQty?.toLocaleString() || 0}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-7 overflow-hidden">
            <div className="bg-violet-600 h-3 rounded-full w-0 animate-fill"></div>
          </div>
        </article>

        <article className="border border-blue-600 rounded-sm p-3">
          <span className="text-sm text-gray-500">실 생산</span>
          <p className="text-xl font-bold text-blue-600">
            {sData?.actualQty?.toLocaleString() || 0}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3  mt-7">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${sData?.plannedQty ? (sData.actualQty / sData.plannedQty) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </article>

        <article className="border border-green-600 rounded-sm p-3 flex flex-col items-center">
          <div className="w-full text-left">
            <span className="text-sm text-gray-500">달성률</span>
            <p className="text-xl font-bold text-green-600">
              {sData?.achievementRate || 0}%
            </p>
          </div>
          <CircularProgress
            rate={sData?.achievementRate || 0}
            color="#16a34a"
          />
        </article>

        <article className="border border-red-600 rounded-sm p-3 flex flex-col items-center">
          <div className="w-full text-left">
            <span className="text-sm text-gray-500">불량률</span>
            <p className="text-xl font-bold text-red-600">
              {sData?.defectRate || 0}%
            </p>
          </div>
          <CircularProgress rate={sData?.defectRate || 0} color="#dc2626" />
        </article>
      </section>
      <section className="flex gap-4 mt-5">
        {/* 왼쪽: 바 그래프 */}
        <div className="w-1/2 border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-semibold text-sm">
              시간별 생산 현황
            </span>
            <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded">
              BAR CHART
            </span>
          </div>
          <GroupedBarChart data={hourlyData} />
        </div>

        {/* 오른쪽: 라인 그래프 */}
        <div className="w-1/2 border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-semibold text-sm">
              생산 추이
            </span>
            <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded uppercase">
              Line Chart
            </span>
          </div>
          <TrendLineChart data={hourlyData} />
        </div>
      </section>
    </div>
  );
};

export default DashBoardPage;
