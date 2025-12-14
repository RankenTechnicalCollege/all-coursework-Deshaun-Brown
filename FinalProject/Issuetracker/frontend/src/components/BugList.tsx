import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/lib/utils";
import type { Bug } from "@/types/bug";
import { BugListItem } from "@/components/BugListItem";
import { Filter } from "lucide-react";

export function BugList() {
  const navigate = useNavigate();
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    fetchBugs();
  }, [sortBy]);

  const fetchBugs = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const base = import.meta.env.VITE_API_URL || "http://localhost:8080";

    const params = new URLSearchParams({
      sortBy,
      pageSize: "1000",
    });

    const res = await fetch(
      `${base}/api/bugs?${params.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch bugs (${res.status})`);
    }

    const data: Bug[] | { bugs: Bug[] } = await res.json();
    const bugsList = Array.isArray(data) ? data : data?.bugs ?? [];

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
    navigate(`/bug/${bugId}`);
  };

  const handleDelete = async (bugId: string) => {
    if (!window.confirm("Are you sure you want to delete this bug?")) return;

    setDeletingId(bugId);

    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";

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
          <Button onClick={() => navigate("/bug/new")}>Create Bug</Button>
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

  // EMPTY UI
  if (bugs.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div />
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

  const statuses = ["all", "open", "in-progress", "resolved", "closed"];
  const priorities = ["all", "low", "medium", "high", "critical"];

  const filteredBugs = bugs.filter((bug) => {
    const matchesStatus =
      statusFilter === "all" || bug.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || bug.priority === priorityFilter;

    return matchesStatus && matchesPriority;
  });

  // Backend now handles sorting, but keep this for immediate client-side re-filtering
  const sortedBugs = filteredBugs;

  return (
    <div className="space-y-6">
      {/* FILTERS */}
      <div className="space-y-4 bg-muted p-6 rounded-xl border overflow-visible">
        {/* SORT */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Sort By
          </label>
          <div className="flex flex-wrap gap-2">
            {["newest", "oldest", "title"].map((sort) => (
              <Button
                key={sort}
                variant={sortBy === sort ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(sort)}
                className="capitalize"
              >
                {sort === "newest" ? "Newest First" : sort === "oldest" ? "Oldest First" : "Title A-Z"}
              </Button>
            ))}
          </div>
        </div>

        {/* STATUS FILTER */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Filter className="h-3.5 w-3.5" />
            Status Filter
          </label>

          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="capitalize"
              >
                {status === "all" ? "All" : status.replace("-", " ")}
              </Button>
            ))}
          </div>
        </div>

        {/* PRIORITY FILTER */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Priority Filter
          </label>
          <div className="flex flex-wrap gap-2">
            {priorities.map((priority) => (
              <Button
                key={priority}
                variant={priorityFilter === priority ? "default" : "outline"}
                size="sm"
                onClick={() => setPriorityFilter(priority)}
                className="capitalize"
              >
                {priority === "all" ? "All" : priority}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredBugs.length} of {bugs.length} bugs
      </p>

      {/* BUG LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedBugs.map((bug, index) => (
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

      {/* EMPTY FILTER RESULTS */}
      {filteredBugs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No bugs found matching your criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setStatusFilter("all");
              setPriorityFilter("all");
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default BugList;
