import { useState } from "react";
import { UserList } from "@/components/UserList";
import {UserSearchInterface,} from "@/components/UserSearchInterface";
import type { UserSearchFilters,} from "@/components/UserSearchInterface";

export function UsersPage() {
  const [filters, setFilters] = useState<UserSearchFilters>({
    keywords: "",
    role: "",
    maxAge: "",
    minAge: "",
    sortBy: "name",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage team members and their roles
        </p>
      </div>
      <UserSearchInterface onSearch={setFilters} />
      <UserList filters={filters} />
    </div>
  );
}

export default UsersPage;