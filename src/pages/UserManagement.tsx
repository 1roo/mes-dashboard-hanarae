import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

type User = {
  id: number;
  employeeId: string;
  name: string;
  department: "생산팀" | "품질팀" | "설비팀";
  position: "사원" | "주임" | "대리";
  username: string;
  password: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
};

type NewUserForm = {
  employeeId: string;
  name: string;
  department: "" | User["department"];
  position: "" | User["position"];
  username: string;
  password: string;
  role: "" | User["role"];
};

const departments: User["department"][] = ["생산팀", "품질팀", "설비팀"];
const positions: User["position"][] = ["사원", "주임", "대리"];

const initialForm: NewUserForm = {
  employeeId: "",
  name: "",
  department: "",
  position: "",
  username: "",
  password: "",
  role: "",
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<NewUserForm>(initialForm);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("http://localhost:3001/users");
      const data: User[] = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const role = localStorage.getItem("role");
  if (role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  const onChange =
    (key: keyof NewUserForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const onSave = async () => {
    if (
      !form.employeeId ||
      !form.name ||
      !form.department ||
      !form.position ||
      !form.username ||
      !form.password ||
      !form.role
    ) {
      alert("필수 항목을 모두 입력/선택해주세요.");
      return;
    }

    const isDupEmployeeId = users.some((u) => u.employeeId === form.employeeId);
    if (isDupEmployeeId) {
      alert("이미 존재하는 사번입니다.");
      return;
    }

    const usernameTrimmed = form.username.trim();
    const isDupUsername = users.some((u) => u.username === usernameTrimmed);
    if (isDupUsername) {
      alert("이미 존재하는 아이디입니다.");
      return;
    }

    if (usernameTrimmed.length < 4) {
      alert("아이디는 4자 이상 입력해주세요.");
      return;
    }

    if (form.password.length < 8) {
      alert("비밀번호는 8자 이상 입력해주세요.");
      return;
    }

    const payload = {
      employeeId: form.employeeId,
      name: form.name,
      department: form.department,
      position: form.position,
      username: usernameTrimmed,
      password: form.password,
      role: form.role,
      status: "INACTIVE" as const,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const res = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("저장에 실패했습니다.");
      return;
    }

    const created: User = await res.json();
    setUsers((prev) => [...prev, created]);

    setForm(initialForm);
    setIsAddOpen(false);
  };

  return (
    <div className="w-2/3 mx-auto">
      <div className="bg-gray-950 p-3 flex justify-between items-center">
        <span className="text-white font-bold text-2xl">계정 관리</span>
        <button
          type="button"
          onClick={() => setIsAddOpen((p) => !p)}
          className="rounded-sm bg-violet-600 text-white font-bold text-xl px-4 py-2"
        >
          + 계정 추가
        </button>
      </div>

      {/* 표 */}
      <div className="border border-gray-200">
        <div className="grid grid-cols-6 bg-gray-700 text-white font-semibold px-4 py-2">
          <div>사번</div>
          <div>이름</div>
          <div>부서</div>
          <div>직급</div>
          <div>권한</div>
          <div>상태</div>
        </div>

        {users.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-6 px-4 py-3 border-t border-gray-200"
          >
            <div>{u.employeeId}</div>
            <div>{u.name}</div>
            <div>{u.department}</div>
            <div>{u.position}</div>
            <div className="text-gray-500 font-semibold">
              {u.role === "ADMIN" ? "관리자" : "일반"}
            </div>
            <div
              className={
                u.status === "ACTIVE"
                  ? "text-green-600 font-bold"
                  : "text-gray-400 font-bold"
              }
            >
              {u.status === "ACTIVE" ? "활성" : "비활성"}
            </div>
          </div>
        ))}
      </div>

      {/* 신규 계정 등록 */}
      {isAddOpen && (
        <div className="mt-4">
          <div className="bg-gray-200 p-1 flex justify-between items-center font-bold px-2">
            신규 계정 등록
          </div>

          <div className="py-3 flex justify-between gap-4">
            <div className="flex flex-col">
              <label className="font-bold">사번 *</label>
              <input
                type="number"
                required
                value={form.employeeId}
                onChange={onChange("employeeId")}
                className="border rounded-sm border-gray-200 w-40 h-8 px-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-bold">이름 *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={onChange("name")}
                className="border rounded-sm border-gray-200 w-38 h-8 px-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-bold">부서 *</label>
              <select
                required
                value={form.department}
                onChange={onChange("department")}
                className="border rounded-sm border-gray-200 w-38 h-8 px-2"
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
                className="border rounded-sm border-gray-200 w-38 h-8 px-2"
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

          <div className="py-3 flex justify-between gap-4 items-end">
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
                className="border rounded-sm border-gray-200 w-38 h-8 px-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-bold">권한 *</label>
              <select
                required
                value={form.role}
                onChange={onChange("role")}
                className="border rounded-sm border-gray-200 w-38 h-8 px-2"
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
              className="rounded-sm bg-violet-600 text-white font-bold text-xl w-24 px-4 py-2"
            >
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
