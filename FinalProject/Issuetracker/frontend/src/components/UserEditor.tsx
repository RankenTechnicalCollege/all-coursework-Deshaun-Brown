import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showError, showSuccess } from "@/lib/utils";
import type { User, UserRole } from "@/types/user";

// Zod schema for user validation
const userSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  role: z
    .enum([
      "developer",
      "qa",
      "business analyst",
      "product manager",
      "technical manager"
    ])
    .default("developer"),

  password: z
    .string()
    .optional()
    .refine(pwd => !pwd || pwd.length >= 6, "Password must be at least 6 characters")
});

type UserFormData = z.infer<typeof userSchema>;

interface UserEditorProps {
  user?: User;
  onSave: (data: Partial<User>) => void;
  onCancel: () => void;
}

export function UserEditor({ user, onSave, onCancel }: UserEditorProps) {
  const [formData, setFormData] = useState<UserFormData>({
    fullName: user?.fullName || "",
    email: user?.email || "",
    role: user?.role || "developer",
    password: ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [backendError, setBackendError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name as keyof UserFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError("");
    setErrors({});

    // Validate with Zod
    const validation = userSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof UserFormData, string>> = {};
      validation.error.errors.forEach(error => {
        const field = error.path[0] as keyof UserFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      await onSave(validation.data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save user";
      setBackendError(errorMsg);
      showError(errorMsg);
      console.error("Save user error:", err);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{user?._id ? "Edit User" : "Create User"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Backend Error Message */}
          {backendError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              ⚠️ {backendError}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John Doe"
              disabled={isLoading}
            />
            {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="john@example.com"
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role <span className="text-red-600">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            >
              <option value="developer">Developer</option>
              <option value="qa">QA</option>
              <option value="business analyst">Business Analyst</option>
              <option value="product manager">Product Manager</option>
              <option value="technical manager">Technical Manager</option>
            </select>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password {!user?._id && <span className="text-red-600">*</span>}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={user?._id ? "Leave blank to keep current password" : "••••••••"}
              disabled={isLoading}
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save User"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default UserEditor;