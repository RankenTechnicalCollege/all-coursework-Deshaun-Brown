import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserEditor } from "@/components/UserEditor";
import { showError, showSuccess } from "@/lib/utils";
import type { User } from "@/types/user";

export function UserEditorPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(!!userId); // Only load if editing

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`);
      // if (!response.ok) throw new Error('Failed to fetch user');
      // const data = await response.json();
      // setUser(data);

      // Mock: simulate fetching user
      const mockUser: User = {
        _id: userId,
        fullName: "DeSean Brown",
        email: "desean@example.com",
        role: "technical manager",
        createdAt: new Date().toISOString()
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(mockUser);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch user";
      showError(errorMsg);
      console.error("Fetch user error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: Partial<User>) => {
    try {
      // TODO: Call API to save user
      // const endpoint = user?._id 
      //   ? `${import.meta.env.VITE_API_URL}/api/users/${user._id}`
      //   : `${import.meta.env.VITE_API_URL}/api/users`;
      // const method = user?._id ? 'PUT' : 'POST';
      // const response = await fetch(endpoint, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // if (!response.ok) throw new Error('Failed to save user');
      // const savedUser = await response.json();

      const message = user?._id ? "User updated successfully!" : "User created successfully!";
      showSuccess(message);
      console.log("User saved:", data);
      
      setTimeout(() => {
        navigate("/user/list");
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save user";
      showError(errorMsg);
      console.error("Save user error:", err);
    }
  };

  const handleCancel = () => {
    navigate("/user/list");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading user...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{userId ? "Edit User" : "Create User"}</h1>
        <p className="text-muted-foreground mt-2">
          {userId ? "Update user information and submit" : "Create a new user account"}
        </p>
      </div>

      <UserEditor 
        user={user}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default UserEditorPage;