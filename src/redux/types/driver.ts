// new Driver
export interface iCreatedDriverPayload {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  isActive: boolean;
  profilePhoto: string;
}

export interface iCreatedDriverResponse {
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
