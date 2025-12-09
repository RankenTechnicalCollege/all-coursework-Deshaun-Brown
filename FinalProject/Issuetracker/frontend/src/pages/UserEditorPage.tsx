import { useParams, useNavigate } from "react-router-dom";
import { UserEditor } from "@/components/UserEditor";
import { showError, showSuccess } from "@/lib/utils";
import type { User } from "@/types/user";

export function UserEditorPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const handleSave = async (data: Partial<User>) => {
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      const endpoint = userId 
        ? `${base}/users/${userId}`
        : `${base}/users`;
      const method = userId ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save user (${response.status})`);
      }
      
      await response.json();

      const message = userId ? "User updated successfully!" : "User created successfully!";
      showSuccess(message);
      
      setTimeout(() => {
        navigate("/users");
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save user";
      showError(errorMsg);
      console.error("Save user error:", err);
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{userId ? "Edit User" : "Create User"}</h1>
        <p className="text-muted-foreground mt-2">
          {userId ? "Update user information and submit" : "Create a new user account"}
        </p>
      </div>

      <UserEditor 
        userId={userId}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default UserEditorPage;