import axios from "axios";

const parseError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as any)?.error || "Request failed";
  }
  return (err as any)?.message || "Unexpected error";
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export interface AuthResponse {
  success: boolean;
  data?: any;
  error?: { message: string };
}

export async function signIn(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    await api.post("/api/users/sign-in/email", payload);
    const session = await getSession();
    return { success: true, data: session };
  } catch (err) {
    return { success: false, error: { message: parseError(err) } };
  }
}

export async function signUp(payload: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<AuthResponse> {
  try {
    await api.post("/api/users/sign-up/email", payload);
    const session = await getSession();
    return { success: true, data: session };
  } catch (err) {
    return { success: false, error: { message: parseError(err) } };
  }
}

export async function signOut(): Promise<void> {
  try {
    await api.post("/api/auth/sign-out");
  } catch (err) {
    throw new Error(parseError(err));
  }
}

export async function getSession() {
  try {
    const { data } = await api.get("/api/get-session");
    return data;
  } catch {
    return null;
  }
}
