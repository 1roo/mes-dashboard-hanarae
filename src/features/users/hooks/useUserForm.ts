import { useState } from "react";
import toast from "react-hot-toast";
import { initialForm } from "../constants";
import type { NewUserForm } from "../types";
import type { User } from "../../../shared/types";

export type ValidNewUserForm = {
  employeeId: string;
  name: string;
  department: User["department"];
  position: User["position"];
  username: string;
  password: string;
  role: User["role"];
};

export function isValidNewUserForm(
  form: NewUserForm,
): form is ValidNewUserForm {
  return (
    !!form.employeeId &&
    !!form.name &&
    form.department !== "" &&
    form.position !== "" &&
    !!form.username &&
    !!form.password &&
    form.role !== ""
  );
}

export const useUserForm = (users: User[]) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<NewUserForm>(initialForm);

  const onChange =
    (key: keyof NewUserForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const reset = () => setForm(initialForm);

  const validateCreate = () => {
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

  return {
    isAddOpen,
    setIsAddOpen,
    form,
    setForm,
    onChange,
    reset,
    validateCreate,
  };
};
