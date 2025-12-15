import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/lib/utils";
import type { Bug } from "@/types/bug";
import { BugListItem } from "@/components/BugListItem";
import type { SearchFilters } from "./BugSearchInterface";

interface BugListProps {
  filters?: SearchFilters;
}

export function BugList({ filters }: BugListProps) {
  const navigate = useNavigate();
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBugs();
  }, [filters]);

  const fetchBugs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";

      const params = new URLSearchParams({
        sortBy: filters?.sortBy || "newest",
        pageSize: "1000",
        ...(filters?.keywords && { keywords: filters.keywords }),
        ...(filters?.classification && { classification: filters.classification }),
        ...(filters?.maxAge && { maxAge: filters.maxAge }),
        ...(filters?.minAge && { minAge: filters.minAge }),
        ...(filters?.closed !== undefined && {
          closed: filters.closed ? "true" : "false",
        }),
      });

      // ✅ FIXED ENDPOINT
      const res = await fetch(`${base}/api/bugs?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch bugs (${res.status})`);
      }

      const data = await res.json();
      const bugsList: Bug[] = data?.bugs ?? [];

      const safeDate = (val?: string | number) =>
        val ? new Date(val).toISOString() : new Date().toISOString();

      const normalized = bugsList.map((bug) => ({
        ...bug,
        createdAt: safeDate(bug.createdAt),
        updatedAt: safeDate(bug.updatedAt),
      }));

      setBugs(normalized);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load bugs";
      setError(msg);
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (bugId: string) => {
    navigate(`/bugs/${bugId}`);
  };

  const handleDelete = async (bugId: string) => {
    if (!window.confirm("Are you sure you want to delete this bug?")) return;

    setDeletingId(bugId);

    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";

      // ✅ FIXED ENDPOINT
      const res = await fetch(`${base}/api/bugs/${bugId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete bug (${res.status})`);
      }

      setBugs((prev) => prev.filter((b) => b._id !== bugId));
      showSuccess("Bug deleted successfully.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete bug";
      showError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // LOADING UI
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div />
          <Button onClick={() => navigate("/bugs/new")}>Create Bug</Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading bugs...</p>
        </div>
      </div>
    );
  }

  // ERROR UI
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div />
          <Button onClick={() => navigate("/bugs/new")}>Create Bug</Button>
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

  // EMPTY UI
  if (bugs.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div />
          <Button onClick={() => navigate("/bugs/new")}>Create Bug</Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-4xl">🐛</div>
            <p className="text-muted-foreground text-lg">No bugs found.</p>
            <Button onClick={() => navigate("/bugs/new")}>
              Create the first bug
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Found {bugs.length} bug{bugs.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {bugs.map((bug, index) => (
          <div
            key={bug._id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <BugListItem
              item={bug}
              onEdit={() => handleEdit(bug._id)}
              onDelete={() => handleDelete(bug._id)}
              isDeleting={deletingId === bug._id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BugList;
