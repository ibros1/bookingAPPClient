// User Management Types
export interface CreateUserPayload {
  name: string;
  email?: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
  role: UserRole;
  permissions?: Permission[];
}

export interface CreateUserResponse {
  isSuccess: boolean;
  message: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  role: UserRole;
  permissions?: Permission[];
  isActive: boolean;
  isVerified?: boolean;
  profilePhoto?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  bookings?: any[];
}

export const UserRole = {
  ADMIN: "ADMIN",
  OFFICER: "OFFICER",
  BOOKER: "BOOKER",
  USER: "USER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const Permission = {
  // User Management
  CREATE_USER: "CREATE_USER",
  READ_USER: "READ_USER",
  UPDATE_USER: "UPDATE_USER",
  DELETE_USER: "DELETE_USER",

  // Role Management
  MANAGE_ROLES: "MANAGE_ROLES",
  ASSIGN_ROLES: "ASSIGN_ROLES",

  // Booking Management
  CREATE_BOOKING: "CREATE_BOOKING",
  READ_BOOKING: "READ_BOOKING",
  UPDATE_BOOKING: "UPDATE_BOOKING",
  DELETE_BOOKING: "DELETE_BOOKING",

  // Route Management
  CREATE_ROUTE: "CREATE_ROUTE",
  READ_ROUTE: "READ_ROUTE",
  UPDATE_ROUTE: "UPDATE_ROUTE",
  DELETE_ROUTE: "DELETE_ROUTE",

  // Hotel Management
  CREATE_HOTEL: "CREATE_HOTEL",
  READ_HOTEL: "READ_HOTEL",
  UPDATE_HOTEL: "UPDATE_HOTEL",
  DELETE_HOTEL: "DELETE_HOTEL",

  // Employee Management
  CREATE_EMPLOYEE: "CREATE_EMPLOYEE",
  READ_EMPLOYEE: "READ_EMPLOYEE",
  UPDATE_EMPLOYEE: "UPDATE_EMPLOYEE",
  DELETE_EMPLOYEE: "DELETE_EMPLOYEE",

  // Message Management
  SEND_MESSAGE: "SEND_MESSAGE",
  READ_MESSAGE: "READ_MESSAGE",

  // Reports
  VIEW_REPORTS: "VIEW_REPORTS",
  EXPORT_REPORTS: "EXPORT_REPORTS",

  // Activity Logs
  VIEW_LOGS: "VIEW_LOGS",

  // Address Management
  CREATE_ADDRESS: "CREATE_ADDRESS",
  READ_ADDRESS: "READ_ADDRESS",
  UPDATE_ADDRESS: "UPDATE_ADDRESS",
  DELETE_ADDRESS: "DELETE_ADDRESS",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export interface RolePermission {
  role: UserRole;
  permissions: Permission[];
  description: string;
}

export interface UpdateUserRolePayload {
  userId: string;
  role: UserRole;
  permissions?: Permission[];
}

export interface UpdateUserRoleResponse {
  isSuccess: boolean;
  message: string;
  user: User;
}

export interface UserListResponse {
  isSuccess: boolean;
  message: string;
  users: User[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface UserListPayload {
  page: number;
  perPage: number;
  role?: UserRole;
  search?: string;
}

export interface DeleteUserPayload {
  userId: string;
}

export interface DeleteUserResponse {
  isSuccess: boolean;
  message: string;
}

export interface UpdateUserPayload {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
}

export interface UpdateUserResponse {
  isSuccess: boolean;
  message: string;
  user: User;
}

// Role-Permission Mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.MANAGE_ROLES,
    Permission.ASSIGN_ROLES,
    Permission.CREATE_BOOKING,
    Permission.READ_BOOKING,
    Permission.UPDATE_BOOKING,
    Permission.DELETE_BOOKING,
    Permission.CREATE_ROUTE,
    Permission.READ_ROUTE,
    Permission.UPDATE_ROUTE,
    Permission.DELETE_ROUTE,
    Permission.CREATE_HOTEL,
    Permission.READ_HOTEL,
    Permission.UPDATE_HOTEL,
    Permission.DELETE_HOTEL,
    Permission.CREATE_EMPLOYEE,
    Permission.READ_EMPLOYEE,
    Permission.UPDATE_EMPLOYEE,
    Permission.DELETE_EMPLOYEE,
    Permission.SEND_MESSAGE,
    Permission.READ_MESSAGE,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_LOGS,
    Permission.CREATE_ADDRESS,
    Permission.READ_ADDRESS,
    Permission.UPDATE_ADDRESS,
    Permission.DELETE_ADDRESS,
  ],
  [UserRole.OFFICER]: [
    Permission.READ_USER,
    Permission.READ_BOOKING,
    Permission.UPDATE_BOOKING,
    Permission.READ_ROUTE,
    Permission.READ_HOTEL,
    Permission.UPDATE_HOTEL,
    Permission.CREATE_EMPLOYEE,
    Permission.READ_EMPLOYEE,
    Permission.UPDATE_EMPLOYEE,
    Permission.SEND_MESSAGE,
    Permission.READ_MESSAGE,
    Permission.VIEW_REPORTS,
    Permission.READ_ADDRESS,
    Permission.UPDATE_ADDRESS,
  ],
  [UserRole.BOOKER]: [
    Permission.CREATE_BOOKING,
    Permission.READ_BOOKING,
    Permission.READ_ROUTE,
    Permission.READ_HOTEL,
    Permission.VIEW_REPORTS,
  ],
  [UserRole.USER]: [
    Permission.READ_BOOKING,
    Permission.READ_ROUTE,
    Permission.READ_HOTEL,
  ],
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Full system access with all permissions",
  [UserRole.OFFICER]: "Management access for bookings, hotels, and employees",
  [UserRole.BOOKER]: "Can create and manage bookings",
  [UserRole.USER]: "Basic read-only access",
};
