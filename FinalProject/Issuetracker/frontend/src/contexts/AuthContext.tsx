import { createContext, useContext, createElement, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { signIn, signUp, signOut as authSignOut } from "@/lib/auth-client";

interface User {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: typeof signIn;
  signUp: typeof signUp;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      const res = await fetch(`${base}/auth/session`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.name || data.user.fullName,
            role: data.user.role,
          });
          return;
        }
      }
      setUser(null);
    } catch (err) {
      console.error("Failed to fetch session:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const handleSignIn: typeof signIn = async (payload) => {
    const res = await signIn(payload);
    if (res.success) await fetchSession();
    return res;
  };

  const handleSignUp: typeof signUp = async (payload) => {
    const res = await signUp(payload);
    if (res.success) await fetchSession();
    return res;
  };

  const handleSignOut = async () => {
    await authSignOut();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
