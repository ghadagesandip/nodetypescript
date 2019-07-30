import { model, Model, Schema } from 'mongoose';
import { IBrand } from './brand.type';

export const brandSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    category_id: [
      {
        type: 'ObjectId',
        unique: true,
        required: true,
        ref: 'Category',
      },
    ],
    description: {
      type: String,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const brandModel: Model<IBrand> = model<IBrand>(
  'Brand',
  brandSchema,
);
