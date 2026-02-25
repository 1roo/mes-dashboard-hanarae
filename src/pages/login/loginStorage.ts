export const LOGIN_KEYS = {
  saveLogin: "saveLogin",
  role: "role",
  username: "username",
  employeeId: "employeeId",
} as const;

export const getSaveLogin = () =>
  localStorage.getItem(LOGIN_KEYS.saveLogin) === "true";

export const setSaveLogin = (enabled: boolean) => {
  if (enabled) localStorage.setItem(LOGIN_KEYS.saveLogin, "true");
  else localStorage.removeItem(LOGIN_KEYS.saveLogin);
};

export const saveUserToStorage = (user: {
  role: string;
  username: string;
  employeeId: string;
}) => {
  localStorage.setItem(LOGIN_KEYS.role, user.role);
  localStorage.setItem(LOGIN_KEYS.username, user.username);
  localStorage.setItem(LOGIN_KEYS.employeeId, user.employeeId);
};
