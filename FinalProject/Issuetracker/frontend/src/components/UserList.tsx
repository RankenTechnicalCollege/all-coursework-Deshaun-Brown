import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/lib/utils";
import type { User } from "@/types/user";
import { UserListItem } from "@/components/UserListItem";

export function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      const res = await fetch(`${base}/users`, { credentials: "include" });
      if (!res.ok) throw new Error(`Failed to fetch users (${res.status})`);
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load users";
      setError(msg);
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setDeletingId(userId);
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      const res = await fetch(`${base}/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Failed to delete user (${res.status})`);

      // Remove from list
      setUsers(prev => prev.filter(u => u._id !== userId));
      showSuccess("User deleted successfully.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete user";
      showError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state - Spinner/pending message
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Users</h1>
          <Button onClick={() => navigate("/user/new")}>Create User</Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - Show error message
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Users</h1>
          <Button onClick={() => navigate("/user/new")}>Create User</Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-red-600 text-4xl">⚠️</div>
            <p className="text-red-600 font-medium">{error}</p>
            <Button variant="outline" onClick={fetchUsers}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - "No Users found."
  if (users.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Users</h1>
          <Button onClick={() => navigate("/user/new")}>Create User</Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-4xl">👥</div>
            <p className="text-muted-foreground text-lg">No Users found.</p>
            <Button onClick={() => navigate("/user/new")}>
              Create the first user
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Users list - Display each user using UserListItem
  return (
    <div className="space-y-6">
      {/* Header with count and create button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">
            {users.length} {users.length === 1 ? "user" : "users"}
          </p>
        </div>
        <Button onClick={() => navigate("/user/new")}>Create User</Button>
      </div>

      {/* Users grid */}
      <div className="grid gap-4">
        {users.map(user => (
          <UserListItem
            key={user._id}
            item={user}
            onDelete={() => handleDelete(user._id)}
            isDeleting={deletingId === user._id}
          />
        ))}
      </div>
    </div>
  );
}

export default UserList;