import { useEffect, useState } from "react";
import { instance } from "../../shared/axios/axios";
import { CircularProgress } from "../../shared/ui/DonutChart";
import { GroupedBarChart } from "../../shared/ui/GroupedBarChart";
import { TrendLineChart } from "../../shared/ui/TrendLineChart";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../shared/ui/Table";

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

type EquipmentData = {
  id: string;
  equipmentCode: string;
  equipmentName: string;
  line: string;
  status: "RUNNING" | "MAINTENANCE" | "STOPPED";
  operationRate: number;
};

const DashBoardPage = () => {
  const [summaryData, setSummaryData] = useState<DashboardSummary[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyProductionData[]>([]);
  const [equipData, setEquipData] = useState<EquipmentData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resSum, resHourly, resEquip] = await Promise.all([
          instance.get<DashboardSummary[]>("/dashboardSummary"),
          instance.get<HourlyProductionData[]>("/hourlyProduction"),
          instance.get<EquipmentData[]>("/equipment"),
        ]);
        setSummaryData(resSum.data);
        setHourlyData(resHourly.data);
        setEquipData(resEquip.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const sData = summaryData[0];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
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
        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <span className="text-sm text-gray-500 font-medium">생산계획</span>
          <p className="text-2xl font-bold text-violet-600 mt-1">
            {sData?.plannedQty?.toLocaleString() || 0}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-7 overflow-hidden">
            <div className="bg-violet-600 h-full rounded-full w-0 animate-fill"></div>
          </div>
        </article>

        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <span className="text-sm text-gray-500 font-medium">실 생산</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {sData?.actualQty?.toLocaleString() || 0}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-7">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-1000"
              style={{
                width: `${sData?.plannedQty ? (sData.actualQty / sData.plannedQty) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </article>

        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm flex flex-col items-center">
          <div className="w-full text-left mb-2">
            <span className="text-sm text-gray-500 font-medium">달성률</span>
          </div>
          <CircularProgress
            rate={sData?.achievementRate || 0}
            color="#16a34a"
          />
        </article>

        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm flex flex-col items-center">
          <div className="w-full text-left mb-2">
            <span className="text-sm text-gray-500 font-medium">불량률</span>
          </div>
          <CircularProgress rate={sData?.defectRate || 0} color="#dc2626" />
        </article>
      </section>

      <section className="flex gap-4 mt-5">
        <div className="w-1/2 border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-700 font-bold text-sm">
              시간별 생산 현황
            </span>
            <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded">
              BAR CHART
            </span>
          </div>
          <GroupedBarChart data={hourlyData} />
        </div>
        <div className="w-1/2 border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-700 font-bold text-sm">생산 추이</span>
            <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded uppercase">
              Line Chart
            </span>
          </div>
          <TrendLineChart data={hourlyData} />
        </div>
      </section>

      <section className="mt-5">
        <div className="w-full border border-gray-200 rounded-md p-5 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-700 font-bold text-sm">
              설비 가동 현황
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="rounded-full bg-green-500 w-2 h-2" />
                <span className="text-xs text-gray-600 font-medium">
                  가동중
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="rounded-full bg-yellow-500 w-2 h-2" />
                <span className="text-xs text-gray-600 font-medium">
                  점검중
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="rounded-full bg-red-500 w-2 h-2" />
                <span className="text-xs text-gray-600 font-medium">
                  비가동
                </span>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="py-3">설비명</TableHead>
                  <TableHead>라인</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-center pr-10">가동률</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {equipData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-10 text-gray-500"
                    >
                      표시할 데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  equipData.map((e) => {
                    const statusConfig = {
                      RUNNING: { color: "bg-green-500", text: "가동중" },
                      MAINTENANCE: { color: "bg-yellow-500", text: "점검중" },
                      STOPPED: { color: "bg-red-500", text: "비가동" },
                    };
                    const currentStatus =
                      statusConfig[e.status] || statusConfig.STOPPED;

                    return (
                      <TableRow
                        key={e.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-800">
                          {e.equipmentName}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {e.line}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`flex items-center justify-center gap-2 ${currentStatus.color} rounded-xl px-2 py-1 w-fit`}
                          >
                            <span className="text-xs font-bold text-white whitespace-nowrap">
                              {currentStatus.text}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="pr-10">
                          <div className="flex flex-col gap-1.5 min-w-30">
                            <div className="flex justify-end items-center">
                              <div className="w-2/3 bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-50">
                                <div
                                  className="bg-green-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                                  style={{ width: `${e.operationRate}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-gray-400 ml-5">
                                {e.operationRate}%
                              </span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashBoardPage;
