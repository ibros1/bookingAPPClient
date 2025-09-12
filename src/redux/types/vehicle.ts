export interface iCreatedVehiclePayload {
  vehicleNo: string;
  driverId: string;
  name: string;
}

export interface iCreatedVehicleResponse {
  isSuccess: boolean;
  message: string;
  vehicle: Vehicle;
}

export interface Vehicle {
  id: string;
  vehicleNo: string;
  name: string;
  driverId: string;
  drivers: Drivers;
}

export interface Drivers {
  name: string;
  email: string;
  phone: string;
  profilePhoto: string;
  isDriver: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// list vehicles
export interface iListedVehiclesPayload {
  page: number;
}

export interface iListedVehiclesResponse {
  isSuccess: boolean;
  message: string;
  vehicles: Vehicle[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface Vehicle {
  id: string;
  vehicleNo: string;
  name: string;
  driverId: string;
  createdAt: Date;
  updatedAt: Date;
  drivers: Drivers;
}

export interface Drivers {
  name: string;
  email: string;
  phone: string;
  profilePhoto: string;
  isDriver: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// getOne
export interface iGetOneVehicle {
  isSuccess: boolean;
  vehicle: Vehicle;
}

export interface Vehicle {
  id: string;
  vehicleNo: string;
  name: string;
  driverId: string;
  drivers: Drivers;
}

export interface Drivers {
  name: string;
  email: string;
  phone: string;
  profilePhoto: string;
  isDriver: boolean;
  createdAt: Date;
  updatedAt: Date;
}

//Update vehicle
export interface iUpdatedVehiclePayload {
  id: string;
  vehicleNo: string;
  driverId: string;
  name: string;
}

export interface iUpdatedVehicleResponse {
  isSuccess: boolean;
  message: string;
  vehicle: Vehicle;
}

export interface Vehicle {
  id: string;
  vehicleNo: string;
  name: string;
  driverId: string;
  drivers: Drivers;
}

export interface Drivers {
  name: string;
  email: string;
  phone: string;
  profilePhoto: string;
  isDriver: boolean;
  createdAt: Date;
  updatedAt: Date;
}
