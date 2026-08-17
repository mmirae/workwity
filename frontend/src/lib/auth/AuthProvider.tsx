"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { UserRole } from "./types";

interface AuthState {
  role: UserRole;
  isLoggedIn: boolean;
  /** Mock sign-in — swap the body for a real Supabase call later; the shape callers use stays the same. */
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);
const STORAGE_KEY = "workwity:mock-auth-role";

function isUserRole(value: string | null): value is UserRole {
  return value === "seeker" || value === "company";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("guest");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isUserRole(stored)) setRole(stored);
  }, []);

  const login = (nextRole: UserRole) => {
    setRole(nextRole);
    window.localStorage.setItem(STORAGE_KEY, nextRole);
  };

  const logout = () => {
    setRole("guest");
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ role, isLoggedIn: role !== "guest", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
