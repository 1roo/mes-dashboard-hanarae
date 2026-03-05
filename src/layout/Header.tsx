import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { setSaveLogin } from "../auth/storage/loginStorage";
import { instance } from "../shared/axios/axios";

type AuthUser = {
  employeeId?: string | number;
  role?: string;
  name?: string;
};

type UserRow = {
  id: string | number;
  employeeId: string | number;
  name: string;
  role?: string;
};

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const stored = sessionStorage.getItem("auth_user");
      if (!stored) return;

      const authUser: AuthUser = JSON.parse(stored);

      const employeeId = String(authUser.employeeId ?? "").trim();
      const sessionRole = String(authUser.role ?? "").trim();
      const sessionName = String(authUser.name ?? "").trim();

      if (sessionRole) setRole(sessionRole);
      if (sessionName) setName(sessionName);

      if (!employeeId) return;

      try {
        const res = await instance.get<UserRow[]>("/users", {
          params: { employeeId },
        });

        const user = res.data?.[0];
        if (!user) return;

        if (!sessionName && user.name) setName(user.name);
        if (!sessionRole && user.role) setRole(String(user.role));
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const onLogout = () => {
    logout();
    setSaveLogin(false);
    navigate("/", { replace: true });
  };

  return (
    <div>
      <div className="p-2 bg-white shadow-sm flex items-center justify-end">
        <div className="flex items-center gap-3 mr-5">
          <span className="font-semibold">{name}</span>
          {role && (
            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {role}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="px-3 py-1 rounded-md bg-slate-500 text-white hover:bg-slate-800"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Header;
