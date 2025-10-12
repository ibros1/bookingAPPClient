export interface iListedLogsResponse {
  isSuccess: boolean;
  message: string;
  activityLogs: ActivityLog[];
  total: number;
  page: number;
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
}

export interface Details {
  message: string;
  employee: Employee;
  creatorName: string;
  creatorRole: string;
  creatorEmail: null;
  creatorPhone: string;
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

export interface iListedLogsPayload {
  page: number;
  perPage: number;
}
