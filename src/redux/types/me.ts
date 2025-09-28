export interface iGetWhoAmiResponse {
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
}
