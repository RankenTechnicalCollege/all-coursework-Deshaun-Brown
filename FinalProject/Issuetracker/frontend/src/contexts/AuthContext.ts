import type {ReactNode } from "react";
import  { createContext, useContext, createElement } from "react";
import { useSession } from "@/lib/auth-client";
import { signIn, signUp, signOut } from "@/lib/auth-client";

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: typeof signIn;
  signUp: typeof signUp;
  signOut: typeof signOut;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  const value = {
    user: session?.user ?? null,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    signIn,
    signUp,
    signOut,
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