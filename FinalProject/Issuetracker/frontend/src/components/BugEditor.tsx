import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showError, showSuccess } from "@/lib/utils";
import type { Bug } from "@/types/bug";

// Zod schema for bug validation
const bugSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  
  priority: z
    .enum(["low", "medium", "high", "critical"])
    .default("medium"),
  
  status: z
    .enum(["open", "in-progress", "closed"])
    .default("open"),
  
  assignedTo: z
    .string()
    .optional()
    .or(z.literal(""))
});

type BugFormData = z.infer<typeof bugSchema>;

interface BugEditorProps {
  bug?: Bug;
  onSave: (data: Partial<Bug>) => Promise<void> | void;
  onCancel: () => void;
}

export function BugEditor({ bug, onSave, onCancel }: BugEditorProps) {
  const [formData, setFormData] = useState<BugFormData>({
    title: bug?.title || "",
    description: bug?.description || "",
    priority: bug?.priority || "medium",
    status: bug?.status || "open",
    assignedTo: bug?.assignedTo || ""
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof BugFormData, string>>>({});
  const [backendError, setBackendError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (bug) {
      setFormData({
        title: bug.title,
        description: bug.description,
        priority: bug.priority,
        status: bug.status,
        assignedTo: bug.assignedTo || ""
      });
    }
  }, [bug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name as keyof BugFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError("");
    setErrors({});

    // Validate with Zod
    const validation = bugSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof BugFormData, string>> = {};
      validation.error.issues.forEach(error => {
        const field = error.path[0] as keyof BugFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      const firstError = Object.values(fieldErrors)[0];
      if (firstError) showError(firstError);
      return;
    }

    setIsLoading(true);

    try {
      await onSave(validation.data);
      const message = bug?._id ? "Bug updated successfully!" : "Bug created successfully!";
      showSuccess(message);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save bug";
      setBackendError(errorMsg);
      showError(errorMsg);
      console.error("Save bug error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{bug?._id ? "Edit Bug" : "Create Bug"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Backend Error Message */}
          {backendError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              ⚠️ {backendError}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Brief bug title"
              disabled={isLoading}
            />
            {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none h-32 transition-all ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Detailed bug description"
              disabled={isLoading}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Priority <span className="text-red-600">*</span>
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status <span className="text-red-600">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <label htmlFor="assignedTo" className="text-sm font-medium">
              Assigned To
            </label>
            <input
              id="assignedTo"
              name="assignedTo"
              type="text"
              value={formData.assignedTo}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.assignedTo ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="User name or ID (optional)"
              disabled={isLoading}
            />
            {errors.assignedTo && <p className="text-sm text-red-600">{errors.assignedTo}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Bug"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default BugEditor;