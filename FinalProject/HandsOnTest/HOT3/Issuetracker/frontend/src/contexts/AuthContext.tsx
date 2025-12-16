import { createContext, useContext, useEffect, useState } from "react";
import { getSession, signOut, signIn as apiSignIn, signUp as apiSignUp } from "@/lib/auth-client";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (data: any) => Promise<any>;
  signUp: (data: any) => Promise<any>;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const session = await getSession();
      setUser(session?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const signIn = async (formData: any) => {
    const result = await apiSignIn(formData);
    if (result.success && result.data?.user) {
      setUser(result.data.user);
    }
    return result;
  };

  const signUp = async (formData: any) => {
    const result = await apiSignUp(formData);
    if (result.success && result.data?.user) {
      setUser(result.data.user);
    }
    return result;
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, refreshSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
