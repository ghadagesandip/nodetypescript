import { Document, Types } from 'mongoose';

export interface IOrder extends Document {
  _id: string;
  user_id: string;
  cart_items: object[];
  order_total_price: number;
  order_total_qty: number;
  delivery_address: string;
  transaction_id?: string;
  receipt_url?: string;
  quantity: number;
  order_status: boolean;
}
