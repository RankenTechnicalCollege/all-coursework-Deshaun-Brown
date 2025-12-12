// src/components/forms/LoginForm.tsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { showError, showSuccess } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const { signIn: authSignIn } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [backendError, setBackendError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setBackendError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setBackendError("");

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormData;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      const firstError = Object.values(fieldErrors).find(Boolean);
      if (firstError) showError(firstError);
      return;
    }

    setIsLoading(true);

    try {
      const result = await authSignIn(validation.data);

      if (!result.success) {
        const msg = result.error?.message || "Invalid email or password.";
        setBackendError(msg);
        showError(msg);
        return;
      }

      showSuccess("Login successful!");

      const role = result.data?.role ?? "";
      const redirectMap: Record<string, string> = {
        TM: "/users",
        PM: "/reports",
        BA: "/reports",
        DEV: "/bugs",
        QA: "/bugs"
      };

      navigate(redirectMap[role] ?? "/dashboard");
    } catch (err: any) {
      showError(err.message || "Unexpected login error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <Link to="/" className="flex items-center justify-center bg-gray-50">
            <span className="text-lg font-semibold">IssueTracker</span>
          </Link>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {backendError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {backendError}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md bg-white text-gray-900 ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md bg-white text-gray-900 ${
                  errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-black text-white">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-sm text-center text-gray-600 mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Create one
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
