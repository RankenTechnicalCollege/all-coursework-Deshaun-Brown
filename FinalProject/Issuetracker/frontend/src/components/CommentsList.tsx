import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { showError } from "@/lib/utils";

export interface BugComment {
  comment: string;
  operationAuthor: string;
  dateTime: string;
  text?: string;
  createdBy?: string;
}

interface CommentsListProps {
  bugId: string;
}

export function CommentsList({ bugId }: CommentsListProps) {
  const [comments, setComments] = useState<BugComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      setError("");
      try {
        const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const res = await fetch(`${base}/api/bugs/${bugId}/comments`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to fetch comments (${res.status})`);
        const data = await res.json();
        // Data is expected sorted oldest->newest by backend;
        // defensively sort here too
        const sorted = [...data].sort((a: BugComment, b: BugComment) => {
          return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        });
        setComments(sorted);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load comments";
        setError(msg);
        showError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [bugId]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Comments</Label>
        <div className="text-sm text-muted-foreground">Loading comments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>Comments</Label>
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200 inline-block">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label>Comments</Label>
      {comments.length === 0 ? (
        <div className="text-sm text-muted-foreground">No comments yet.</div>
      ) : (
        <ul className="space-y-3">
          {comments.map((c, idx) => (
            <li key={idx} className="border rounded-lg p-3">
              <div className="text-sm font-medium">
                {c.operationAuthor} — <span className="text-muted-foreground">{new Date(c.dateTime).toLocaleString()}</span>
              </div>
              <div className="text-sm mt-1">{c.comment}</div>
              {c.text && <div className="text-xs text-muted-foreground mt-1">{c.text}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentsList;
