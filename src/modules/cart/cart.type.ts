import { Document } from 'mongoose';
import { IProduct } from '../products/product.type';

export interface ICart extends Document {
  _id: string;
  user_id: string;
  product_id: IProduct;
  quantity: number;
}
