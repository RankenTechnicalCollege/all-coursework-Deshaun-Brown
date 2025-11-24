import { useState, useEffect } from "react";
import type { Bug } from "@/types/bug";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BugEditorProps {
  bug?: Bug;
  onSave: (data: Partial<Bug>) => void;
  onCancel: () => void;
}

export function BugEditor({ bug, onSave, onCancel }: BugEditorProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open" as Bug["status"],
    priority: "medium" as Bug["priority"],
    assignedTo: ""
  });
  const [errors, setErrors] = useState<Record<string,string>>({});

  useEffect(() => {
    if (bug) {
      setFormData({
        title: bug.title,
        description: bug.description,
        status: bug.status,
        priority: bug.priority,
        assignedTo: bug.assignedTo || ""
      });
    }
  }, [bug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next: Record<string,string> = {};
    if (!formData.title.trim()) next.title = "Title required";
    if (!formData.description.trim()) next.description = "Description required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...(bug && { _id: bug._id }),
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      assignedTo: formData.assignedTo || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{bug ? "Edit Bug" : "Create Bug"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="title">
                Title *
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
              {errors.title && <p className="text-red-600 text-xs">{errors.title}</p>}
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="description">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
              {errors.description && <p className="text-red-600 text-xs">{errors.description}</p>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium" htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-2 py-2"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-2 py-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium" htmlFor="assignedTo">
                  Assigned To
                </label>
                <input
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {bug ? "Save Changes" : "Create Bug"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}