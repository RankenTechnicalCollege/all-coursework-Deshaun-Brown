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
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      const response = await fetch(`${base}/bugs/${bugId}`, { 
        credentials: 'include' 
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch bug (${response.status})`);
      }
      
      const data = await response.json();
      setBug(data);
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
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      const endpoint = bug?._id 
        ? `${base}/bugs/${bug._id}`
        : `${base}/bugs`;
      const method = bug?._id ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save bug (${response.status})`);
      }
      
      await response.json();

      const message = bug?._id ? "Bug updated successfully!" : "Bug created successfully!";
      showSuccess(message);
      
      setTimeout(() => {
        navigate("/bugs");
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save bug";
      showError(errorMsg);
      console.error("Save bug error:", err);
    }
  };

  const handleCancel = () => {
    navigate("/bugs");
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
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  );
}

export default BugEditorPage;