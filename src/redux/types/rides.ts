export interface iCreatedRidesPayload {
  userId: string;
  routeId: string;
  fareUSD: number;
  fareSLSH: number;
}

export interface iCreatedRidesResponse {
  isSuccess: boolean;
  message: string;
  ride: Ride;
}

export interface Ride {
  id: string;
  userId: string;
  routeId: string;
  fareUSD: number;
  fareSLSH: number;
}

export interface iListedRidesResponse {
  isSuccess: boolean;
  rides: Ride[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface Ride {
  id: string;
  userId: string;
  routeId: string;
  fareUSD: number;
  fareSLSH: number;
  user: User;
  route: Route;
}

export interface Route {
  id: string;
  from: string;
  end: string;
}

export interface User {
  id: string;
  name: string;
  email: null;
  role: string;
  profilePhoto: null;
  address: string;
}

export interface iListedRidesPayload {
  page: number;
  perPage: number;
}

export interface iGetOneRideResponse {
  isSuccess: boolean;
  ride: Ride;
}

export interface Ride {
  id: string;
  userId: string;
  routeId: string;
  fareUSD: number;
  fareSLSH: number;
  user: User;
  route: Route;
}

export interface Route {
  id: string;
  from: string;
  end: string;
}

export interface User {
  id: string;
  name: string;
  email: null;
  role: string;
  profilePhoto: null;
  address: string;
}

export interface iUpdateRidePayload {
  id: string;
  fareUSD: number;
  fareSLSH: number;
}

export interface iUpdateRideResponse {
  isSuccess: boolean;
  message: string;
  ride: Ride;
}

export interface Ride {
  id: string;
  userId: string;
  routeId: string;
  fareUSD: number;
  fareSLSH: number;
}

export interface iDeltedRideResponse {
  isSuccess: boolean;
  message: string;
}
