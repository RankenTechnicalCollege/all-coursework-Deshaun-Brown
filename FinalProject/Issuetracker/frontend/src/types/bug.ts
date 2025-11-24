export interface Bug {
  _id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}