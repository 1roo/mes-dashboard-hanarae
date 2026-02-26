import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

type Role = "ADMIN" | "USER";

function getRole(): Role | null {
  const raw = localStorage.getItem("role");
  if (raw === "ADMIN" || raw === "USER") return raw;
  return null;
}

export default function AdminRoute() {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>로딩중</div>;

  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const role = getRole();
  if (role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
