import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showError, showSuccess } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { User, Lock, Mail, UserCircle } from "lucide-react";

interface UserProfile {
  _id: string;
  email: string;
  fullName?: string;
  givenName?: string;
  familyName?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    givenName: "",
    familyName: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await fetch(`${base}/api/users/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          showError("Please log in to view your profile.");
          navigate("/login");
          return;
        }
        throw new Error(`Failed to fetch profile (${response.status})`);
      }

      const data = await response.json();
      setUser(data);
      setFormData({
        fullName: data.fullName || "",
        givenName: data.givenName || "",
        familyName: data.familyName || "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch profile";
      showError(errorMsg);
      console.error("Fetch profile error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match if provided
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        showError("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        showError("Password must be at least 6 characters");
        return;
      }
    }

    setIsSaving(true);

    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      
      // Build update payload (only include changed fields)
      const updatePayload: any = {};
      if (formData.fullName && formData.fullName !== user?.fullName) {
        updatePayload.fullName = formData.fullName;
      }
      if (formData.givenName && formData.givenName !== user?.givenName) {
        updatePayload.givenName = formData.givenName;
      }
      if (formData.familyName && formData.familyName !== user?.familyName) {
        updatePayload.familyName = formData.familyName;
      }
      if (formData.password) {
        updatePayload.password = formData.password;
      }

      // If no changes, don't send request
      if (Object.keys(updatePayload).length === 0) {
        showError("No changes to save");
        return;
      }

      const response = await fetch(`${base}/api/users/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update profile (${response.status})`);
      }

      showSuccess("Profile updated successfully!");
      
      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      // Refresh profile data
      await fetchProfile();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update profile";
      showError(errorMsg);
      console.error("Update profile error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-12 pb-12 text-center space-y-4">
            <p className="text-red-600">Failed to load profile</p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="h-10 w-10 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl">My Profile</CardTitle>
                <CardDescription>View and update your account information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm font-medium">{user.role || "Not assigned"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update Profile</CardTitle>
            <CardDescription>
              Edit your personal information and change your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>

              {/* Given Name */}
              <div className="space-y-2">
                <Label htmlFor="givenName">First Name</Label>
                <Input
                  id="givenName"
                  name="givenName"
                  placeholder="Enter your first name"
                  value={formData.givenName}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>

              {/* Family Name */}
              <div className="space-y-2">
                <Label htmlFor="familyName">Last Name</Label>
                <Input
                  id="familyName"
                  name="familyName"
                  placeholder="Enter your last name"
                  value={formData.familyName}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>

              {/* Password Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Leave blank to keep your current password
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter new password (min 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isSaving} className="flex-1">
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;
