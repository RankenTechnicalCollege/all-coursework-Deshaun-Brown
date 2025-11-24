import { useState } from "react";
import type { Bug } from "@/types/bug";
import { BugListItem } from "@/components/BugListItem";
import { Button } from "@/components/ui/button";

interface BugListProps {
  onOpenEditor: (bug?: Bug) => void;
}

export function BugList({ onOpenEditor }: BugListProps) {
  const [bugs] = useState<Bug[]>([
    {
      _id: "1",
      title: "Crash on form submit",
      description: "App crashes when submitting large form.",
      status: "open",
      priority: "high",
      createdBy: "DeSean Brown",
      assignedTo: "Paul Smith",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "2",
      title: "Layout breaks on ultra-wide",
      description: "Columns stretch incorrectly on 32:9 monitors.",
      status: "in-progress",
      priority: "medium",
      createdBy: "Mickey Mouse",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const handleEdit = (bug: Bug) => onOpenEditor(bug);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bugs</h2>
        <Button onClick={() => onOpenEditor()}>New Bug</Button>
      </div>
      <div className="space-y-3">
        {bugs.map(b => (
          <BugListItem key={b._id} bug={b} onEdit={handleEdit} />
        ))}
      </div>
    </div>
  );
}