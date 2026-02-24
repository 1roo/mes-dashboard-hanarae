import React, { useMemo, useState } from "react";
import { getCookie, removeCookie, setCookie } from "../utils/cookie";
import { type User, AuthContext } from "./AuthContext";

const AUTH_COOKIE = "auth";
const USER_COOKIE = "user_id";

function readAuthFromCookies(): { isLoggedIn: boolean; user: User | null } {
  const auth = getCookie(AUTH_COOKIE);
  const userId = getCookie(USER_COOKIE);

  if (auth === "1" && userId) {
    return { isLoggedIn: true, user: { id: decodeURIComponent(userId) } };
  }
  return { isLoggedIn: false, user: null };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initial = readAuthFromCookies();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initial.isLoggedIn);
  const [user, setUser] = useState<User | null>(initial.user);
  const [loading, setLoading] = useState(false);

  const initializeLoginState = () => {
    const next = readAuthFromCookies();
    setIsLoggedIn(next.isLoggedIn);
    setUser(next.user);
    setLoading(false);
  };

  const login = (u: User) => {
    setCookie(AUTH_COOKIE, "1", 1);
    setCookie(USER_COOKIE, u.id, 1);
    setIsLoggedIn(true);
    setUser(u);
  };

  const logout = () => {
    removeCookie(AUTH_COOKIE);
    removeCookie(USER_COOKIE);
    setIsLoggedIn(false);
    setUser(null);
  };

  const value = useMemo(
    () => ({ isLoggedIn, user, loading, initializeLoginState, login, logout }),
    [isLoggedIn, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
