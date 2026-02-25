import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function IndexRedirect() {
  const { isLoggedIn } = useAuth();
  const role = localStorage.getItem("role");

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <Navigate
      to={role === "ADMIN" ? "/adminDashboard" : "/dashboard"}
      replace
    />
  );
}
