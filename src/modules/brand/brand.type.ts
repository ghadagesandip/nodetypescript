import { Document, Types } from 'mongoose';

export interface IBrand extends Document {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  category_id?: Types.ObjectId;
}
