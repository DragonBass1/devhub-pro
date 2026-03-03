import React, { createContext, useContext, useState, useCallback } from "react";
import type { User, UserRole } from "@/types";
import { users } from "@/data/mockData";

interface AuthContextType {
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string) => {
    const found = users.find(u => u.email === email);
    if (found) { setUser(found); return true; }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const hasRole = useCallback((...roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  return <AuthContext.Provider value={{ user, login, logout, hasRole }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
};
