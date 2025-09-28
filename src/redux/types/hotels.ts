export interface iCreatedHotelResponse {
  isSuccess: boolean;
  message: string;
  hotel: Hotel;
}

export interface Hotel {
  id: string;
  name: string;
  addressId: string;
  bookerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface iCreatedHotelPayload {
  name: string;
  addressId: string;
  bookerId: string;
}

// get all hotels
export interface iListedAllHotelsResponse {
  isSuccess: boolean;
  hotels: Hotel[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface Hotel {
  id: string;
  name: string;
  addressId: string;
  bookerId: string;
  createdAt: Date;
  updatedAt: Date;
  address: Address;
  booker: Booker;
}

export interface Address {
  id: string;
  address: string;
  userId: string;
  officerId: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface Booker {
  id: string;
  name: string;
  email: null;
  role: string;
  profilePhoto: null;
  phone: string;
}

export interface iListedAllHotelsPayload {
  page: number;
  perPage: number;
}

// get one Hotel
export interface iGetOneHotelResponse {
  isSuccess: boolean;
  hotel: Hotel;
}

export interface Hotel {
  id: string;
  name: string;
  addressId: string;
  bookerId: string;
  createdAt: Date;
  updatedAt: Date;
  address: Address;
  booker: Booker;
}

export interface Address {
  id: string;
  address: string;
  userId: string;
  officerId: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface Booker {
  id: string;
  name: string;
  email: null;
  role: string;
  profilePhoto: null;
  phone: string;
}

// update hotel
export interface iUpdatedHotelResponse {
  isSuccess: boolean;
  message: string;
  hotel: Hotel;
}

export interface Hotel {
  id: string;
  name: string;
  addressId: string;
  bookerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface iUpdatedHotelPayload {
  id: string;
  name: string;
  addressId: string;
  bookerId: string;
}

// getHotelsByAddress

export interface iGetHotelsByAddressResponse {
  isSuccess: boolean;
  address: Address;
  hotels: Hotel[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface Address {
  id: string;
  address: string;
  userId: string;
  officerId: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface Hotel {
  id: string;
  name: string;
  addressId: string;
  bookerId: string;
  createdAt: Date;
  updatedAt: Date;
  booker: Booker;
}

export interface Booker {
  id: string;
  name: string;
  email: null;
  role: string;
  profilePhoto: null;
  phone: string;
}

export interface iGetHotelsByAddressPayload {
  addressId: string;
  page: number;
  perPage: number;
}

// delete hotel
export interface iDeletedHotelResponse {
  isSuccess: boolean;
  message: string;
  deletedHotel: {
    id: string;
    name: string;
    addressId: string;
    bookerId: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
