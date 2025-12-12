import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { User, UserRole } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";


type UserListItemProps = {
  item: User;
};

// Map codes to names for display
const roleCodeToName: Record<UserRole, string> = {
  DEV: "Developer",
  QA: "Quality Analyst",
  BA: "Business Analyst",
  PM: "Product Manager",
  TM: "Technical Manager",
};

export function UserListItem({ item }: UserListItemProps) {
  const roleName = roleCodeToName[item.role] || item.role;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{item.fullName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{item.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Role</p>
            <p className="font-medium">{roleName}</p>
          </div>
        </div>

        {item.createdAt && (
          <div className="text-xs text-muted-foreground">
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </div>
        )}

        <Link to={`/users/${item._id}`}>
          <Button className="w-full">Edit User</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default UserListItem;