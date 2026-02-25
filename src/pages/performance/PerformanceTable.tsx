import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../shared/ui/table";

import type { Performance } from "./types";
import { formatDateTime } from "./constants";

type Props = {
  rows: Performance[];
  loading: boolean;
  nameByEmployeeId: Map<string, string>;
};

const PerformanceTable = ({ rows, loading, nameByEmployeeId }: Props) => {
  return (
    <div className="border rounded-sm overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-900 hover:bg-slate-900">
            <TableHead className="text-white font-bold">작업지시번호</TableHead>
            <TableHead className="text-white font-bold">제품명</TableHead>
            <TableHead className="text-white font-bold">생산수량</TableHead>
            <TableHead className="text-white font-bold">불량수량</TableHead>
            <TableHead className="text-white font-bold">시작일시</TableHead>
            <TableHead className="text-white font-bold">등록자</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={7} className="py-6 text-center text-gray-500">
                조회 중...
              </TableCell>
            </TableRow>
          )}

          {!loading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-6 text-center text-gray-500">
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            rows.map((r) => {
              const operatorName =
                nameByEmployeeId.get(r.operatorId) ?? "(알 수 없음)";

              return (
                <TableRow key={r.id}>
                  <TableCell className="font-semibold">
                    {r.workOrderId}
                  </TableCell>
                  <TableCell>{r.productName}</TableCell>
                  <TableCell>{r.producedQty}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {r.defectQty}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDateTime(r.startTime)}
                  </TableCell>
                  <TableCell className="max-w-24 truncate">
                    {operatorName}
                  </TableCell>
                  <TableCell />
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PerformanceTable;
