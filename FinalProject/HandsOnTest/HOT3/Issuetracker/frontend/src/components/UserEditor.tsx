import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { showError, showSuccess } from "@/lib/utils";
import type { User, UserRole } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";


type UserEditorProps = {
  userId?: string;
  onSave?: (payload: Partial<User>) => Promise<void> | void;
  onCancel?: () => void;
};

const userSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  role: z.enum(["developer", "quality analyst", "business analyst", "product manager", "technical manager"]),
  password: z
    .string()
    .min(7, "Password must be at least 7 characters")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

type UserFormData = z.infer<typeof userSchema>;

// Map role names to codes
const roleNameToCode: Record<string, UserRole> = {
  "developer": "DEV",
  "quality analyst": "QA",        // ← FIXED
  "business analyst": "BA",
  "product manager": "PM",
  "technical manager": "TM",
};


// Map codes to names for display
const roleCodeToName: Record<UserRole, string> = {
  DEV: "developer",
  QA: "quality analyst",
  BA: "business analyst",
  PM: "product manager",
  TM: "technical manager",
};

export function UserEditor({ userId: propUserId, onSave, onCancel }: UserEditorProps) {
  const navigate = useNavigate();
  const params = useParams();
  const userId = useMemo(() => propUserId ?? params.userId ?? params.id, [propUserId, params]);

  const [formData, setFormData] = useState<UserFormData>({
    fullName: "",
    email: "",
    role: "developer",
    password: undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [backendError, setBackendError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch user by ID on mount
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      setIsFetching(true);
      setBackendError("");
      try {
        const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const res = await fetch(`${base}/api/users/${userId}`, { credentials: "include" });
        if (!res.ok) throw new Error(`Failed to load user (${res.status})`);
        const data: User = await res.json();
        setFormData({
          fullName: data.fullName,
          email: data.email,
          role: (roleCodeToName[data.role] ?? "developer") as UserFormData["role"],
          password: undefined,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load user";
        setBackendError(msg);
        showError(msg);
      } finally {
        setIsFetching(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setBackendError("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setBackendError("");
    setSuccessMsg("");

    // Frontend validation with Zod
    const validation = userSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof UserFormData, string>> = {};
      validation.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof UserFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      const firstError = Object.values(fieldErrors)[0];
      if (firstError) showError(firstError);
      return;
    }

    setIsLoading(true);
    try {
      const roleCode = roleNameToCode[validation.data.role];
      const payload: Partial<User> = {
        fullName: validation.data.fullName,
        email: validation.data.email,
        role: roleCode,
      };
      if (validation.data.password) {
        payload.password = validation.data.password;
      }

      const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      const endpoint = userId ? `${base}/users/${userId}` : `${base}/users`;
      const method = userId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = `Update failed (${res.status})`;
        setBackendError(msg);
        showError(msg);
        setIsLoading(false);
        return;
      }

      await res.json();
      const msg = userId ? "User updated successfully." : "User created successfully.";
      setSuccessMsg(msg);
      showSuccess(msg);

      if (onSave) {
        await onSave(payload);
      } else {
        setTimeout(() => navigate("/users"), 800);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error while saving user";
      setBackendError(msg);
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) return onCancel();
    navigate(-1);
  };

  const roleOptions: UserFormData["role"][] = [
    "developer",
    "quality analyst",
    "business analyst",
    "product manager",
    "technical manager",
  ];

  return (
    <div className="flex items-center justify-center py-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{userId ? "Edit User" : "Create User"}</CardTitle>
          <CardDescription>
            {isFetching ? "Loading user..." : "Update the user's information below"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Backend error message */}
          {backendError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200 mb-4">
              {backendError}
            </div>
          )}

          {/* Success message */}
          {successMsg && (
            <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-200 mb-4">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name field */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isFetching || isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.fullName ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Jane Doe"
              />
              {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isFetching || isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="user@example.com"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Role field */}
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isFetching || isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.role ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              >
                {roleOptions.map(r => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
              {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
            </div>

            {/* Password field (optional) */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                New Password (optional)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password ?? ""}
                onChange={handleChange}
                disabled={isFetching || isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Leave blank to keep current password"
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              <p className="text-xs text-muted-foreground">Minimum 7 characters when provided.</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isFetching || isLoading} className="min-w-28">
                {isLoading ? "Saving..." : userId ? "Update User" : "Create User"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserEditor;