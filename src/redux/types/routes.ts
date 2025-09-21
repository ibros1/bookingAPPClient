export interface iListedRouteResponse {
  isSuccess: boolean;
  routes: Route[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface Route {
  id: string;
  userId: string;
  from: string;
  end: string;
  createdAt: Date;
  updatedAt: Date;
  createdUser: CreatedUser;
}

export interface CreatedUser {
  id: string;
  name: string;
  email: string;
  googleId: null;
  profilePhoto: string;
  phone: null;
  password: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  isDriver: boolean;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
  vehicleId: null;
}

// create routes
export interface iCreatedRoutesResponse {
  isSuccess: boolean;
  message: string;
  route: Route;
}

export interface Route {
  id: string;
  userId: string;
  from: string;
  end: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface iCreatedRoutesPayload {
  userId: string;
  from: string;
  end: string;
}
