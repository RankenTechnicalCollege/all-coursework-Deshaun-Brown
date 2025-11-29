import { UserList } from "@/components/UserList";

export function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage team members and their roles
        </p>
      </div>
      <UserList />
    </div>
  );
}

export default UsersPage;