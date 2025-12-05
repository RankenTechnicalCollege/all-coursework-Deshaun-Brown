import { Link } from "react-router-dom";
import type { User } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserListItemProps {
  item: User;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export function UserListItem({ item, onDelete, isDeleting = false }: UserListItemProps) {
  const roleColors: Record<string, string> = {
    DEV: "bg-green-100 text-green-800",
    QA: "bg-yellow-100 text-yellow-800",
    BA: "bg-blue-100 text-blue-800",
    PM: "bg-purple-100 text-purple-800",
    TM: "bg-red-100 text-red-800",
  };
  
  const roleColor = roleColors[item.role?.toLowerCase?.() || ""] || "bg-gray-100 text-gray-800";

  return (
    <Card className="hover:shadow-lg transition-all duration-200">


      
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Main Content - Clickable Link to User Editor */}
          <Link
            to={`/user/${item._id}`}
            className="flex-1 space-y-3 hover:opacity-90 transition-opacity"
          >
            {/* Name with Role Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg text-primary hover:underline">
                {item.fullName}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${roleColor}`}
              >
                {item.role}
              </span>
            </div>

            {/* Email */}
            <p className="text-sm text-muted-foreground">{item.email}</p>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-2">
              <span>
                <strong>Joined:</strong>{" "}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "—"}
              </span>
              {item.updatedAt && (
                <span>
                  <strong>Last updated:</strong>{" "}
                  {new Date(item.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </Link>

          {/* Action Buttons */}
          {onDelete && (
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hover:bg-blue-50"
              >
                <Link to={`/user/${item._id}`}>Edit</Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
                disabled={isDeleting}
                className="hover:bg-red-600"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default UserListItem;