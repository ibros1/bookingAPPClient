export interface iCreatedAddressPayload {
  address: string;
  userId: string;
  officerId: string;
}
export interface iCreatedAddressResponse {
  isSuccess: boolean;
  message: string;
  address: Address;
}

export interface Address {
  id: string;
  address: string;
  userId: string;
  officerId: string;
  updatedAt: Date;
  createdAt: Date;
}

// list address
export interface iListedAddressResponse {
  isSuccess: boolean;
  address: Address[];
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
  officer: Officer;
}

export interface Officer {
  id: string;
  name: string;
  email: null;
  role: string;
  profilePhoto: null;
  phone: string;
}

export interface iListedAddressPayload {
  page?: number;
  perPage?: number;
}

// update address
export interface iUpdatedAddressPayload {
  id: string;
  address: string;
  officerId: string;
}

export interface iUpdatedAddressResponse {
  isSuccess: boolean;
  message: string;
  address: Address;
}

// getOne
export interface iGetOneAddressResponse {
  isSuccess: boolean;
  address: Address;
}

export interface Address {
  id: string;
  address: string;
  userId: string;
  officerId: string;
  updatedAt: Date;
  createdAt: Date;
  officer: Officer;
}

export interface Officer {
  id: string;
  name: string;
  email: null;
  role: string;
  profilePhoto: null;
  phone: string;
}

// delete address
export interface iDeleteAddressResponse {
  isSuccess: boolean;
  message: string;
  deletedAddress: Address;
}
