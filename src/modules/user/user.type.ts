import { Document } from 'mongoose';
export interface IUser extends Document {
  _id: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  created_date?: Date;
  token?: string;
  userRole: string;
}

export interface IUserRequest {
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  created_date?: Date;
  token?: string;
  tmp_forgot_pass_code?: string;
}
