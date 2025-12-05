import { Link } from "react-router-dom";
import type { Bug } from "@/types/bug";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BugListItemProps {
  item: Bug;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export function BugListItem({
  item,
  onEdit,
  onDelete,
  isDeleting = false
}: BugListItemProps) {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800"
  };

  const statusColors = {
    open: "bg-green-100 text-green-800",
    "in-progress": "bg-purple-100 text-purple-800",
    closed: "bg-gray-100 text-gray-800"
  };

  // Link to bug editor page
  const bugLink = `/bug/${item._id}`;

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Main Content - Clickable Link to Editor */}
          <Link
            to={bugLink}
            className="flex-1 space-y-3 hover:opacity-90 transition-opacity"
          >
            {/* Title with Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg text-primary hover:underline">
                {item.title}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  priorityColors[item.priority as keyof typeof priorityColors] ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  statusColors[item.status as keyof typeof statusColors] ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {item.status === "in-progress"
                  ? "In Progress"
                  : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-2">
              <span>
                <strong>Created by:</strong> {item.createdBy || "Unknown"}
              </span>
              {item.assignedTo && (
                <span>
                  <strong>Assigned to:</strong> {item.assignedTo}
                </span>
              )}
              <span>
                <strong>Date:</strong>{" "}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "—"}
              </span>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="hover:bg-blue-50"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
                disabled={isDeleting}
                className="hover:bg-red-600"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BugListItem;