import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { instance } from "../../shared/axios/axios";
import { setSaveLogin } from "./loginStorage";

export type DbUser = {
  id: number | string;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  username: string;
  password: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
};

export const useLogin = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await instance.post("/auth/login", {
        username: id.trim(),
        password: pw,
      });

      const user = res.data as DbUser | null;

      if (!user) {
        toast.error("아이디 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      if (user.status !== "ACTIVE") {
        toast.error("비활성화된 계정입니다.");
        return;
      }

      setSaveLogin(keepLogin);

      const defaultPath = "/dashboard";
      const from =
        (location.state as { from?: string } | null)?.from || defaultPath;

      login(
        {
          id: user.username,
          role: user.role,
        },
        keepLogin,
      );

      navigate(from, { replace: true });
    } catch (err) {
      toast.error("서버 통신에 실패했습니다.");
      console.error(err);
    }
  };

  return {
    id,
    setId,
    pw,
    setPw,
    keepLogin,
    setKeepLogin,
    onSubmit,
  };
};
