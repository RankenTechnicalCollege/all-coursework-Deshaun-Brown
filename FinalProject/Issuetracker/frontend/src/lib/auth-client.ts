import axios from "axios";

// Normalize axios errors into a user-friendly message
const parseError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    if (err.code === "ERR_NETWORK" || err.message?.toLowerCase().includes("network")) {
      return "Cannot reach the API server. Is it running and is VITE_API_URL correct?";
    }
    if (err.response) {
      return (
        (err.response.data as any)?.error ||
        (err.response.data as any)?.message ||
        `Request failed with status ${err.response.status}`
      );
    }
  }
  return (err as any)?.message || "Unexpected error";
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export interface SignInPayload {
  email: string;
  password: string;
}
export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  data?: any;
  error?: {
    message: string;
  };
}

export async function signIn(payload: SignInPayload): Promise<AuthResponse> {
  try {
    const response = await api.post("/users/sign-in/email", payload);
    return { success: true, data: response.data };
  } catch (err: any) {
    const msg = parseError(err);
    return { success: false, error: { message: msg } };
  }
}

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  try {
    const response = await api.post("/users/sign-up/email", payload);
    return { success: true, data: response.data };
  } catch (err: any) {
    const msg = parseError(err);
    return { success: false, error: { message: msg } };
  }
}

export async function signOut(): Promise<void> {
  try {
    await api.post("/users/sign-out");
  } catch (err) {
    throw new Error(parseError(err));
  }
}

export async function getSession() {
  try {
    const { data } = await api.get("/users/me");
    return data;
  } catch {
    return null;
  }
}
