import { useEffect, useState } from "react";
import { showError } from "@/lib/utils";
import type { User } from "@/types/user";
import { UserListItem } from "./UserListItem";
import { useAuth } from "@/contexts/AuthContext";

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await fetch(`${base}/api/users`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users (${response.status})`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load users";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state - Spinner/pending message
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  // Error state - Show error message
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-sm text-red-600 bg-red-50 p-4 rounded-md border border-red-200 inline-block">
          {error}
        </div>
      </div>
    );
  }

  // Empty state - "No Users found."
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No Users found.</p>
      </div>
    );
  }

  // Users list - Display each user using UserListItem
  return (
    <div className="grid gap-4">
      {users.map(user => (
        <UserListItem key={user._id} item={user} />
      ))}
    </div>
  );
}

export default UserList;