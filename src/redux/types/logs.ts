export interface iListedLogsResponse {
  isSuccess: boolean;
  message: string;
  activityLogs: ActivityLog[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  targetType: string;
  targetId: string;
  action: string;
  details: Details;
  description: null;
  createdAt: Date;
  user: User;
}

export interface Details {
  message: string;
  employee?: Employee;
  creatorName?: string;
  creatorRole?: string;
  creatorEmail?: string;
  creatorPhone?: string;
  newRole?: string;
  updatedBy?: string;
  userPhone?: string;
  updatedFields?: UpdatedFields;
  userEmail?: string;
}

export interface Employee {
  id: string;
  sex: string;
  name: string;
  notes: string;
  phone: string;
  salary: number;
  status: string;
  userId: string;
  address: string;
  position: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatedFields {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  phone: string;
}

export interface iListedLogsPayload {
  page: number;
  perPage: number;
}
