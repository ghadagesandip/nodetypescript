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
  brightness: String,
  contrast_ratio: String,
    analog_tv_reception: String,
    view_angle: String,
    panel_type: String,
    digital_noise_filter: String,
    aspect_ratio: String,
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
  ram_type: String,
  ram_speed: String,
  memory_slots: String,
  memory_layout: String,
  hdd_speed: String,
  hdd_type: String,
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
  usb_3_0_slots: String,
  usb_2_0_slots: String,
  sd_card_reader: String,
  headphone_jack: String,
  microphone_jack: String,
});

const smartTvFeaturesSchema: Schema = new Schema({
supported_apps: String,
operating_system: String,
screen_mirroring: String,
content_providers: String,
supported_devices_for_casting: String,
});

const offerSchema: Schema = new Schema({
  no_cost_EMI: String,
  special_price: [
    {
      type: String,
    },
  ],
  bank_offer: [{
    type: String,
  }],
  partner_offer: [{
    type: String,
  }],

});

const reviewRatingSchema: Schema = new Schema({
    review: [
      {
        rating: Number,
        user_id: {
          type: 'ObjectId',
          ref: '',
        },
        comment: String,
      },
    ],
    avg_rating: Number,
    total_review: Number,
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
    type: 'ObjectId',
    required: true,
    ref: 'Brand',
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
  smart_tv_feature: smartTvFeaturesSchema,
  highlight: [
    {
      type: String,
    },
  ],
  offer: offerSchema,
  review_rating: reviewRatingSchema,
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
