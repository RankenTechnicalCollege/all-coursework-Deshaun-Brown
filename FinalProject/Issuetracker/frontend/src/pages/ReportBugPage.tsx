import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showError, showSuccess } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportBugPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stepsToReproduce: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.title.trim() || !formData.description.trim() || !formData.stepsToReproduce.trim()) {
      showError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${base}/api/bug/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to report bug (${res.status})`);
      }

      const data = await res.json();
      showSuccess("Bug reported successfully!");
      
      // Clear form
      setFormData({ title: "", description: "", stepsToReproduce: "" });
      
      // Navigate to bugs list
      setTimeout(() => navigate("/bugs"), 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to report bug";
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Report a Bug</CardTitle>
            <CardDescription>
              Help us improve by reporting any issues you encounter
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Bug Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Brief description of the bug"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description *
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of the issue"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={4}
                  required
                />
              </div>

              {/* Steps to Reproduce */}
              <div className="space-y-2">
                <label htmlFor="stepsToReproduce" className="text-sm font-medium">
                  Steps to Reproduce *
                </label>
                <Textarea
                  id="stepsToReproduce"
                  name="stepsToReproduce"
                  placeholder="Step-by-step instructions to reproduce the bug"
                  value={formData.stepsToReproduce}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={4}
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Reporting..." : "Report Bug"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/bugs")}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ReportBugPage;
