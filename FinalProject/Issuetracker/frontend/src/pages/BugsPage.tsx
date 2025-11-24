import { useState } from "react";
import { BugList } from "@/components/BugList";
import { BugEditor } from "@/components/BugEditor";
import type { Bug } from "@/types/bug";

export function BugsPage() {
  const [editingBug, setEditingBug] = useState<Bug | undefined>();
  const [editorOpen, setEditorOpen] = useState(false);

  const handleOpenEditor = (bug?: Bug) => {
    setEditingBug(bug);
    setEditorOpen(true);
  };

  const handleCancel = () => {
    setEditorOpen(false);
    setEditingBug(undefined);
  };

  const handleSave = (data: Partial<Bug>) => {
    console.log("Saved bug (simulate persist):", data);
    handleCancel();
  };

  return (
    <div className="space-y-6">
      <BugList onOpenEditor={handleOpenEditor} />
      {editorOpen && (
        <BugEditor
          bug={editingBug}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default BugsPage;