import { Document, model, Model , PaginateModel, Schema , Types} from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { IOrder } from './order.type';
export enum PaymentStatus {
  success = 'success',
  pending = 'pending',
  failed = 'failed',
}
export const orderSchema: Schema = new Schema(
  {
    user_id: {
        type: Types.ObjectId,
        required: true,
        ref: 'User',
      },
    product_id: {
        type: Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    cart_id: {
        type: Types.ObjectId,
        required: true,
        ref: 'Cart',
      },
    quantity: {
      type: Number,
      required: true,
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
        type: String,
        default: PaymentStatus.pending,
    },
  },
  {
    timestamps: true,
  },
);
orderSchema.plugin(mongoosePaginate);
interface IOrderModel<T extends Document> extends PaginateModel<T> {}

export const orderModel: IOrderModel<IOrder> = model<IOrder>(
  'Order',
  orderSchema,
);
