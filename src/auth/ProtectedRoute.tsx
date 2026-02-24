import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function ProtectedRoute() {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>로딩중...</div>;

  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
