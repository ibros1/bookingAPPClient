export interface iGetWhoAMi {
  isSuccess: boolean;
  user: User;
}

export interface User {
  id: string;
  name: null;
  email: string;
  googleId: null;
  profilePhoto: null;
  phone: null;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
