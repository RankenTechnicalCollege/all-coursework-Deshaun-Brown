import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { showError, showSuccess } from "@/lib/utils";
import { signUp } from "@/lib/auth-client";

// Zod schema for validation
const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),

  role: z
    .string()
    .min(1, "Please select a role")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [backendError, setBackendError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setBackendError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setBackendError("");

    // Validate using Zod
    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      // Map Zod errors to field errors
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      validation.error.issues.forEach(error => {
        const field = error.path[0] as keyof RegisterFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      const firstError = Object.values(fieldErrors)[0];
      if (firstError) showError(firstError);
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp({
        name: validation.data.fullName,  // map fullName to name
        email: validation.data.email,
        password: validation.data.password,
        role: validation.data.role,
      });

      if (!result.success) {
        const msg = result.error?.message || "Registration failed. Please try again.";
        setBackendError(msg);
        showError(msg);
        setIsLoading(false);
        return;
      }

      // Successful registration
      const msg = "Registration successful! Welcome aboard!";
      showSuccess(msg);
      
      // Clear form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: ""
      });
      
      // Redirect to bugs/dashboard
      setTimeout(() => navigate("/bugs"), 800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during registration";
      setBackendError(msg);
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <Link to="/" className="flex items-center justify-center bg-gray-50">
          <span className="text-lg font-semibold">IssueTracker</span>
          </Link>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Register to start tracking bugs and issues</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Backend error message */}
          {backendError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200 mb-4">
              {backendError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name field */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.fullName ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Jane Doe"
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role <span className="text-red-600">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.role ? "border-red-500" : "border-gray-400"
                }`}
              >
                <option value="">Select a role</option>
                <option value="DEV">Developer</option>
                <option value="QA">Quality Analyst</option>
                <option value="BA">Business Analyst</option>
                <option value="PM">Product Manager</option>
                <option value="TM">Technical Manager</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-gray-600" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Register"}
            </Button>

            {/* Link to Login */}
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-primary hover:underline font-medium"
              >
                Login here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterForm;