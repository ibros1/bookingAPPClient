// list routes
export interface iListedRoutesResponse {
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
  email: null;
  role: string;
  profilePhoto: null;
  address: string;
}

export interface iListedRoutesPaylod {
  page: number;
  perPage: number;
}

// create

export interface iCreatedRoutePayload {
  userId: string;
  from: string;
  end: string;
}

export interface iCreatedRouteResponse {
  isSuccess: boolean;
  message: string;
  route: Route;
}

// update

export interface iUpdatedRoutePayload {
  id: string;
  from?: string;
  end?: string;
}

export interface iUpdatedRouteResponse {
  isSuccess: boolean;
  message: string;
  route: Route;
}

// getOne

export interface iGetOneRouteResponse {
  isSuccess: boolean;
  route: Route;
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
  email: null;
  role: string;
  profilePhoto: null;
  address: string;
}

// deleteRoute

export interface iDeleteRouteResponse {
  isSuccess: boolean;
  message: string;
}
