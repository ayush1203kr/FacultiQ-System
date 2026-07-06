"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";

export type Role = "ADMIN" | "FACULTY";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  faculty?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    department?: {
      name: string;
    };
  } | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function bootstrap() {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("facultiq_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("facultiq_token");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("facultiq_token", data.token);
    setUser(data.user);

    return data.user as AuthUser;
  }

  function logout() {
    localStorage.removeItem("facultiq_token");
    setUser(null);

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  async function refresh() {
    const { data } = await api.get("/auth/me");
    setUser(data.user);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}