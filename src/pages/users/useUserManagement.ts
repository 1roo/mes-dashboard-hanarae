import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { instance } from "../../shared/axios/axios";
import { initialForm } from "./constants";
import { type NewUserForm, type User } from "./types";

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<NewUserForm>(initialForm);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await instance.get("/users");
        setUsers(res.data as User[]);
      } catch (err) {
        toast.error("사용자 목록을 불러오지 못했습니다.");
        console.error(err);
      }
    };

    getUsers();
  }, []);

  const onChange =
    (key: keyof NewUserForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const validate = () => {
    if (
      !form.employeeId ||
      !form.name ||
      !form.department ||
      !form.position ||
      !form.username ||
      !form.password ||
      !form.role
    ) {
      toast.error("필수 항목을 모두 입력/선택해주세요.");
      return false;
    }

    const isDupEmployeeId = users.some((u) => u.employeeId === form.employeeId);
    if (isDupEmployeeId) {
      toast.error("이미 존재하는 사번입니다.");
      return false;
    }

    const usernameTrimmed = form.username.trim();
    const isDupUsername = users.some((u) => u.username === usernameTrimmed);
    if (isDupUsername) {
      toast.error("이미 존재하는 아이디입니다.");
      return false;
    }

    if (usernameTrimmed.length < 4) {
      toast.error("아이디는 4자 이상 입력해주세요.");
      return false;
    }

    if (form.password.length < 8) {
      toast.error("비밀번호는 8자 이상 입력해주세요.");
      return false;
    }

    return true;
  };

  const onSave = async () => {
    if (!validate()) return;

    const payload = {
      employeeId: form.employeeId,
      name: form.name,
      department: form.department,
      position: form.position,
      username: form.username.trim(),
      password: form.password,
      role: form.role,
      status: "INACTIVE" as const,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    try {
      const res = await instance.post("/users", payload, {
        headers: { "Content-Type": "application/json" },
      });

      const created = res.data as User;
      setUsers((prev) => [...prev, created]);

      toast.success("저장되었습니다.");
      setForm(initialForm);
      setIsAddOpen(false);
    } catch (err) {
      toast.error("저장에 실패했습니다.");
      console.error(err);
    }
  };

  return {
    users,
    isAddOpen,
    setIsAddOpen,
    form,
    setForm,
    onChange,
    onSave,
  };
};
