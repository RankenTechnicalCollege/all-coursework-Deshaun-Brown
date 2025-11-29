import { Link } from "react-router-dom";
import type { Bug } from "@/types/bug";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BugListItemProps {
  bug: Bug;
  onEdit: () => void;
  onDelete: () => void;
}

export function BugListItem({ bug, onEdit, onDelete }: BugListItemProps) {
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

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Main Content - Wrapped in Link */}
          <Link 
            to={`/bug/${bug._id}`}
            className="flex-1 block hover:opacity-90 transition-opacity"
          >
            <div className="space-y-3">
              {/* Title with Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg hover:text-primary">
                  {bug.title}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[bug.priority]}`}>
                  {bug.priority.charAt(0).toUpperCase() + bug.priority.slice(1)}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[bug.status]}`}>
                  {bug.status === "in-progress" ? "In Progress" : bug.status.charAt(0).toUpperCase() + bug.status.slice(1)}
                </span>
              </div>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {bug.description}
              </p>
              
              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-2">
                <span>
                  <strong>Created by:</strong> {bug.createdBy}
                </span>
                {bug.assignedTo && (
                  <span>
                    <strong>Assigned to:</strong> {bug.assignedTo}
                  </span>
                )}
                <span>
                  <strong>Date:</strong> {new Date(bug.createdAt).toLocaleDateString()}
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

export default BugListItem;