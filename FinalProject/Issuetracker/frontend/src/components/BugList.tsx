import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { showError, showSuccess, cn } from "@/lib/utils";
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
      const data: Bug[] | { bugs: Bug[] } = await res.json();
      const bugsList = Array.isArray(data) ? data : data?.bugs || [];
      setBugs(bugsList);
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
      const base = import.meta.env.VITE_API_URL;
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

  const statuses = ["all", "open", "in-progress", "resolved", "closed"];
  const priorities = ["all", "low", "medium", "high", "critical"];

  const filteredBugs = bugs.filter(bug => {
    const matchesStatus = statusFilter === "all" || bug.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || bug.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const getStatusButtonClass = (status: string, isActive: boolean) => {
    if (!isActive) return "";
    const classes: Record<string, string> = {
      open: "bg-green-100 text-green-800 border-green-300",
      "in-progress": "bg-purple-100 text-purple-800 border-purple-300",
      resolved: "bg-teal-100 text-teal-800 border-teal-300",
      closed: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return classes[status] || "bg-primary/20 text-primary border-primary";
  };

  // Bugs list
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4 bg-gray-50 p-6 rounded-lg border">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Filter className="h-3.5 w-3.5" />
            Status Filter
          </label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Button
                key={status}
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "capitalize",
                  statusFilter === status && getStatusButtonClass(status, true)
                )}
              >
                {status === "all" ? "All" : status.replace("-", " ")}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Priority Filter</label>
          <div className="flex flex-wrap gap-2">
            {priorities.map((priority) => (
              <Button
                key={priority}
                variant="outline"
                size="sm"
                onClick={() => setPriorityFilter(priority)}
                className={cn(
                  "capitalize",
                  priorityFilter === priority && "bg-primary/20 text-primary border-primary"
                )}
              >
                {priority === "all" ? "All" : priority}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredBugs.length} of {bugs.length} bugs
      </p>

      {/* Bugs grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredBugs.map((bug, index) => (
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

      {filteredBugs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No bugs found matching your criteria.</p>
          <Button variant="outline" onClick={() => { setStatusFilter("all"); setPriorityFilter("all"); }} className="mt-4">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default BugList;