import { Document, Types } from 'mongoose';

export interface IOrder extends Document {
  _id: string;
  product_id: string;
  user_id: string;
  total_amount: number;
  delivery_address: string;
  transaction_id?: string;
  receipt_url?: string;
  order_status: boolean;
}
