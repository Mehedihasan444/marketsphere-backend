import { Role } from "@prisma/client";

export const UserSearchableFields = ["email"];

export const userFilterableFields: string[] = [
  "email",
  "role",
  "status",
  "searchTerm",
]; // for all filtering

export type IAuthUser = {
  email: string;
  role: Role
} | null;