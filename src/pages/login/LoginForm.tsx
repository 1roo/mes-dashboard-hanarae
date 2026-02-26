import React from "react";

type Props = {
  id: string;
  pw: string;
  keepLogin: boolean;
  setId: (v: string) => void;
  setPw: (v: string) => void;
  setKeepLogin: (v: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const LoginForm = ({
  id,
  pw,
  keepLogin,
  setId,
  setPw,
  setKeepLogin,
  onSubmit,
}: Props) => {
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
            <label htmlFor="login-id">아이디</label>
            <input
              id="login-id"
              className="w-80 h-8 p-2 border border-gray-400 rounded-md focus:bg-gray-100"
              placeholder="사번 또는 아이디 입력"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <div className="flex-row m-5 ml-6">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              className="w-80 h-8 p-2 border border-gray-400 rounded-md focus:bg-gray-100"
              placeholder="●●●●"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>

          <div className="flex-row m-5 ml-6 justify-center items-center">
            <input
              id="keep-login"
              type="checkbox"
              checked={keepLogin}
              onChange={(e) => setKeepLogin(e.target.checked)}
            />
            <label htmlFor="keep-login" className="mx-2">
              로그인 유지
            </label>
          </div>

          <div className="flex-row justify-center items-center">
            <button
              className="m-5 ml-6 bg-blue-500 text-white w-80 h-8 rounded-md"
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

export default LoginForm;
