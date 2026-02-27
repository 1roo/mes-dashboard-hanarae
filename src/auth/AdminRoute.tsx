import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import Spinner from "../shared/ui/Spinner";

export default function AdminRoute() {
  const { isLoggedIn, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;

  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
