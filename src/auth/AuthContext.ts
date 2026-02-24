import { createContext } from "react";

export type User = { id: string };

export type AuthContextValue = {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  initializeLoginState: () => void;
  login: (user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
