export interface iCreatedUserPayload {
  name: string;
  phone: string;
  password: string;
  address: string;
  confirmPassword: string;
}
export interface iCreatedUserResponse {
  isSuccess: boolean;
  message: string;
  newUser: NewUser;
}

export interface NewUser {
  id: string;
  name: string;
  email: null;
  profilePhoto: null;
  address: string;
  phone: string;
  password: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  refreshToken: null;
  createdAt: Date;
  updatedAt: Date;
}

export interface iLoginUserResponse {
  isSuccess: boolean;
  message: string;
  user: User;
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: null;
  profilePhoto: null;
  address: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  refreshToken: null;
  createdAt: Date;
  updatedAt: Date;
}

export interface iLoginUserPayload {
  phone: string;
  password: string;
}

export interface iListOfiicersResponse {
  isSuccess: boolean;
  message: string;
  officers: Officer[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface Officer {
  id: string;
  name: string;
  email: null;
  profilePhoto: null;
  address: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface iListedOfficersPayload {
  page: number;
  perPage: number;
}
