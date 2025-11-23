import { useState } from "react";
import { BugList } from "@/components/BugList";
import type { Bug } from "@/types/bug";

export function BugsPage() {
  const [selectedBug, setSelectedBug] = useState<Bug | undefined>();

  const handleOpenEditor = (bug?: Bug) => {
    setSelectedBug(bug);
    console.log("Opening editor for:", bug ? bug.title : "new bug");
    // TODO: Open BugEditor component (we'll create this next)
  };

  return (
    <div>
      <BugList onOpenEditor={handleOpenEditor} />
      {/* BugEditor will go here later */}
    </div>
  );
}