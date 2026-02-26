import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function AdminRoute() {
  const { isLoggedIn, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>로딩중</div>;

  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
