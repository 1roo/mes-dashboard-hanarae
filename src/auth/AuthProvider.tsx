import React, { useMemo, useState } from "react";
import { type User, AuthContext } from "./AuthContext";

const AUTH_KEY = "auth_user";

function safeParseUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function readAuth(): { isLoggedIn: boolean; user: User | null } {
  const fromLocal = safeParseUser(localStorage.getItem(AUTH_KEY));
  if (fromLocal) return { isLoggedIn: true, user: fromLocal };

  const fromSession = safeParseUser(sessionStorage.getItem(AUTH_KEY));
  if (fromSession) return { isLoggedIn: true, user: fromSession };

  return { isLoggedIn: false, user: null };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initial = readAuth();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initial.isLoggedIn);
  const [user, setUser] = useState<User | null>(initial.user);
  const [loading, setLoading] = useState(false);

  const initializeLoginState = () => {
    const next = readAuth();
    setIsLoggedIn(next.isLoggedIn);
    setUser(next.user);
    setLoading(false);
  };

  const login = (u: User, keepLogin: boolean) => {
    const raw = JSON.stringify(u);

    if (keepLogin) {
      localStorage.setItem(AUTH_KEY, raw);
      sessionStorage.removeItem(AUTH_KEY);
    } else {
      sessionStorage.setItem(AUTH_KEY, raw);
      localStorage.removeItem(AUTH_KEY);
    }

    setIsLoggedIn(true);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
    setUser(null);
  };

  const value = useMemo(
    () => ({ isLoggedIn, user, loading, initializeLoginState, login, logout }),
    [isLoggedIn, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
