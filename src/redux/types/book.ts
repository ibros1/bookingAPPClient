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
