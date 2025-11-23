import type { Bug } from "@/types/bug";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BugListItemProps {
  bug: Bug;
  onEdit: (bug: Bug) => void;
}

export function BugListItem({ bug, onEdit }: BugListItemProps) {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg">{bug.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[bug.priority]}`}>
                {bug.priority}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[bug.status]}`}>
                {bug.status}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {bug.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Created by: {bug.createdBy}</span>
              {bug.assignedTo && <span>Assigned to: {bug.assignedTo}</span>}
              <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(bug)}
          >
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}