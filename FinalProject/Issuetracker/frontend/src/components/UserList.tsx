import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserListItem } from "@/components/UserListItem";
import { Button } from "@/components/ui/button";
import { showError } from "@/lib/utils";
import type { User } from "@/types/user";

export function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
      // if (!response.ok) throw new Error('Failed to fetch users');
      // const data = await response.json();
      // setUsers(data);

      // Mock data for development
      const mockUsers: User[] = [
        {
          _id: "1",
          fullName: "DeSean Brown",
          email: "desean@example.com",
          role: "technical manager",
          createdAt: new Date().toISOString()
        },
        {
          _id: "2",
          fullName: "Paul Smith",
          email: "paul@example.com",
          role: "developer",
          createdAt: new Date().toISOString()
        },
        {
          _id: "3",
          fullName: "Mickey Mouse",
          email: "mickey@example.com",
          role: "qa",
          createdAt: new Date().toISOString()
        },
        {
          _id: "4",
          fullName: "Donald Duck",
          email: "donald@example.com",
          role: "business analyst",
          createdAt: new Date().toISOString()
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(mockUsers);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load users";
      setError(errorMsg);
      showError(errorMsg);
      console.error("Fetch users error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = () => {
    navigate("/user/new");
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // TODO: Call API to delete user
      setUsers(users.filter(user => user._id !== userId));
      console.log("User deleted:", userId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete user";
      showError(errorMsg);
      console.error("Delete user error:", err);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div></div>
          <Button onClick={handleCreateUser}>Create User</Button>
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

  // Error State
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div></div>
          <Button onClick={handleCreateUser}>Create User</Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-red-600 text-5xl">⚠️</div>
            <h2 className="text-xl font-semibold">Failed to Load Users</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchUsers} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (users.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div></div>
          <Button onClick={handleCreateUser}>Create User</Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-6xl">👥</div>
            <h2 className="text-xl font-semibold">No users found.</h2>
            <p className="text-muted-foreground">
              Create a new user to get started.
            </p>
            <Button onClick={handleCreateUser}>Create Your First User</Button>
          </div>
        </div>
      </div>
    );
  }

  // Users List State
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            {users.length} {users.length === 1 ? "user" : "users"} in system
          </p>
        </div>
        <Button onClick={handleCreateUser}>Create User</Button>
      </div>

      <div className="grid gap-4">
        {users.map(user => (
          <UserListItem
            key={user._id}
            user={user}
            onEdit={() => navigate(`/user/${user._id}`)}
            onDelete={() => handleDeleteUser(user._id)}
          />
        ))}
      </div>
    </div>
  );
}

export default UserList;