export interface iCreatedBookingPayload {
  userId: string;
  scheduleRideId: string;
  seatIds: string[];
  name: string;
  phoneNumber: string;
  amount: number;
  qty: number;
  paymentType: string;
  currency: string;
  paymentStatus: string;
}

export interface iCreatedBookingResponse {
  isSuccess: boolean;
  message: string;
  booking: Booking;
}

export interface Booking {
  id: string;
  userId: string;
  scheduleRideId: string;
  seatsIds: string[];
  name: string;
  phoneNumber: string;
  amount: number;
  qty: number;
  total_amount: number;
  paymentType: string;
  currency: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewBooking {
  count: number;
}

export interface iListedAllBookings {
  isSuccess: boolean;
  bookings: Booking[];
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
  user: User;
  scheduleRide: ScheduleRide;
  seat: Seat;
}

export interface ScheduleRide {
  id: string;
  routeId: string;
  userId: string;
  vehicleId: string;
  driverId: string;
  fare: number;
  totalSeats: number;
  takenSeats: [];
  startTime: Date;
  endTime: Date;
  day: string;
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

export interface User {
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

// get one by ride
export interface iGetOneBookingByRide {
  isSuccess: boolean;
  bookings: Booking[];
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
  user: User;
  seat: Seat;
  scheduleRide: ScheduleRide;
}

export interface ScheduleRide {
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
}

export interface Seat {
  id: string;
  seatNumber: number;
  isBooked: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
}

// get all
export interface iListedAllBookingsResponse {
  isSuccess: boolean;
  total: number;
  page: number;
  limit: number;
  bookings: Booking[];
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
  user: User;
  scheduleRide: ScheduleRide;
  seat: Seat;
}

export interface ScheduleRide {
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
}

export interface Seat {
  id: string;
  vehicleId: string;
  scheduleRideId: string;
  seatNumber: number;
  isBooked: boolean;
}

export interface User {
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
