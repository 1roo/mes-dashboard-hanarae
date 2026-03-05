export const getOperatorIdFromSession = () => {
  const stored = sessionStorage.getItem("auth_user");
  if (!stored) return "";

  try {
    const authUser = JSON.parse(stored);
    return String(authUser.employeeId ?? "").trim();
  } catch {
    return "";
  }
};
