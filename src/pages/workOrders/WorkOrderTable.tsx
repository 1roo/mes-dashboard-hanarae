import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../shared/ui/Table";

import type { WorkOrder } from "./types";
import { statusLabel } from "./constants";

type Props = {
  loading: boolean;
  rows: WorkOrder[];
  showEmpty: boolean;
  children?: React.ReactNode;
};

const WorkOrderTable = ({ loading, rows, showEmpty, children }: Props) => {
  const fmt = (n: number | null | undefined) => (n ?? 0).toLocaleString();
  const totalPlannedQty = rows.reduce((sum, r) => sum + (r.plannedQty ?? 0), 0);

  return (
    <div className="border border-gray-200 rounded-md  bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-500 text-white">
            <TableHead className="text-white font-bold">작업지시번호</TableHead>
            <TableHead className="text-white font-bold">제품명</TableHead>
            <TableHead className="text-white font-bold">계획수량</TableHead>
            <TableHead className="text-white font-bold">지시일</TableHead>
            <TableHead className="text-white font-bold whitespace-nowrap">
              상태
            </TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={6} className="py-6 text-center text-gray-500">
                조회 중...
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            rows.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-semibold">{u.id}</TableCell>
                <TableCell>{u.productName}</TableCell>
                <TableCell>{fmt(u.plannedQty)}</TableCell>
                <TableCell>{u.startDate}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {statusLabel[u.status]}
                </TableCell>
                <TableCell />
              </TableRow>
            ))}

          {children}

          {!loading && showEmpty && (
            <TableRow>
              <TableCell colSpan={6} className="py-6 text-center text-gray-500">
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          )}

          {!loading && rows.length > 0 && (
            <TableRow className="bg-gray-50 border-t">
              <TableCell className="font-bold text-gray-700" colSpan={2}>
                합계
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (총 {rows.length.toLocaleString()}건)
                </span>
              </TableCell>
              <TableCell className="font-bold text-gray-900">
                {totalPlannedQty.toLocaleString()}
              </TableCell>

              <TableCell colSpan={3} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkOrderTable;
