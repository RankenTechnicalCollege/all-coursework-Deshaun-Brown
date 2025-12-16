"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { showError, showSuccess } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

// Zod schema
const registerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["DEV", "QA", "BA", "PM", "TM"], "Role is required"),
});

export function RegisterForm() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "DEV",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = registerSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat().find(Boolean);
      return showError(firstError || "Validation failed");
    }

    try {
      setLoading(true);
      const res = await signUp(parsed.data);
      if (!res.success) return showError(res.error?.message || "Registration failed");
      showSuccess("Registration successful!");
      navigate("/dashboard");
    } catch (err) {
      showError((err as Error).message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "DEV", label: "Developer" },
    { value: "QA", label: "QA Engineer" },
    { value: "BA", label: "Business Analyst" },
    { value: "PM", label: "Product Manager" },
    { value: "TM", label: "Technical Manager" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      <Card className="w-full max-w-md shadow-2xl border-slate-700 bg-slate-950">
        <CardHeader className="space-y-2 border-b border-slate-700 pb-6">
          <div className="flex items-center justify-center mb-4">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
              alt="Logo"
              className="h-10 w-10 bg-gray-200 rounded"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white text-center">Join IssueTracker</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Create an account to start tracking and managing issues
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-300">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-slate-300">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-800">
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">Select your role on the team</p>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 mt-6"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-center text-slate-400 text-sm">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-blue-400 hover:text-blue-300 font-semibold transition"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterForm;
