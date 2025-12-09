const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;  // backend expects 'name', not 'fullName'
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    _id: string;
    email: string;
    fullName?: string;
    role?: string; // allow role from API
  };
  error?: {
    message: string;
  };
}

async function parseJsonSafe(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    // consume body to avoid stream locking, but don't parse
    await res.text().catch(() => {});
    return {};
  }
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function signIn(payload: SignInPayload): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE}/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const result = await parseJsonSafe(response);

    if (!response.ok || (result as any).error) {
      return {
        success: false,
        error: (result as any).error || { message: "Sign in failed" },
      };
    }

    return {
      success: true,
      data: (result as any).data,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return { success: false, error: { message } };
  }
}

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  try {
    // Call Better Auth directly
    const response = await fetch(`${API_BASE}/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role
      }),
    });

    const result = await parseJsonSafe(response);

    if (!response.ok || (result as any).error) {
      return {
        success: false,
        error: (result as any).error || { message: "Sign up failed" },
      };
    }

    return {
      success: true,
      data: (result as any).data,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return { success: false, error: { message } };
  }
}

export async function signOut(): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE}/auth/sign-out`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const result = await parseJsonSafe(response);

    if (!response.ok || (result as any).error) {
      return {
        success: false,
        error: (result as any).error || { message: "Sign out failed" },
      };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return { success: false, error: { message } };
  }
}

// Session management utility (optional, for future use)
export async function getSession() {
  try {
    const response = await fetch(`${API_BASE}/auth/session`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (err) {
    return null;
  }
}

export interface UseSessionResult {
  data: {
    user: {
      id: string;
      email: string;
      fullName?: string;
    } | null;
  } | null;
  isPending: boolean;
}

export function useSession(): UseSessionResult {
  // This is a placeholder. In a real app, you'd use React hooks here
  return {
    data: null,
    isPending: false,
  };
}

