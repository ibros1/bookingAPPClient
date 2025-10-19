// src/constants/userRoles.ts
export const USER_ROLES = ["ADMIN", "OFFICER", "BOOKER", "USER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  ADMIN: "Full access",
  OFFICER: "Operational staff",
  BOOKER: "Booking operator",
  USER: "Regular user",
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: ["MANAGE_USERS", "VIEW_REPORTS", "MANAGE_SETTINGS"],
  OFFICER: ["VIEW_REPORTS", "MANAGE_BOOKINGS"],
  BOOKER: ["CREATE_BOOKINGS"],
  USER: [],
};
