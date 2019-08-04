import { Document, Model, model, PaginateModel, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { ICart } from './cart.type';

export const cartSchema: Schema = new Schema(
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
    quantity: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

cartSchema.plugin(mongoosePaginate);
interface ICartModel<T extends Document> extends PaginateModel<T> {}

export const cartModel: ICartModel<ICart> = model<ICart>('Cart', cartSchema);
