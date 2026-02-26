import React from "react";
import { departments, positions } from "./constants";
import { type NewUserForm } from "./types";

type Props = {
  form: NewUserForm;
  onChange: (
    key: keyof NewUserForm,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
};

const AddUserForm = ({ form, onChange, onSave }: Props) => {
  return (
    <div className="mt-4">
      <div className="bg-gray-200 p-1 flex justify-between items-center font-bold px-2">
        신규 계정 등록
      </div>

      <div className="w-2/3 py-3 flex justify-between">
        <div className="flex flex-col">
          <label className="font-bold">사번 *</label>
          <input
            type="number"
            required
            value={form.employeeId}
            onChange={onChange("employeeId")}
            className="border rounded-sm border-gray-200 h-8 px-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold">이름 *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={onChange("name")}
            className="border rounded-sm border-gray-200 h-8 px-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold">부서 *</label>
          <select
            required
            value={form.department}
            onChange={onChange("department")}
            className="border rounded-sm border-gray-200 h-8 px-2"
          >
            <option value="" disabled>
              선택
            </option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-bold">직급 *</label>
          <select
            required
            value={form.position}
            onChange={onChange("position")}
            className="border rounded-sm border-gray-200 h-8 px-2"
          >
            <option value="" disabled>
              선택
            </option>
            {positions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="py-3 flex justify-between items-end">
        <div className="flex flex-col">
          <label className="font-bold">아이디 *</label>
          <input
            type="text"
            required
            value={form.username}
            onChange={onChange("username")}
            className="border rounded-sm border-gray-200 w-40 h-8 px-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold">비밀번호 *</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={onChange("password")}
            className="border rounded-sm border-gray-200 h-8 px-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold">권한 *</label>
          <select
            required
            value={form.role}
            onChange={onChange("role")}
            className="border rounded-sm border-gray-200 h-8 px-2"
          >
            <option value="" disabled>
              선택
            </option>
            <option value="ADMIN">관리자</option>
            <option value="USER">일반</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onSave}
          className="rounded-sm bg-blue-600 text-white font-bold text-xl w-20 px-4 py-1 hover:bg-blue-400"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default AddUserForm;
