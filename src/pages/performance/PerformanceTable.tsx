import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../shared/ui/Table";

import type { Performance } from "./types";
import { formatDateTime } from "./constants";
import Spinner from "../../shared/ui/Spinner";

type Props = {
  rows: Performance[];
  loading: boolean;
  nameByEmployeeId: Map<string, string>;
};

const PerformanceTable = ({ rows, loading, nameByEmployeeId }: Props) => {
  const totalProducedQty = rows.reduce(
    (sum, r) => sum + (r.producedQty ?? 0),
    0,
  );
  const totalDefectQty = rows.reduce((sum, r) => sum + (r.defectQty ?? 0), 0);

  return (
    <div className="border border-gray-200 rounded-md  bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-500 text-white">
            <TableHead className="text-white font-bold">작업지시번호</TableHead>
            <TableHead className="text-white font-bold">제품명</TableHead>
            <TableHead className="text-white font-bold">생산수량</TableHead>
            <TableHead className="text-white font-bold">불량수량</TableHead>
            <TableHead className="text-white font-bold">시작일시</TableHead>
            <TableHead className="text-white font-bold">담당자</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={7} className="py-10">
                <Spinner />
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
                nameByEmployeeId.get(r.operatorId) || r.operatorId || "-";

              return (
                <TableRow key={r.id}>
                  <TableCell className="font-semibold">
                    {r.workOrderId}
                  </TableCell>
                  <TableCell>{r.productName}</TableCell>
                  <TableCell>{(r.producedQty ?? 0).toLocaleString()}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {(r.defectQty ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDateTime(r.startTime)}
                  </TableCell>
                  <TableCell className="max-w-24 truncate font-medium">
                    {operatorName}
                  </TableCell>
                  <TableCell />
                </TableRow>
              );
            })}

          {!loading && rows.length > 0 && (
            <TableRow className="bg-gray-50 border-t">
              <TableCell className="font-bold text-gray-700" colSpan={2}>
                합계
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (총 {rows.length.toLocaleString()}건)
                </span>
              </TableCell>
              <TableCell className="font-bold text-gray-900">
                {totalProducedQty.toLocaleString()}
              </TableCell>
              <TableCell className="font-bold text-gray-900">
                {totalDefectQty.toLocaleString()}
              </TableCell>
              <TableCell colSpan={3} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PerformanceTable;
