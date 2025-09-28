export interface iListedBookersResponse {
  isSuccess: boolean;
  message: string;
  bookers: Booker[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface Booker {
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
