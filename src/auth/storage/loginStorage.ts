export const LOGIN_KEYS = {
  saveLogin: "saveLogin",
} as const;

export const getSaveLogin = () =>
  localStorage.getItem(LOGIN_KEYS.saveLogin) === "true";

export const setSaveLogin = (enabled: boolean) => {
  if (enabled) localStorage.setItem(LOGIN_KEYS.saveLogin, "true");
  else localStorage.removeItem(LOGIN_KEYS.saveLogin);
};
