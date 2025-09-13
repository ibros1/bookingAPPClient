export interface iLoginUserResponse {
  isSuccess: boolean;
  message: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  googleId: null;
  profilePhoto: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface iLoginUserPayload {
  email: string;
  password: string;
}
export interface ILoginUserGoogleResponse extends User {
  token?: string;
  refreshToken?: string;
}

// register
export interface iCreatedUserResponse {
  isSuccess: boolean;
  message: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  googleId: null;
  profilePhoto: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface iCreatedUserPayload {
  email: string;
  password: string;
  confirmPassword: string;
  isActive: true;
}

//list users
export interface iListAllUsers {
  isSuccess: boolean;
  message: string;
  users: User[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  googleId: null;
  profilePhoto: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  isDriver: boolean;
  createdAt: Date;
  updatedAt: Date;
  vehicleId: null;
}
