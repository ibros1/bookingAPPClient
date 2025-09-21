export interface iGetAllAccessDriversResponse {
  isSuccess: boolean;
  message: string;
  drivers: Driver[];
  pagination: Pagination;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  googleId: null;
  profilePhoto: null | string;
  phone: null | string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  isDriver: boolean;
  createdAt: Date;
  updatedAt: Date;
  vehicleId: null;
  vehicle: Vehicle[];
}

export interface Vehicle {
  id: string;
  name: string;
  vehicleNo: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface iGetAllAccessDriversPayload {
  page: number;
  limit: number;
}
