import { Link } from "react-router-dom";
import moment from "moment";
import type { Bug } from "@/types/bug";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, User, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

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
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200",
    urgent: "bg-purple-100 text-purple-800 border-purple-200"
  };

 const statusColors: Record<string, string> = {
  all: "bg-primary/20 text-primary border-primary",
  open: "bg-green-100 text-green-800 border-green-300",
  inprogress: "bg-purple-100 text-purple-800 border-purple-300",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  resolved: "bg-teal-100 text-teal-800 border-teal-300",
  closed: "bg-gray-100 text-gray-800 border-gray-300",
};


  const priority = item.priority ?? "medium";
  // Normalize status to match keys like "in-progress" even if API returns "in_progress"
  const status = (item.status ?? "open").toLowerCase().replace(/_/g, "-");
  const createdBy = item.createdBy ?? item.authorOfBug ?? "Unknown";
  const assignedTo = item.assignedTo ?? item.assignedToUserName;
  const bugLink = `/bug/${item._id}`;

  const timeAgo = item.createdAt 
    ? moment(item.createdAt).fromNow()
    : "—";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        {/* Main Content */}
        <Link
          to={bugLink}
          className="flex-1 space-y-3 hover:opacity-90 transition-opacity"
        >
          {/* Header with ID and Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">#{item._id.slice(-6)}</span>
            <span
              className={cn(
                "text-xs px-2.5 py-1 rounded-full font-medium border",
                statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
              )}
            >
              {status === "in-progress"
                ? "In Progress"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between text-sm pt-2">
            <div className="flex items-center gap-4">
  <span
    className={cn(
      "font-medium capitalize text-xs px-2 py-1 rounded border",
      priorityColors[priority as keyof typeof priorityColors] || "bg-gray-100 text-gray-800"
    )}
  >
    {priority}
  </span>
  <span className="flex items-center gap-1 text-muted-foreground text-xs">
    <Clock className="h-3.5 w-3.5" />
    {timeAgo}
  </span>
</div>


            {assignedTo && (
              <div className="flex items-center gap-2 text-xs">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {assignedTo[0]?.toUpperCase() || "?"}
                </div>
                <span className="text-muted-foreground">{assignedTo}</span>
              </div>
            )}
          </div>
        </Link>

        {/* Critical Badge */}
        {priority === "critical" && (
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {(onEdit || onDelete) && (
        <div className="flex gap-2 mt-4 pt-4 border-t">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="hover:bg-blue-50 flex-1"
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
              className="hover:bg-red-600 flex-1"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          )}
        </div>
      )}

      {/* Hover Effect Bar */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
    </div>
  );
}

export default BugListItem;