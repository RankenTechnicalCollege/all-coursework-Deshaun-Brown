import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BugListItem } from "@/components/BugListItem";
import { Button } from "@/components/ui/button";
import { showError } from "@/lib/utils";
import type { Bug } from "@/types/bug";

export function BugList() {
  const navigate = useNavigate();
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bugs`);
      // if (!response.ok) throw new Error('Failed to fetch bugs');
      // const data = await response.json();
      // setBugs(data);

      // Mock data for development
      const mockBugs: Bug[] = [
        {
          _id: "1",
          title: "It's broken, please fix.",
          description: "Critical functionality is broken and needs immediate attention",
          priority: "critical",
          status: "open",
          createdBy: "DeSean Brown",
          assignedTo: "Paul Smith",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "2",
          title: "Crash on startup.",
          description: "Application crashes immediately upon launch",
          priority: "high",
          status: "in-progress",
          createdBy: "Paul Smith",
          assignedTo: "Mickey Mouse",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "3",
          title: "I'm not even sure what happened here is the error code 404",
          description: "Received 404 error, unclear what caused it",
          priority: "medium",
          status: "open",
          createdBy: "Mickey Mouse",
          assignedTo: "Donald Duck",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "4",
          title: "Doesn't support wide screen monitors.",
          description: "UI layout breaks on wide screen displays",
          priority: "low",
          status: "closed",
          createdBy: "Donald Duck",
          assignedTo: "DeSean Brown",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "5",
          title: "Text is too small on my 4K monitor.",
          description: "Font size needs to be adjustable for high-resolution displays",
          priority: "medium",
          status: "open",
          createdBy: "DeSean Brown",
          assignedTo: "Paul Smith",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "6",
          title: "Doesn't work on my iPhone 3.",
          description: "Legacy device compatibility issue",
          priority: "low",
          status: "closed",
          createdBy: "Paul Smith",
          assignedTo: "Mickey Mouse",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 500));
      setBugs(mockBugs);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load bugs";
      setError(errorMsg);
      showError(errorMsg);
      console.error("Fetch bugs error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBug = () => {
    navigate("/bug/new");
  };

  const handleDeleteBug = async (bugId: string) => {
    try {
      // TODO: Call API to delete bug
      setBugs(bugs.filter(bug => bug._id !== bugId));
      console.log("Bug deleted:", bugId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete bug";
      showError(errorMsg);
      console.error("Delete bug error:", err);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Bugs</h1>
          <Button onClick={handleCreateBug}>Create Bug</Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading bugs...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Bugs</h1>
          <Button onClick={handleCreateBug}>Create Bug</Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-red-600 text-5xl">⚠️</div>
            <h2 className="text-xl font-semibold">Failed to Load Bugs</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchBugs} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (bugs.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Bugs</h1>
          <Button onClick={handleCreateBug}>Create Bug</Button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-6xl">🐛</div>
            <h2 className="text-xl font-semibold">No bugs found.</h2>
            <p className="text-muted-foreground">
              Create a new bug report to get started.
            </p>
            <Button onClick={handleCreateBug}>Create Your First Bug</Button>
          </div>
        </div>
      </div>
    );
  }

  // Bugs List State
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bugs</h1>
          <p className="text-muted-foreground mt-1">
            {bugs.length} {bugs.length === 1 ? "bug" : "bugs"} found
          </p>
        </div>
        <Button onClick={handleCreateBug}>Create Bug</Button>
      </div>

      <div className="grid gap-4">
        {bugs.map(bug => (
          <BugListItem
            key={bug._id}
            bug={bug}
            onEdit={() => navigate(`/bug/${bug._id}`)}
            onDelete={() => handleDeleteBug(bug._id)}
          />
        ))}
      </div>
    </div>
  );
}

export default BugList;