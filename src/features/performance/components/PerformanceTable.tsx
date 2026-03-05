import { useRef } from "react";
import Spinner from "../../../shared/ui/Spinner";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../shared/ui/Table";

import type { Performance } from "../../performance/types";
import { formatDateTime } from "../../performance/constants";
import { performanceExcel } from "../excel/performanceExcel";

type Props = {
  rows: Performance[];
  loading: boolean;
  nameByEmployeeId: Map<string, string>;
  onUpload: (data: Partial<Performance>[]) => void;
  onDownloadTemplate: () => void;
};

const PerformanceTable = ({
  rows,
  loading,
  nameByEmployeeId,
  onUpload,
  onDownloadTemplate,
}: Props) => {
  const { downloadExcel, uploadExcel } = performanceExcel;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalProducedQty = rows.reduce(
    (sum, r) => sum + (r.producedQty ?? 0),
    0,
  );
  const totalDefectQty = rows.reduce((sum, r) => sum + (r.defectQty ?? 0), 0);

  return (
    <div className="overflow-hidden">
      <div className="border border-gray-200 rounded-md bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-500">
              <TableHead className="text-white font-bold">
                작업지시번호
              </TableHead>
              <TableHead className="text-white font-bold">제품명</TableHead>
              <TableHead className="text-white font-bold text-right">
                생산수량
              </TableHead>
              <TableHead className="text-white font-bold text-right">
                불량수량
              </TableHead>
              <TableHead className="text-white font-bold text-center">
                시작시간
              </TableHead>
              <TableHead className="text-white font-bold text-center">
                담당자
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-6 text-center text-gray-500"
                >
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-6 text-center text-gray-500"
                >
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-semibold">
                    {r.workOrderId}
                  </TableCell>
                  <TableCell>{r.productName}</TableCell>
                  <TableCell className="text-right">
                    {(r.producedQty ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {(r.defectQty ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatDateTime(r.startTime)}
                  </TableCell>
                  <TableCell className="text-center">
                    {nameByEmployeeId.get(r.operatorId) || r.operatorId}
                  </TableCell>
                </TableRow>
              ))
            )}

            {!loading && rows.length > 0 && (
              <TableRow className="bg-gray-50 border-t">
                <TableCell className="font-bold text-gray-700" colSpan={2}>
                  합계 ({rows.length}건)
                </TableCell>
                <TableCell className="font-bold text-gray-900 text-right">
                  {totalProducedQty.toLocaleString()}
                </TableCell>
                <TableCell className="font-bold text-gray-900 text-right">
                  {totalDefectQty.toLocaleString()}
                </TableCell>
                <TableCell colSpan={3} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-2 p-2">
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
          type="button"
          onClick={onDownloadTemplate}
          className="text-xs font-bold text-gray-700 px-2 py-1 border border-gray-200 rounded-sm bg-white hover:bg-gray-50"
        >
          양식 다운로드
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs font-bold text-blue-600 px-2 py-1 border border-blue-200 rounded-sm bg-blue-50"
        >
          엑셀 업로드
        </button>

        <button
          type="button"
          onClick={() => downloadExcel(rows, nameByEmployeeId)}
          className="text-xs font-bold text-green-600 px-2 py-1 border border-green-200 rounded-sm bg-green-50"
        >
          엑셀 다운로드
        </button>
      </div>
    </div>
  );
};

export default PerformanceTable;