import { createContext } from "react";

export type User = {
  id: string;
};

export type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  initializeLoginState: () => void;
  login: (u: User, keepLogin: boolean) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  loading: false,
  initializeLoginState: () => {},
  login: () => {},
  logout: () => {},
});
