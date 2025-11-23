import { useState } from "react";
import type { Bug } from "@/types/bug";
import { BugListItem } from "@/components/BugListItem";
import { Button } from "@/components/ui/button";

interface BugListProps {
  onOpenEditor: (bug?: Bug) => void;
}

export function BugList({ onOpenEditor }: BugListProps) {
  // Sample bugs for testing (replace with API call later)
  const [bugs] = useState<Bug[]>([
    {
      _id: "1",
      title: "It's broken, please fix.",
      description: "The application crashes when I try to submit the form.",
      status: "open",
      priority: "high",
      createdBy: "DeSean Brown",
      assignedTo: "Paul Smith",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "2",
      title: "Crash on startup.",
      description: "Application fails to load on Windows 10.",
      status: "in-progress",
      priority: "critical",
      createdBy: "Mickey Mouse",
      assignedTo: "Donald Duck",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "3",
      title: "I'm not even sure what happened here is the error code 404 ...",
      description: "Getting 404 errors on all API endpoints.",
      status: "open",
      priority: "medium",
      createdBy: "Paul Smith",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "4",
      title: "Doesn't support wide screen monitors.",
      description: "UI breaks on ultra-wide displays.",
      status: "open",
      priority: "low",
      createdBy: "DeSean Brown",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "5",
      title: "Text is too small on my 4K monitor.",
      description: "Font size doesn't scale properly on high DPI displays.",
      status: "closed",
      priority: "low",
      createdBy: "Mickey Mouse",
      assignedTo: "Paul Smith",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "6",
      title: "Doesn't work on my iPhone 3.",
      description: "App is not compatible with older iOS versions.",
      status: "closed",
      priority: "low",
      createdBy: "Donald Duck",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const handleEdit = (bug: Bug) => {
    onOpenEditor(bug);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bugs</h2>
        <Button onClick={() => onOpenEditor()}>
          Create New Bug
        </Button>
      </div>

      {bugs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No bugs found. Click "Create New Bug" to add one.
        </div>
      ) : (
        <div className="space-y-3">
          {bugs.map((bug) => (
            <BugListItem 
              key={bug._id} 
              bug={bug} 
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}