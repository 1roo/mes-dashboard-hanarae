import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { instance } from "../../shared/axios/axios";
import { initialForm, PAGE_SIZE } from "./constants";
import { type NewUserForm, type User } from "./types";

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<NewUserForm>(initialForm);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await instance.get("/users");
        setUsers(res.data as User[]);
      } catch (err) {
        setError("사용자 목록을 불러오지 못했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
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

    setIsLoading(true);
    setError(null);

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

      setUsers((prev) => {
        const next = [...prev, created];
        return next;
      });

      toast.success("저장되었습니다.");
      setForm(initialForm);
      setIsAddOpen(false);
    } catch (err) {
      setError("저장에 실패했습니다.");
      console.error(err);
      toast.error("저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  }, [users.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const pagedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return users.slice(start, end);
  }, [users, page]);

  return {
    // data
    users,
    pagedUsers,

    // pagination
    page,
    setPage,
    totalPages,

    // ui/form
    isAddOpen,
    setIsAddOpen,
    form,
    setForm,
    onChange,
    onSave,

    // status
    isLoading,
    error,
  };
};
