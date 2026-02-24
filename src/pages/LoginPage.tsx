import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

type DbUser = {
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

const LoginPage = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const saveLogin = localStorage.getItem("saveLogin") === "true";
  if (saveLogin) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:3001/users?username=${encodeURIComponent(
        id.trim()
      )}&password=${encodeURIComponent(pw)}`
    );

    if (!res.ok) {
      alert("서버 통신에 실패했습니다.");
      return;
    }

    const matched = (await res.json()) as DbUser[];

    if (matched.length === 0) {
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    const user = matched[0];

    if (keepLogin) localStorage.setItem("saveLogin", "true");
    else localStorage.removeItem("saveLogin");

    localStorage.setItem("role", user.role);
    localStorage.setItem("username", user.username);
    localStorage.setItem("employeeId", user.employeeId);

    const from =
      (location.state as { from?: string } | null)?.from || "/dashboard";

    login({ id: user.username });
    navigate(from, { replace: true });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex justify-center items-center h-screen"
    >
      <div className="w-96 h-96 flex-row py-5 bg-blue-100 rounded-md">
        <h1 className="font-bold text-center text-5xl text-white">MES</h1>
        <h2 className="font-bold text-center text-2xl text-white">
          생산관리 시스템
        </h2>

        <div className="flex-row justify-center items-center">
          <div className="flex-row m-5 ml-6">
            <p>아이디</p>
            <input
              className="w-84 h-8 p-2 border border-gray-400 rounded-md focus:bg-gray-100"
              placeholder="사번 또는 아이디 입력"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <div className="flex-row m-5 ml-6">
            <p>비밀번호</p>
            <input
              type="password"
              className="w-84 h-8 p-2 border border-gray-400 rounded-md focus:bg-gray-100"
              placeholder="●●●●"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>

          <div className="flex-row m-5 ml-6 justify-center items-center">
            <input
              type="checkbox"
              checked={keepLogin}
              onChange={(e) => setKeepLogin(e.target.checked)}
            />
            <span className="mx-2">로그인 유지</span>
          </div>

          <div className="flex-row justify-center items-center">
            <button
              className="m-5 ml-6 bg-blue-500 text-white w-84 h-8 rounded-md"
              type="submit"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginPage;
