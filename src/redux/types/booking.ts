export interface iListedBookingsResponse {
  isSuccess: boolean;
  bookings: Booking[];
  meta: Meta;
}

export interface Booking {
  id: string;
  rideId: string;
  bookerId: string;
  currency: string;
  name: string;
  phoneNumber: string;
  amount: number;
  qty: number;
  total_amount: number;
  paymentType: string;
  createdAt: Date;
  ride: {
    id: string;
    userId: string;
    routeId: string;
    fareUSD: number;
    fareSLSH: number;
    route: {
      id: string;
      userId: string;
      from: string;
      end: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  booker: {
    id: string;
    name: string;
    email: null;
    role: string;
    profilePhoto: null;
    phone: string;
  };
}

export interface Meta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface iListedBookingsPayload {
  page: number;
  perPage: number;
}

export interface iCreatedBookingPayload {
  amount: number;
  bookerId: string;
  currency: string;
  name: string;
  phoneNumber: string;
  paymentType: string;
  qty: number;
  rideId: string;
  total_amount: number;
}

export interface iCreatedBookingResponse {
  isSuccess: boolean;
  message: string;
  booking: Booking;
}

export interface Booking {
  id: string;
  rideId: string;
  bookerId: string;
  currency: string;
  name: string;
  phoneNumber: string;
  amount: number;
  qty: number;
  total_amount: number;
  paymentType: string;
  createdAt: Date;
  ride: Ride;
}

export interface Ride {
  id: string;
  userId: string;
  routeId: string;
  fareUSD: number;
  fareSLSH: number;
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

// my-bookings

export interface iListedMyBookingsResponse {
  isSuccess: boolean;
  message: string;
  user: {
    id: string;
    name: string;
    phone: string;
    role: string;
  };
  bookings: Booking[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface Booking {
  id: string;
  rideId: string;
  bookerId: string;
  currency: string;
  name: string;
  phoneNumber: string;
  amount: number;
  qty: number;
  total_amount: number;
  paymentType: string;
  createdAt: Date;
  ride: {
    id: string;
    userId: string;
    routeId: string;
    fareUSD: number;
    fareSLSH: number;
    route: {
      id: string;
      userId: string;
      from: string;
      end: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

export interface iListedMyBookingsPayload {
  page: number;
  perPage: number;
}

// booking detail

export interface iGetOneBookingDetailResponse {
  isSuccess: boolean;
  message: string;
  booking: Booking;
}

export interface Booking {
  id: string;
  rideId: string;
  bookerId: string;
  currency: string;
  name: string;
  phoneNumber: string;
  amount: number;
  qty: number;
  total_amount: number;
  paymentType: string;
  createdAt: Date;
  ride: Ride;
  booker: Booker;
}

export interface Booker {
  id: string;
  name: string;
  email: null;
  phone: string;
  role: string;
  profilePhoto: null;
  address: string;
}

export interface Ride {
  id: string;
  userId: string;
  routeId: string;
  fareUSD: number;
  fareSLSH: number;
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
