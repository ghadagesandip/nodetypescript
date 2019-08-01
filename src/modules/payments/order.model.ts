import { model, Model, Schema } from 'mongoose';
import { IOrder } from './order.type';

export const orderSchema: Schema = new Schema(
  {
    user_id: {
        type: 'ObjectId',
        required: true,
        ref: 'User',
      },
    product_id: {
        type: 'ObjectId',
        required: true,
        ref: 'Product',
      },
    total_amount: {
      type: Number,
      required: true,
    },
    delivery_address: {
        type: String,
    },
    transaction_id: {
      type: String,
    },
    receipt_url: {
        type: String,
    },
    order_status: {
        type: Boolean,
        default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const orderModel: Model<IOrder> = model<IOrder>(
  'Order',
  orderSchema,
);
