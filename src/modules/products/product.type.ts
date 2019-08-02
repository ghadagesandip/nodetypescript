import { ObjectID } from 'bson';
import { Document } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  category_id?: string;
  name?: string;
  price?: number;
  discount?: number;
  images?: String[];
  warranty?: string;
  general?: any;
  display_feature?: any;
  memory_storage?: any;
  camera?: any;
  connectivity_feature?: any;
  idDelete: Boolean;
  review_rating: IReviewRating;
}

export interface IReviewRating {
  review: IReview[];
  avg_rating: number;
  total_review: number;
}

export interface IReview {
  rating: number;
  user_id: ObjectID;
  comment: String;
}

export interface IFilter {
  _id?: object;
  highlight?: object;
  brand?: string;
  price?: object;
  category_id?: string;
}
