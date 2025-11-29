import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BugEditor } from "@/components/BugEditor";
import { showError, showSuccess } from "@/lib/utils";
import type { Bug } from "@/types/bug";

export function BugEditorPage() {
  const { bugId } = useParams<{ bugId: string }>();
  const navigate = useNavigate();
  const [bug, setBug] = useState<Bug | undefined>();
  const [isLoading, setIsLoading] = useState(!!bugId); // Only load if editing

  useEffect(() => {
    if (bugId) {
      fetchBug();
    }
  }, [bugId]);

  const fetchBug = async () => {
    if (!bugId) return;
    
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bugs/${bugId}`);
      // if (!response.ok) throw new Error('Failed to fetch bug');
      // const data = await response.json();
      // setBug(data);

      // Mock: simulate fetching bug
      const mockBug: Bug = {
        _id: bugId,
        title: "It's broken, please fix.",
        description: "Critical functionality is broken and needs immediate attention",
        priority: "critical",
        status: "open",
        createdBy: "DeSean Brown",
        assignedTo: "Paul Smith",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      setBug(mockBug);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch bug";
      showError(errorMsg);
      console.error("Fetch bug error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: Partial<Bug>) => {
    try {
      // TODO: Call API to save bug
      // const endpoint = bug?._id 
      //   ? `${import.meta.env.VITE_API_URL}/api/bugs/${bug._id}`
      //   : `${import.meta.env.VITE_API_URL}/api/bugs`;
      // const method = bug?._id ? 'PUT' : 'POST';
      // const response = await fetch(endpoint, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // if (!response.ok) throw new Error('Failed to save bug');
      // const savedBug = await response.json();

      const message = bug?._id ? "Bug updated successfully!" : "Bug created successfully!";
      showSuccess(message);
      console.log("Bug saved:", data);
      
      setTimeout(() => {
        navigate("/bug/list");
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save bug";
      showError(errorMsg);
      console.error("Save bug error:", err);
    }
  };

  const handleCancel = () => {
    navigate("/bug/list");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading bug...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{bugId ? "Edit Bug" : "Create Bug"}</h1>
        <p className="text-muted-foreground mt-2">
          {bugId ? "Update bug information and submit" : "Create a new bug report"}
        </p>
      </div>

      <BugEditor 
        bug={bug}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default BugEditorPage;