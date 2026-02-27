import React, { useRef } from "react";
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
import { useExcel } from "./useExcel";
import Spinner from "../../shared/ui/Spinner";

type Props = {
  loading: boolean;
  rows: WorkOrder[];
  showEmpty: boolean;
  children?: React.ReactNode;
  onUpload: (data: Partial<WorkOrder>[]) => void;
};

const WorkOrderTable = ({
  loading,
  rows,
  showEmpty,
  children,
  onUpload,
}: Props) => {
  const { downloadExcel, uploadExcel } = useExcel();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalPlannedQty = rows.reduce((sum, r) => sum + (r.plannedQty ?? 0), 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="border border-gray-200 rounded-md bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-500 hover:bg-gray-500">
              <TableHead className="text-white font-bold text-center">
                작업지시번호
              </TableHead>
              <TableHead className="text-white font-bold text-center">
                제품명
              </TableHead>
              <TableHead className="text-white font-bold text-center">
                계획수량
              </TableHead>
              <TableHead className="text-white font-bold text-center">
                지시일
              </TableHead>
              <TableHead className="text-white font-bold text-center">
                상태
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-6 text-center text-gray-500"
                >
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-semibold text-center">
                    {u.id}
                  </TableCell>
                  <TableCell className="text-center">{u.productName}</TableCell>
                  <TableCell className="text-center">
                    {u.plannedQty.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">{u.startDate}</TableCell>
                  <TableCell className="text-center">
                    {statusLabel[u.status]}
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))
            )}
            {children}
            {showEmpty && rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-6 text-center text-gray-500"
                >
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}

            {!loading && rows.length > 0 && (
              <TableRow className="bg-gray-50 border-t">
                <TableCell
                  className="font-bold text-gray-700 text-left pl-32"
                  colSpan={2}
                >
                  합계 ({rows.length}건)
                </TableCell>
                <TableCell className="font-bold text-gray-900 text-center">
                  {totalPlannedQty.toLocaleString()}
                </TableCell>

                <TableCell colSpan={4} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-2">
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept=".xlsx,.xls"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const data = await uploadExcel(file);
              onUpload(data);
              e.target.value = "";
            }
          }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-xs font-bold text-blue-600 px-2 py-1 border border-blue-200 rounded-sm bg-blue-50"
        >
          엑셀 업로드
        </button>
        <button
          onClick={() => downloadExcel(rows)}
          className="text-xs font-bold text-green-600 px-2 py-1 border border-green-200 rounded-sm bg-green-50"
        >
          엑셀 다운로드
        </button>
      </div>
    </div>
  );
};

export default WorkOrderTable;
