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

// get all users
export interface iListedALlUsersResponse {
  isSuccess: boolean;
  message: string;
  users: User[];
  total: number;
  page: number;
  perPage: number;
}

export interface User {
  id: string;
  name: string;
  email: null;
  role: string;
  address: string;
  phone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  rideId: string;
  bookerId: string;
  currency: string;
  name: string;
  phoneNumber: string;
  amount: number;
  qty: number;
  total_amount: number;
  paymentType: string;
  createdAt: Date;
}

export interface ilIstedUsersPayload {
  page: number;
  perPage: number;
}

// get one user
export interface iGetOneUserResponse {
  isSuccess: boolean;
  user: User;
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
  createdAt: Date;
  updatedAt: Date;
  bookings: Booking[];
  adress: Adress[];
}

export interface Adress {
  id: string;
  address: string;
  userId: string;
  officerId: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface Booking {
  id: string;
  rideId: string;
  bookerId: string;
  currency: string;
  name: string;
  phoneNumber: string;
  amount: number;
  qty: number;
  total_amount: number;
  paymentType: string;
  createdAt: Date;
}

// role
export interface iUpdatedRoleRespone {
  isSuccess: boolean;
  message: string;
  user: User;
}

export interface User {
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

export interface iUpdatedRolePayload {
  phone: string;
  role: string;
}
