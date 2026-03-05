import React from "react";
import { departments, positions } from "../../../features/users/constants";
import { type NewUserForm } from "../../../features/users/types";

type Props = {
  form: NewUserForm;
  onChange: (
    key: keyof NewUserForm,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
};

const labelClass = "text-xs font-semibold text-gray-600";
const inputClass =
  "h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const selectClass = inputClass;

const AddUserForm = ({ form, onChange, onSave }: Props) => {
  return (
    <section className="mt-4 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-800">신규 계정 등록</h3>
        <span className="text-xs text-gray-500">* 필수 입력</span>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <label className={labelClass}>사번 *</label>
            <input
              type="number"
              required
              value={form.employeeId}
              onChange={onChange("employeeId")}
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>이름 *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={onChange("name")}
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>부서 *</label>
            <select
              required
              value={form.department}
              onChange={onChange("department")}
              className={selectClass}
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

          <div className="space-y-1">
            <label className={labelClass}>직급 *</label>
            <select
              required
              value={form.position}
              onChange={onChange("position")}
              className={selectClass}
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-end">
          <div className="space-y-1 md:col-span-1">
            <label className={labelClass}>아이디 *</label>
            <input
              type="text"
              required
              value={form.username}
              onChange={onChange("username")}
              className={inputClass}
            />
          </div>

          <div className="space-y-1 md:col-span-1">
            <label className={labelClass}>비밀번호 *</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={onChange("password")}
              className={inputClass}
            />
          </div>

          <div className="space-y-1 md:col-span-1">
            <label className={labelClass}>권한 *</label>
            <select
              required
              value={form.role}
              onChange={onChange("role")}
              className={selectClass}
            >
              <option value="" disabled>
                선택
              </option>
              <option value="ADMIN">관리자</option>
              <option value="USER">일반</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <button
              type="button"
              onClick={onSave}
              className="h-10 w-full rounded-md bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 active:scale-[0.99]"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddUserForm;
