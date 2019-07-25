import { Document } from 'mongoose';

export interface IBrand extends Document {
  _id: string;
  name: string;
  image?: string;
  description?: string;
}
