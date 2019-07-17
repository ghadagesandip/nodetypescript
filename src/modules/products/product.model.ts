import { Document, model, PaginateModel, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { IProduct } from './product.type';
/**
 * ProductModel
 */

const generalSchema: Schema = new Schema({
  model_name: {
    type: String,
    required: true,
  },
  model_number: {
    type: String,
  },
  color: {
    type: String,
    required: true,
  },
  in_the_box: String,
  sim_type: String,
  touchScreen: String,
  quick_charging: String,
});

const displaySchema: Schema = new Schema({
  size: {
    type: String,
    required: true,
  },
  resolution: {
    type: String,
    required: true,
  },
  resolution_type: {
    type: String,
    required: true,
  },
  other_features: {
    type: String,
    required: true,
  },
});

const memoryStorageSchema: Schema = new Schema({
  internal_storage: {
    type: Number,
    required: true,
  },
  ram: {
    type: Number,
    required: true,
  },
  expandable: {
    type: Number,
  },
});

const cameraSchema: Schema = new Schema({
  primary_camera: {
    type: String,
    required: true,
  },
  secondary_camera: {
    type: String,
    required: true,
  },
  flash: {
    type: Boolean,
    default: false,
  },
  hd_recording: {
    type: Boolean,
    default: false,
  },
});

const connectivitySchema: Schema = new Schema({
  network_type: {
    type: String,
    required: true,
  },
  supported_network: {
    type: String,
    required: true,
  },
  bluetooth: {
    type: Boolean,
    default: false,
  },
  bluetooth_version: {
    type: String,
    default: false,
  },
  wifi: {
    type: Boolean,
    default: false,
  },
  wifi_version: {
    type: String,
    default: false,
  },
});

export const productSchema: Schema = new Schema({
  category_id: {
    type: 'ObjectId',
    required: true,
    ref: 'Category',
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
  images: [
    {
      type: String,
    },
  ],
  warranty: {
    type: String,
  },
  general: generalSchema,
  display_feature: displaySchema,
  memory_storage: memoryStorageSchema,
  camera: cameraSchema,
  connectivity_feature: connectivitySchema,
  isDelete: {
    type: Boolean,
    default: false,
  },
});

productSchema.plugin(mongoosePaginate);
interface IProductModel<T extends Document> extends PaginateModel<T> {}

export const productModel: IProductModel<IProduct> = model<IProduct>(
  'Product',
  productSchema,
);
