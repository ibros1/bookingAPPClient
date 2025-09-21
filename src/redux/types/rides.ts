export interface iListedRidesResponse {
  isSuccess: boolean;
  rides: Ride[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
export interface iListedRidesPayload {
  page: number;
  perPage: number;
}

export interface Ride {
  id: string;
  routeId: string;
  userId: string;
  vehicleId: string;
  driverId: string;
  fare: number;
  totalSeats: number;
  takenSeats: string[];
  startTime: Date;
  endTime: Date;
  day: string;
  createdAt: Date;
  updatedAt: Date;
  vehicle: Vehicle;
  driver: Driver;
  route: Route;
}

export interface Driver {
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

export interface Route {
  id: string;
  userId: string;
  from: string;
  end: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: string;
  vehicleNo: string;
  name: string;
  driverId: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface iCreatedRidesResponse {
  isSuccess: boolean;
  message: string;
  ride: Ride;
}

export interface Ride {
  id: string;
  routeId: string;
  userId: string;
  vehicleId: string;
  driverId: string;
  fareUSD: number;
  fareSLSH: number;
  totalSeats: number;

  startTime: Date;
  endTime: Date;
  day: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface iCreatedRidesPayload {
  userId: string;
  vehicleId: string;
  driverId: string;
  fareUSD: number;
  fareSLSH: number;
  day: string;
  startTime: Date;
  endTime: Date;
}

// getOneRide
export interface iGetOneRide {
  isSuccess: boolean;
  ride: Ride;
}

export interface Ride {
  id: string;
  routeId: string;
  userId: string;
  vehicleId: string;
  driverId: string;
  fare: number;
  totalSeats: number;
  startTime: Date;
  endTime: Date;
  day: string;
  createdAt: Date;
  updatedAt: Date;
  vehicle: Vehicle;
  driver: Driver;
  route: Route;
  bookings: Booking[];
  seats: Seat[];
}

export interface Booking {
  id: string;
  userId: string;
  scheduleRideId: string;
  seatId: string;
  paymentType: string;
  currency: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Driver {
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

export interface Route {
  id: string;
  userId: string;
  from: string;
  end: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Seat {
  id: string;
  vehicleId: string;
  scheduleRideId: string;
  seatNumber: number;
  isBooked: boolean;
}

export interface Vehicle {
  id: string;
  vehicleNo: string;
  name: string;
  driverId: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

// getRidesByRoute
export interface iGetRidesByRoutesRespone {
  isSuccess: boolean;
  rides: Ride[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface Ride {
  id: string;
  routeId: string;
  userId: string;
  vehicleId: string;
  driverId: string;
  fareUSD: number;
  fareSLSH: number;
  totalSeats: number;
  takenSeats: string[];
  startTime: Date;
  endTime: Date;
  day: string;
  createdAt: Date;
  updatedAt: Date;
  vehicle: Vehicle;
  driver: Driver;
  route: Route;
  bookings: Booking[];
  seats: Seat[];
}

export interface Booking {
  id: string;
  userId: string;
  scheduleRideId: string;
  seatId: string;
  paymentType: string;
  currency: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
}

export interface Route {
  id: string;
  userId: string;
  from: string;
  end: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Seat {
  id: string;
  vehicleId: string;
  scheduleRideId: string;
  seatNumber: number;
  isBooked: boolean;
}

export interface Vehicle {
  id: string;
  vehicleNo: string;
  name: string;
  driverId: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface iGetRidesByRoutesPayload {
  route_id: string;
  page?: number;
  perPage?: number;
  date: string;
}
