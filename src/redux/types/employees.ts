export type iCreatedEmployeePayload = {
  name: string;
  phone: string;
  sex: string;
  status: string;
  position: string;
  address: string;
  salary: number;
  notes: string;
  userId: string;
}[];

export interface iCreatedEmployeeResponse {
  isSuccess: boolean;
  message: string;
  insertedCount: number;
  errors: [];
}

// list
export interface iListedEmployeeResponse {
  isSuccess: boolean;
  message: string;
  employee: Employee[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface Employee {
  id: string;
  userId: string;
  name: string;
  phone: string;
  sex: string;
  position: string;
  address: string;
  status: string;
  notes: string;
  salary: number;
  updatedAt: Date;
  createdAt: Date;
  creator: Creator;
}

export interface Creator {
  id: string;
  name: string;
  email: null;
  role: string;
  profilePhoto: null;
  phone: string;
}

export interface iListedEmployeePayload {
  page: number;
  limit: number;
}

// getOneEmplooyee
export interface iGetOneEmployeeResponse {
  isSuccess: boolean;
  employee: Employee;
}

export interface Employee {
  id: string;
  userId: string;
  name: string;
  phone: string;
  sex: string;
  position: string;
  address: string;
  status: string;
  notes: string;
  salary: number;
  updatedAt: Date;
  createdAt: Date;
  creator: Creator;
}

export interface Creator {
  id: string;
  name: string;
  email: null;
  role: string;
  profilePhoto: null;
  phone: string;
}

// update
export interface iUpdatedEmployeeResponse {
  isSuccess: boolean;
  message: string;
  employee: Employee;
}

export interface Employee {
  id: string;
  userId: string;
  name: string;
  phone: string;
  sex: string;
  position: string;
  address: string;
  status: string;
  notes: string;
  salary: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface iUpdatedEmplooyeePayload {
  id: string;
  position: string;
  salary: number;
  notes: string;
}

// delete
export interface iDeletedEmployeeResponse {
  isSuccess: boolean;
  message: string;
  deletedEmployee: DeletedEmployee;
}

export interface DeletedEmployee {
  id: string;
  userId: string;
  name: string;
  phone: string;
  sex: string;
  position: string;
  address: string;
  status: string;
  notes: string;
  salary: number;
  updatedAt: Date;
  createdAt: Date;
}

// getOneByPhone
export interface iGetOneEmployeeByPhoneResponse {
  isSuccess: boolean;
  employee: Employee;
}

export interface Employee {
  id: string;
  userId: string;
  name: string;
  phone: string;
  sex: string;
  position: string;
  address: string;
  status: string;
  notes: string;
  salary: number;
  updatedAt: Date;
  createdAt: Date;
  creator: Creator;
}

export interface Creator {
  id: string;
  name: string;
  email: null;
  role: string;
  profilePhoto: null;
  phone: string;
}

export interface iGetOneEmployeeByPhonePayload {
  phone: string;
}
