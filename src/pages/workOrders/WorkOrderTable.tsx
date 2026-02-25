import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../shared/ui/table";

import type { WorkOrder } from "./types";
import { statusLabel } from "./constants";

type Props = {
  loading: boolean;
  rows: WorkOrder[];
  showEmpty: boolean;
  children?: React.ReactNode;
};

const WorkOrderTable = ({ loading, rows, showEmpty, children }: Props) => {
  return (
    <div className="border rounded-sm overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-900 hover:bg-slate-900">
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
                <TableCell>{u.plannedQty}</TableCell>
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
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkOrderTable;
