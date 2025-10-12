// getOneMessage
export interface iGetOneMessageResponse {
  isSuccess: boolean;
  message: string;
  data: Data;
}

export interface Data {
  id: string;
  message: string;
  userId: string;
  createdAt: Date;
  extraNumbers: ExtraNumber[];
  recipients: Recipient[];
  creator: Creator;
  _count: Count;
}

export interface Count {
  recipients: number;
  extraNumbers: number;
}

export interface Creator {
  id: string;
  name: string;
  email: string | null;
  role: string;
  profilePhoto: string | null;
  phone: number;
}

export interface ExtraNumber {
  id: string;
  phone: string;
  name: string;
  messageId: string;
}

export interface Recipient {
  id: string;
  userId: string;
  employeeId: string;
  phone: string;
  messageId: string;
  sent: boolean;
  scheduledAt: string | null;
}
