import { Document, Model, model, PaginateModel, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { IUser } from './user.type';

export enum UserRole {
  admin = 'admin',
  customer = 'customer',
}

export const userSchema: Schema = new Schema(
  {
    password: {
      type: String,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    first_name: {
      required: 'Enter a first name',
      type: String,
    },
    last_name: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
    },
    userRole: {
      type: String,
      default: UserRole.customer,
    },
    tmp_forgot_pass_code: {
      type: Number,
    },
    tmp_forgot_pass_datetime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(mongoosePaginate);
interface IUserModel<T extends Document> extends PaginateModel<T> {}

export const userModel: IUserModel<IUser> = model<IUser>('User', userSchema);
