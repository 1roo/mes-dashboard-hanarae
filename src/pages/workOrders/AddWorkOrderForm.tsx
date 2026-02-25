import React from "react";
import { TableRow, TableCell } from "../../shared/ui/table";
import type { NewWorkOrderForm } from "./types";

type Props = {
  newForm: NewWorkOrderForm;
  onChangeNewForm: (
    key: keyof NewWorkOrderForm,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveNew: () => void;
  onCancelNew: () => void;
};

const AddWorkOrderForm = ({
  newForm,
  onChangeNewForm,
  onSaveNew,
  onCancelNew,
}: Props) => {
  return (
    <TableRow className="bg-blue-50">
      <TableCell className="p-2">
        <input
          value={newForm.id}
          onChange={onChangeNewForm("id")}
          placeholder="WO-2024-013"
          className="w-full border border-blue-400 px-2 py-1 rounded-sm bg-white"
        />
      </TableCell>

      <TableCell className="p-2">
        <input
          value={newForm.productName}
          onChange={onChangeNewForm("productName")}
          placeholder="제품명"
          className="w-full border border-blue-400 px-2 py-1 rounded-sm bg-white"
        />
      </TableCell>

      <TableCell className="p-2">
        <input
          value={newForm.plannedQty}
          onChange={onChangeNewForm("plannedQty")}
          type="number"
          placeholder="0"
          className="w-full border border-blue-400 px-2 py-1 rounded-sm bg-white"
        />
      </TableCell>

      <TableCell className="p-2">
        <input
          value={newForm.startDate}
          onChange={onChangeNewForm("startDate")}
          type="date"
          className="w-full border border-blue-400 px-2 py-1 rounded-sm bg-white"
        />
      </TableCell>

      <TableCell className="p-2 text-gray-600 font-semibold">대기</TableCell>

      <TableCell className="p-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveNew}
            className="px-3 py-1 rounded-sm bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            저장
          </button>

          <button
            type="button"
            onClick={onCancelNew}
            className="px-3 py-1 rounded-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AddWorkOrderForm;
