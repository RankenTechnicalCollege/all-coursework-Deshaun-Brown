import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { signIn as apiSignIn, signUp as apiSignUp, signOut as apiSignOut, getSession } from "@/lib/auth-client";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (data: any) => Promise<any>;  
  signUp: (data: any) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session on first load
  useEffect(() => {
    let mounted = true;

    getSession().then((session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  // ---- SIGN IN ----
  const signIn = async (formData: any) => {
    const result = await apiSignIn(formData);

    if (result.success && result.data) {
      setUser(result.data.user);
    }

    return result;
  };

  // ---- SIGN UP ----
  const signUp = async (formData: any) => {
    const result = await apiSignUp(formData);

    if (result.success && result.data) {
      setUser(result.data);
    }

    return result;
  };

  // ---- LOGOUT ----
  const logout = async () => {
    await apiSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
