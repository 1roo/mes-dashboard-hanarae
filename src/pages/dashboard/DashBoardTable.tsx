import Spinner from "../../shared/ui/Spinner";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../shared/ui/Table";
import type { EquipmentData } from "./type";
import { STATUS_CONFIG, STATUS_LEGEND } from "./constants";

type Props = {
  equipData: EquipmentData[];
  loading: boolean;
};

const DashBoardTable = ({ equipData, loading }: Props) => {
  return (
    <section className="mt-1 w-full">
      <div className="w-full border border-gray-200 rounded-md p-5 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-5">
            <span className="text-gray-700 font-bold text-sm whitespace-nowrap">
              설비 가동 현황
            </span>
          </div>
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

        <div className="relative border rounded-sm border-gray-200">
          <div className="h-72 overflow-y-scroll overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 z-20 bg-gray-100">
                <TableRow>
                  <TableHead className="py-3 w-[30%] font-bold text-gray-700">
                    설비명
                  </TableHead>
                  <TableHead className="w-[20%] font-bold text-gray-700">
                    라인
                  </TableHead>
                  <TableHead className="w-[20%] font-bold text-gray-700 text-center">
                    상태
                  </TableHead>
                  <TableHead className="w-[30%] font-bold text-gray-700 text-center pr-10">
                    가동률
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-20 text-center">
                      <Spinner />
                    </TableCell>
                  </TableRow>
                ) : equipData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-20 text-gray-500"
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
                      <TableRow key={e.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-medium text-gray-800">
                          {e.equipmentName}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {e.line}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`flex items-center justify-center gap-2 ${currentStatus.color} rounded-xl px-2 py-1 mx-auto w-fit`}
                          >
                            <div
                              className={`rounded-full ${currentStatus.dot} w-2 h-2`}
                            />
                            <span
                              className={`text-xs font-bold ${currentStatus.textColor} whitespace-nowrap`}
                            >
                              {currentStatus.text}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="pr-10">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-50">
                              <div
                                className="bg-green-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                                style={{ width: `${e.operationRate}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-500 w-10 text-right">
                              {e.operationRate}%
                            </span>
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
      </div>
    </section>
  );
};

export default DashBoardTable;
