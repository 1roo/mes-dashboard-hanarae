import DashBoardChart from "./DashBoardChart";
import SummaryCards from "./SummaryCard";
import { useDashBoard } from "./useDashBoard";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../shared/ui/Table";

import { STATUS_CONFIG, STATUS_LEGEND } from "./constants";

const DashBoardPage = () => {
  const { summary, hourlyData, equipData, loading } = useDashBoard();

  return (
    <div className="p-4 bg-gray-50">
      <SummaryCards summary={summary} loading={loading} />

      <DashBoardChart hourlyData={hourlyData} />

      <section className="mt-5">
        <div className="w-full border border-gray-200 rounded-md p-5 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-700 font-bold text-sm">
              설비 가동 현황
            </span>

            <div className="flex items-center gap-4">
              {STATUS_LEGEND.map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`rounded-full ${l.dot} w-2 h-2`} />
                  <span className="text-xs text-gray-600 font-medium">
                    {l.label}
                  </span>
                </div>
              ))}
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
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-10 text-gray-500"
                    >
                      로딩중...
                    </TableCell>
                  </TableRow>
                ) : equipData.length === 0 ? (
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
                    const currentStatus =
                      STATUS_CONFIG[e.status as keyof typeof STATUS_CONFIG] ||
                      STATUS_CONFIG.STOPPED;

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
                            <div className="flex items-center">
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
