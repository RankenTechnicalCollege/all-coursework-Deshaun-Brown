import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/lib/utils";
import type { Bug } from "@/types/bug";
import { BugListItem } from "@/components/BugListItem";

export function BugList() {
  const navigate = useNavigate();
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch bugs on component mount
  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      const res = await fetch(`${base}/bugs`, { credentials: "include" });
      if (!res.ok) throw new Error(`Failed to fetch bugs (${res.status})`);
      const data: Bug[] = await res.json();
      setBugs(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load bugs";
      setError(msg);
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (bugId: string) => {
    navigate(`/bug/${bugId}`);
  };

  const handleDelete = async (bugId: string) => {
    if (!window.confirm("Are you sure you want to delete this bug?")) return;

    setDeletingId(bugId);
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      const res = await fetch(`${base}/bugs/${bugId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Failed to delete bug (${res.status})`);

      // Remove from list
      setBugs(prev => prev.filter(b => b._id !== bugId));
      showSuccess("Bug deleted successfully.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete bug";
      showError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div></div>
          <Button onClick={() => navigate("/bug/new")}>Create Bug</Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading bugs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div></div>
          <Button onClick={() => navigate("/bug/new")}>Create Bug</Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-red-600 text-4xl">⚠️</div>
            <p className="text-red-600 font-medium">{error}</p>
            <Button variant="outline" onClick={fetchBugs}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (bugs.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div></div>
          <Button onClick={() => navigate("/bug/new")}>Create Bug</Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-4xl">🐛</div>
            <p className="text-muted-foreground text-lg">No bugs found.</p>
            <Button onClick={() => navigate("/bug/new")}>
              Create the first bug
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Bugs list
  return (
    <div className="space-y-6">
      {/* Header with count and create button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bugs</h1>
          <p className="text-muted-foreground mt-1">
            {bugs.length} {bugs.length === 1 ? "bug" : "bugs"}
          </p>
        </div>
        <Button onClick={() => navigate("/bug/new")}>Create Bug</Button>
      </div>

      {/* Bugs grid */}
      <div className="grid gap-4">
        {bugs.map(bug => (
          <BugListItem
            key={bug._id}
            item={bug}
            onEdit={() => handleEdit(bug._id)}
            onDelete={() => handleDelete(bug._id)}
            isDeleting={deletingId === bug._id}
          />
        ))}
      </div>
    </div>
  );
}

export default BugList;