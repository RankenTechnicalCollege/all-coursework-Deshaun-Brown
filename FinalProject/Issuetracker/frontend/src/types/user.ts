export type UserRole =
  | "developer"
  | "qa"
  | "business analyst"
  | "product manager"
  | "technical manager";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}