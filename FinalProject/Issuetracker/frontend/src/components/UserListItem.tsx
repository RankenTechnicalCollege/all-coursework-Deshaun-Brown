import { Link } from "react-router-dom";
import type { User } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserListItemProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserListItem({ user, onEdit, onDelete }: UserListItemProps) {
  const roleColors = {
    "developer": "bg-green-100 text-green-800",
    "qa": "bg-yellow-100 text-yellow-800",
    "business analyst": "bg-blue-100 text-blue-800",
    "product manager": "bg-purple-100 text-purple-800",
    "technical manager": "bg-red-100 text-red-800"
  };

  const roleColor = roleColors[user.role] || "bg-gray-100 text-gray-800";

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Main Content - Wrapped in Link */}
          <Link 
            to={`/user/${user._id}`}
            className="flex-1 block hover:opacity-90 transition-opacity"
          >
            <div className="space-y-3">
              {/* Name with role badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg hover:text-primary">
                  {user.fullName}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${roleColor}`}>
                  {user.role}
                </span>
              </div>
              
              {/* Email */}
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
              
              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-2">
                <span>
                  <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
          
          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onEdit}
              className="hover:bg-blue-50"
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onDelete}
              className="hover:bg-red-600"
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserListItem;