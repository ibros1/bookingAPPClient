// Payload for sending messages
export interface iSentMessgesPayload {
  userId: string;
  message: string;
  employeeIds?: string[]; // optional if using extraNumbers only
  extraNumbers?: ExtraNumberPayload[]; // new
  scheduledAt?: Date | null; // new
}

export interface ExtraNumberPayload {
  phone: string;
  name?: string;
}

// Response when creating a message
export interface iSentMessgesResponse {
  message: string;
  data: Data;
}

export interface Data {
  id: string;
  message: string;
  userId: string;
  createdAt: Date;
}

// List all messages
export interface iListedAllMessagesResponse {
  data: Datum[];
  pagination: Pagination;
}

export interface Datum {
  id: string;
  message: string;
  userId: string;
  createdAt: Date;
  creator: Creator;
  recipients: Recipient[];
  extraNumbers: ExtraNumber[]; // new
}

export interface Creator {
  id: string;
  name: string;
  email: string | null;
  role: string;
}

export interface Recipient {
  id: string;
  userId: string;
  employeeId: string;
  phone: string;
  messageId: string;
  sent: boolean;
  scheduledAt?: Date | null; // new
}

export interface ExtraNumber {
  id: string;
  phone: string;
  name?: string | null;
  messageId: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface iListedAllMessagesPayload {
  page: number;
  limit: number;
}


