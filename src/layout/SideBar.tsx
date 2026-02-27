import React, { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { setSaveLogin } from "../pages/login/loginStorage";

type Role = "ADMIN" | "USER";

type MenuItem = {
  label: string;
  to: string;
  roles?: Role[];
};

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const role: Role = user?.role ?? "USER";

  const items: MenuItem[] = useMemo(
    () => [
      { label: "대시보드", to: "/dashboard", roles: ["USER", "ADMIN"] },
      { label: "POP", to: "/pop", roles: ["USER", "ADMIN"] },
      { label: "계정 관리", to: "/users", roles: ["ADMIN"] },
      { label: "작업 지시 목록", to: "/workOrders", roles: ["USER", "ADMIN"] },
      { label: "실적등록", to: "/performance", roles: ["USER", "ADMIN"] },
    ],
    [],
  );

  const visibleItems = useMemo(
    () => items.filter((it) => !it.roles || it.roles.includes(role)),
    [items, role],
  );

  const onLogout = () => {
    logout();

    setSaveLogin(false);

    navigate("/", { replace: true });
  };

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="text-2xl font-extrabold">MES</div>
        <div className="text-sm text-gray-500">
          {role === "ADMIN" ? "관리자" : "사용자"}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "block rounded-md px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t">
        <button
          type="button"
          onClick={onLogout}
          className="w-full bg-gray-900 text-white rounded-md py-2 text-sm font-semibold hover:bg-gray-800 transition"
        >
          로그아웃
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
