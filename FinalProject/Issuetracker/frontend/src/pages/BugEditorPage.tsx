import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BugEditor } from "@/components/BugEditor";
import { CommentsList } from "@/components/CommentsList";
import { showError, showSuccess } from "@/lib/utils";
import type { Bug } from "@/types/bug";
import { Search, Save, User, DoorOpen, DoorClosed, MessageSquare, Bug as BugIcon } from "lucide-react";

export function BugEditorPage() {
  const { bugId } = useParams<{ bugId: string }>();
  const navigate = useNavigate();
  const [bug, setBug] = useState<Bug | undefined>();
  const [isLoading, setIsLoading] = useState(!!bugId); // Only load if editing
  const [commentText, setCommentText] = useState("");
  const [classification, setClassification] = useState<string>("");
  const [status, setStatus] = useState<string>("Open");
  const [users, setUsers] = useState<Array<{ _id: string; name?: string; email?: string }>>([]);
  const [assignedUserId, setAssignedUserId] = useState<string>("");
  const [assignedUserName, setAssignedUserName] = useState<string>("");

  useEffect(() => {
    if (bugId) {
      fetchBug();
    }
  }, [bugId]);

  const fetchBug = async () => {
    if (!bugId) return;
    
    setIsLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await fetch(`${base}/api/bugs/${bugId}`, { 
        credentials: 'include' 
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          showError("Please log in to edit bugs.");
          navigate("/login");
          return;
        }
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
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const endpoint = bug?._id 
        ? `${base}/api/bugs/${bug._id}`
        : `${base}/api/bugs`;
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
  if (isLoading && bugId) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading bug...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Initialize selects from bug
    if (bug) {
      setClassification(bug.classification ?? "");
      setStatus(bug.closed ? "Closed" : "Open");
      setAssignedUserId((bug as any).assignedToUserId ?? "");
      setAssignedUserName((bug as any).assignedToUserName ?? "");
    }
  }, [bug]);

  useEffect(() => {
    // Load users for assignment select
    const loadUsers = async () => {
      try {
        const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const res = await fetch(`${base}/api/users`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch {}
    };
    loadUsers();
  }, []);

  const postComment = async () => {
    if (!bugId || !commentText.trim()) return;
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${base}/api/bugs/${bugId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: commentText.trim(),
          operationAuthor: bug?.authorOfBug || bug?.createdBy || "unknown",
        }),
      });
      if (!res.ok) throw new Error(`Failed to post comment (${res.status})`);
      setCommentText("");
      showSuccess("Comment posted");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to post comment";
      showError(msg);
    }
  };

  const updateClassification = async () => {
    if (!bugId || !classification) return;
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${base}/api/bugs/${bugId}/classify`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classification }),
      });
      if (!res.ok) throw new Error(`Failed to update classification (${res.status})`);
      showSuccess("Classification updated");
      fetchBug();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update classification";
      showError(msg);
    }
  };

  const assignUser = async () => {
    if (!bugId || !assignedUserId || !assignedUserName) return;
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${base}/api/bugs/${bugId}/assign`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToUserId: assignedUserId, assignedToUserName: assignedUserName }),
      });
      if (!res.ok) throw new Error(`Failed to assign user (${res.status})`);
      showSuccess("User assigned");
      fetchBug();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to assign user";
      showError(msg);
    }
  };

  const updateStatus = async () => {
    if (!bugId) return;
    try {
      const closed = status === "Closed";
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${base}/api/bugs/${bugId}/close`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ closed }),
      });
      if (!res.ok) throw new Error(`Failed to update status (${res.status})`);
      showSuccess("Status updated");
      fetchBug();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      showError(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BugIcon className="h-8 w-8" />
          {bugId ? "Edit Bug" : "Create Bug"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {bugId ? "Update bug information and submit" : "Create a new bug report"}
        </p>
      </div>

      <BugEditor 
        bug={bug}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      {bugId && (
        <div className="space-y-6">
          {/* Post Comment: single input + Post button in flex */}
          <div className="flex items-center gap-2">
            <input
              className="flex-1 px-3 py-2 border rounded-md"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="btn btn-primary px-4 py-2 rounded-md bg-primary text-primary-foreground flex items-center gap-2" onClick={postComment}>
              <MessageSquare className="h-4 w-4" />
              Post
            </button>
          </div>

          {/* Classify Bug: shadcn Select + Update button */}
          <div className="flex items-center gap-2">
            <div className="min-w-48">
              {/* Using native select to keep dependencies light; can swap to shadcn Select if desired */}
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
              >
                <option value="bug">Bug</option>
                <option value="feature">Feature</option>
                <option value="enhancement">Enhancement</option>
                <option value="documentation">Documentation</option>
                <option value="duplicate">Duplicate</option>
                <option value="invalid">Invalid</option>
                <option value="Validation">Validation</option>
              </select>
            </div>
            <button className="btn btn-secondary px-4 py-2 rounded-md border flex items-center gap-2" onClick={updateClassification}>
              <Save className="h-4 w-4" />
              Update
            </button>
          </div>

          {/* Assign User: shadcn Select + Assign button */}
          <div className="flex items-center gap-2">
            <div className="min-w-64">
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={assignedUserId}
                onChange={(e) => {
                  const id = e.target.value;
                  setAssignedUserId(id);
                  const u = users.find(u => u._id === id);
                  setAssignedUserName(u?.name || u?.email || "");
                }}
              >
                <option value="">Select a user...</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name || u.email || u._id}</option>
                ))}
              </select>
            </div>
            <button className="btn px-4 py-2 rounded-md border flex items-center gap-2" onClick={assignUser}>
              <User className="h-4 w-4" />
              Assign
            </button>
          </div>

          {/* Status Toggle: shadcn Select (Open/Closed) + Update button */}
          <div className="flex items-center gap-2">
            <div className="min-w-40">
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <button className="btn px-4 py-2 rounded-md border flex items-center gap-2" onClick={updateStatus}>
              {status === "Closed" ? <DoorClosed className="h-4 w-4" /> : <DoorOpen className="h-4 w-4" />}
              Update
            </button>
          </div>

          <CommentsList bugId={bugId} />
        </div>
      )}
    </div>
  );
}

export default BugEditorPage;