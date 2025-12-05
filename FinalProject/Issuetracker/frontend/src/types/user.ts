export type UserRole = "DEV" | "QA" | "BA" | "PM" | "TM";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
  password?: string;
}