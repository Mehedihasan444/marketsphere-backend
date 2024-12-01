export const USER_ROLE = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
  VENDOR: "VENDOR",
} as const;

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED",
} as const;

export const UserSearchableFields = [
  "name",
  "email",
  "phone",
  "role",
  "status",
];

export const userFilterableFields: string[] = [
  "email",
  "role",
  "status",
  "searchTerm",
]; // for all filtering
