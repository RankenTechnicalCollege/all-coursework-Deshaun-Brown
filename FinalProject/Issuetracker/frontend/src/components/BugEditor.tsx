import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { showError, showSuccess } from "@/lib/utils";
import type { Bug } from "@/types/bug";

type BugEditorProps = {
  bugId?: string;
  onSave?: (payload: Partial<Bug>) => Promise<void> | void;
  onCancel?: () => void;
};

const bugSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["open", "in-progress", "closed"]),
  assignedTo: z.string().optional().or(z.literal("").transform(() => undefined)),
});

type BugFormData = z.infer<typeof bugSchema>;

export function BugEditor({ bugId: propBugId, onSave, onCancel }: BugEditorProps) {
  const navigate = useNavigate();
  const params = useParams();
  const bugId = useMemo(() => propBugId ?? params.bugId ?? params.id, [propBugId, params]);

  const [formData, setFormData] = useState<BugFormData>({
    title: "",
    description: "",
    priority: "low",
    status: "open",
    assignedTo: undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BugFormData, string>>>({});
  const [backendError, setBackendError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch bug by ID on mount
  useEffect(() => {
    if (!bugId) return;
    const fetchBug = async () => {
      setIsFetching(true);
      setBackendError("");
      try {
        const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
        const res = await fetch(`${base}/bugs/${bugId}`, { credentials: "include" });
        if (!res.ok) throw new Error(`Failed to load bug (${res.status})`);
        const data: Bug = await res.json();
        setFormData({
          title: data.title,
          description: data.description,
          priority: (data.priority as BugFormData["priority"]) ?? "low",
          status: (data.status as BugFormData["status"]) ?? "open",
          assignedTo: data.assignedTo || undefined,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load bug";
        setBackendError(msg);
        showError(msg);
      } finally {
        setIsFetching(false);
      }
    };
    fetchBug();
  }, [bugId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof BugFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setBackendError("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setBackendError("");
    setSuccessMsg("");

    // Frontend validation with Zod
    const validation = bugSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof BugFormData, string>> = {};
      validation.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof BugFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      const firstError = Object.values(fieldErrors)[0];
      if (firstError) showError(firstError);
      return;
    }

    setIsLoading(true);
    try {
      const payload: Partial<Bug> = {
        title: validation.data.title,  
        description: validation.data.description,
        priority: validation.data.priority,
        status: validation.data.status,
      };
      if (validation.data.assignedTo) {
        payload.assignedTo = validation.data.assignedTo;
      }

      const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      const endpoint = bugId ? `${base}/bugs/${bugId}` : `${base}/bugs`;
      const method = bugId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = `Update failed (${res.status})`;
        setBackendError(msg);
        showError(msg);
        setIsLoading(false);
        return;
      }

      await res.json();
      const msg = bugId ? "Bug updated successfully." : "Bug created successfully.";
      setSuccessMsg(msg);
      showSuccess(msg);

      if (onSave) {
        await onSave(payload);
      } else {
        // Navigate back to bugs list after a short delay
        setTimeout(() => navigate("/bugs"), 800);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error while saving bug";
      setBackendError(msg);
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) return onCancel();
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{bugId ? "Edit Bug" : "Create Bug"}</CardTitle>
          <CardDescription>
            {isFetching ? "Loading bug..." : "Update the bug information below"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Backend error message */}
          {backendError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200 mb-4">
              {backendError}
            </div>
          )}

          {/* Success message */}
          {successMsg && (
            <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-200 mb-4">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title field */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                disabled={isFetching || isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Brief summary of the bug"
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description field */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isFetching || isLoading}
                rows={5}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                  errors.description ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Detailed description of the bug, steps to reproduce, expected vs actual behavior..."
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Priority, Status, Assigned To - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Priority field */}
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={isFetching || isLoading}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.priority ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                {errors.priority && (
                  <p className="text-sm text-red-600">{errors.priority}</p>
                )}
              </div>

              {/* Status field */}
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isFetching || isLoading}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.status ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-red-600">{errors.status}</p>
                )}
              </div>

              {/* Assigned To field */}
              <div className="space-y-2">
                <label htmlFor="assignedTo" className="text-sm font-medium">
                  Assigned To
                </label>
                <input
                  id="assignedTo"
                  name="assignedTo"
                  type="text"
                  value={formData.assignedTo ?? ""}
                  onChange={handleChange}
                  disabled={isFetching || isLoading}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.assignedTo ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Optional: name or user ID"
                />
                {errors.assignedTo && (
                  <p className="text-sm text-red-600">{errors.assignedTo}</p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isFetching || isLoading} className="min-w-28">
                {isLoading ? "Saving..." : bugId ? "Update Bug" : "Create Bug"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default BugEditor;