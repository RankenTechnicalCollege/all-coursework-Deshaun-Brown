import { useState } from "react";
import type { User } from "@/types/user";
import { UserEditor } from "@/components/UserEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type UserRole = User["role"];

export function UserList() {
  const [users, setUsers] = useState<User[]>([
    {
      _id: "1",
      fullName: "DeSean Brown",
      email: "desean@example.com",
      role: "developer",
      createdAt: new Date().toISOString()
    },
    {
      _id: "2",
      fullName: "Paul Smith",
      email: "paul@example.com",
      role: "qa",
      createdAt: new Date().toISOString()
    },
    {
      _id: "3",
      fullName: "Mickey Mouse",
      email: "mickey@example.com",
      role: "business analyst",
      createdAt: new Date().toISOString()
    },
    {
      _id: "4",
      fullName: "Donald Duck",
      email: "donald@example.com",
      role: "product manager",
      createdAt: new Date().toISOString()
    },
    {
      _id: "5",
      fullName: "Jane Tech",
      email: "jane.tech@example.com",
      role: "technical manager",
      createdAt: new Date().toISOString()
    }
  ]);

  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleOpenEditor = (user?: User) => {
    setSelectedUser(user);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setSelectedUser(undefined);
    setIsEditorOpen(false);
  };

  const roleColors: Record<UserRole, string> = {
    developer: "bg-blue-100 text-blue-800",
    qa: "bg-green-100 text-green-800",
    "business analyst": "bg-indigo-100 text-indigo-800",
    "product manager": "bg-pink-100 text-pink-800",
    "technical manager": "bg-orange-100 text-orange-800"
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (userData._id) {
      // Update existing user
      setUsers(users.map(u => 
        u._id === userData._id ? { ...u, ...userData } as User : u
      ));
      console.log("User updated:", userData);
    } else {
      // Create new user
      const newUser: User = {
        _id: Date.now().toString(),
        fullName: userData.fullName!,
        email: userData.email!,
        role: userData.role!,
        createdAt: new Date().toISOString()
      };
      setUsers([...users, newUser]);
      console.log("User created:", newUser);
    }
    handleCloseEditor();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button onClick={() => handleOpenEditor()}>
          Create New User
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No users found. Click "Create New User" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{user.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleOpenEditor(user)}
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isEditorOpen && (
        <UserEditor
          user={selectedUser}
          onSave={handleSaveUser}
          onCancel={handleCloseEditor}
        />
      )}
    </div>
  );
}