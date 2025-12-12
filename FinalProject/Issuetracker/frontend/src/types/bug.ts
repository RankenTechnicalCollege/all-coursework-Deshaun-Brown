export interface Bug {
  _id: string;
  title: string;
  description: string;
  status?: "open" | "in-progress" | "closed" | "pending" | "resolved"; // Add more status options
  priority?: "low" | "medium" | "high" | "critical" | "urgent"; // Add more priority options
  createdBy?: string;
  authorOfBug?: string;
  assignedTo?: string;
  assignedToUserId?: string;
  assignedToUserName?: string;
  classification?: string;
  closed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastUpdatedBy?: string;
  lastUpdatedOn?: string;
  stepsToReproduce?: string;
  comments?: any[];
  testCases?: any[];
}