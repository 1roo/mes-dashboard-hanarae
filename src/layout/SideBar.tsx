import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

type Role = "ADMIN" | "USER";

type MenuItem = {
  label: string;
  to: string;
  roles?: Role[];
};

const SideBar: React.FC = () => {
  const { user } = useAuth();

  const role: Role = user?.role ?? "USER";

  const items: MenuItem[] = useMemo(
    () => [
      { label: "대시보드", to: "/dashboard", roles: ["USER", "ADMIN"] },
      { label: "POP", to: "/pop", roles: ["USER", "ADMIN"] },
      { label: "계정 관리", to: "/users", roles: ["ADMIN"] },
      { label: "작업 지시 목록", to: "/workOrders", roles: ["USER", "ADMIN"] },
      { label: "실적등록", to: "/performance", roles: ["USER", "ADMIN"] },
      { label: "테이블연습", to: "/table", roles: ["USER", "ADMIN"] },
      { label: "차트연습", to: "/chart", roles: ["USER", "ADMIN"] },
    ],
    [],
  );

  const visibleItems = useMemo(
    () => items.filter((it) => !it.roles || it.roles.includes(role)),
    [items, role],
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-2">
        <div className="text-3xl text-center font-extrabold">MES</div>
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
    </aside>
  );
};

export default SideBar;
