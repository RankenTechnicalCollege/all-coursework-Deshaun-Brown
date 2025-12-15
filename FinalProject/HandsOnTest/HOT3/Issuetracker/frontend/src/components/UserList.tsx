import { useEffect, useState } from "react";
import { showError } from "@/lib/utils";
import type { User } from "@/types/user";
import { UserListItem } from "./UserListItem";
import type { UserSearchFilters } from "./UserSearchInterface";

interface UserListProps {
  filters: UserSearchFilters;
}

export function UserList({ filters }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchUsers(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const fetchUsers = async (nextFilters: UserSearchFilters) => {
    setIsLoading(true);
    setError("");
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const params = new URLSearchParams();
      if (nextFilters.keywords.trim()) params.set("keywords", nextFilters.keywords.trim());
      if (nextFilters.role) params.set("role", nextFilters.role);
      if (nextFilters.maxAge) params.set("maxAge", nextFilters.maxAge);
      if (nextFilters.minAge) params.set("minAge", nextFilters.minAge);
      if (nextFilters.sortBy) params.set("sortBy", nextFilters.sortBy);

      const query = params.toString();
      const url = query ? `${base}/api/users?${query}` : `${base}/api/users`;

      const response = await fetch(url, {
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