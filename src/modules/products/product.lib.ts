import { ObjectID } from 'bson';
import { PaginateResult, Types } from 'mongoose';
import { productModel } from './product.model';
import { IProduct, IReview, IReviewRating } from './product.type';

const isDelete: any = { isDelete: false };

/**
 * ProductLib
 */
export class ProductLib {
  public async getProduct(
    filters: any,
    options: any,
  ): Promise<PaginateResult<IProduct>> {
    return productModel.paginate({ ...filters, ...isDelete }, options);
  }

  public async addProduct(data: IProduct): Promise<IProduct> {
    const productObj: IProduct = new productModel(data);

    return productObj.save();
  }

  public async findByIdAndUpdate(
    id: Types.ObjectId,
    data: IProduct,
  ): Promise<IProduct> {
    return productModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public async getCategoryWiseProduct(): Promise<any> {
    return productModel.aggregate([
      { $match: isDelete },
      {
        $lookup: {
          from: 'categories', //collection name not a model name
          localField: 'category_id',
          foreignField: '_id',
          as: 'category_products',
        },
      },
    ]);
  }

  public async getProductById(id: string): Promise<IProduct> {
    return productModel.findOne({
      _id: id,
    }).populate({path: 'brand', model: 'Brand'});
  }

  public async getProductReviewRating(id: ObjectID, productId: string, data: IReview): Promise<IProduct> {
    const ratingObj: IReview = {
      user_id: id,
      rating: data.rating,
      comment: data.comment,
    };
    const product: IProduct = await this.getProductById(productId);
    if (!product.review_rating) {
      const reviewRating : IReviewRating = {
        review: [
          {
            user_id: id,
            rating: data.rating,
            comment: data.comment,
          },
        ],
        avg_rating: data.rating,
        total_review: 1,
      };
      product.review_rating = reviewRating;
    }
    product.review_rating.review.push(ratingObj);
    const rating: number = await this.calculateProductReviewRating(product.review_rating.review);
    product.review_rating.total_review = product.review_rating.review.length;
    product.review_rating.avg_rating = rating / product.review_rating.total_review;

    return this.findByIdAndUpdate(new ObjectID(productId), product);
  }

  public async calculateProductReviewRating(reviewArray: Object[]): Promise<number> {
    let rating: number = 0;
    reviewArray.filter(function(review: IReview):void {
      rating += review.rating;
    });

    return rating;
  }

  public async getBrandCountByCategory(catId : Types.ObjectId): Promise<any> {

    return productModel.aggregate([
      { $match: { ...isDelete, category_id : catId } },
      {
        $group: {
          _id: { brand : '$brand' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'brands',
          localField: '_id.brand',
          foreignField: '_id',
          as: 'product_brand',
        },
      },
      {
        $addFields : {
          brand_name: { $arrayElemAt: [ '$product_brand.name', 0 ] },
        },
      },
      {
        $project: {
          product_count: '$count',
          brand_name: 1,
          _id: '$_id.brand',
        },
      },
    ]);
  }

}
