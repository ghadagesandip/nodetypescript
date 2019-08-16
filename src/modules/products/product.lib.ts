import { ObjectID } from 'bson';
import { PaginateOptions, PaginateResult, Types } from 'mongoose';
import { ICart } from '../cart/cart.type';
import { productModel } from './product.model';
import { IFilter, IProduct, IReview, IReviewRating } from './product.type';

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

  public async paginationOnArray(
    array: IReview[],
    page: number,
    limit: number,
  ): Promise<IReview[]> {
    return array.slice((page - 1) * limit, page * limit);
  }

  public async addProduct(data: IProduct): Promise<IProduct> {
    const productObj: IProduct = new productModel(data);

    return productObj.save();
  }

  public async getProductsWithCartInfo(product: IProduct[], userCart: ICart[]): Promise<IProduct[]> {
    const productsWithCartInfo: IProduct[] = [];
    product.forEach((ele: IProduct) => {
      const resObj: any = {};
      const cartDtata: ICart = userCart.find((o: ICart) => {
        if (String(o.product_id._id) === String(ele._id)) {
          return true;
        }
      });
      if (cartDtata) {
        resObj.data = ele;
        resObj.info = { isInCart: true, quantity: cartDtata.quantity };
      } else {
        resObj.data = ele;
        resObj.info = { isInCart: false, quantity: 0 };
      }
      productsWithCartInfo.push(resObj);
    });

    return productsWithCartInfo;
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

  public async getSimilarProduct(reqData: any): Promise<PaginateResult<IProduct>> {
    const product: any = await this.getProductById(reqData.params.id);
    const filters: IFilter = {};
    filters._id = { $ne: reqData.params.id};
    filters.highlight = { $in: product.highlight };
    const options: PaginateOptions = {
      page: reqData.query.page ? Number(reqData.query.page) : 1,
      limit: reqData.query.limit ? Number(reqData.query.limit) : 10,
      select: '',
      populate: [{ path: 'product.highlight', model: 'Product' }],
    };

    return this.getProduct(
      filters,
      options,
    );
  }

  public async getProductById(id: string): Promise<IProduct> {
    return productModel.findOne({
      _id: id,
    }).populate({path: 'brand', model: 'Brand'});
  }

  public async getProductsByCategoryId(reqData: any): Promise<PaginateResult<IProduct>> {
    const filters: IFilter = {};
    if (reqData.query && reqData.query.brand) {
      filters.brand = reqData.query.brand;
    }
    if (reqData.query && reqData.query.range) {
      filters.price = { $gte: reqData.query.range.split('-').map(parseFloat)[0], $lt: reqData.query.range.split('-').map(parseFloat)[1]};
    }
    filters.category_id = reqData.params.id;
    const options: PaginateOptions = {
      page: reqData.query.page ? Number(reqData.query.page) : 1,
      limit: reqData.query.limit ? Number(reqData.query.limit) : 10,
      select: 'images name highlight price discount brand',
      populate: [{ path: 'category_id', model: 'Category' }, { path: 'brand', model: 'Brand' }],
    };
    const user: ProductLib = new ProductLib();

    return user.getProduct(
      filters,
      options,
    );
  }

  public async addProductReview(userId: ObjectID, productId: string, data: IReview): Promise<IProduct> {
    const ratingObj: IReview = {
      user_id: userId,
      rating: data.rating,
      comment: data.comment,
    };
    const product: IProduct = await this.getProductById(productId);
    if (!product.review_rating) {
      const reviewRating : IReviewRating = {
        review: [
          {
            user_id: userId,
            rating: data.rating,
            comment: data.comment,
          },
        ],
        avg_rating: data.rating,
        total_review: 1,
      };
      product.review_rating = reviewRating;
    }
    product.review_rating.review = await this.checkProductReviewAlreadyExist(product.review_rating.review, ratingObj);
    const rating: number = await this.calculateProductReviewRating(product.review_rating.review);
    product.review_rating.total_review = product.review_rating.review.length;
    product.review_rating.avg_rating = rating / product.review_rating.total_review;
    const condition: object = { _id: productId};

    return productModel.findOneAndUpdate(condition, product);
  }

  public async editProductReview(userId: ObjectID, productId: string, reviewId: ObjectID, data: IReview): Promise<IProduct> {
    const ratingObj: IReview = {
      user_id: userId,
      rating: data.rating,
      comment: data.comment,
    };
    const product: IProduct = await this.getProductById(productId);
    product.review_rating.review = await this.checkProductReviewAlreadyExistById(product.review_rating.review, ratingObj, reviewId);
    const rating: number = await this.calculateProductReviewRating(product.review_rating.review);
    product.review_rating.total_review = product.review_rating.review.length;
    product.review_rating.avg_rating = rating / product.review_rating.total_review;
    const condition: object = { _id: productId};

    return productModel.findOneAndUpdate(condition, product);
  }

  public async deleteReviewRating(userId: ObjectID, productId: string, reviewId: ObjectID): Promise<IProduct> {
    const product: IProduct = await this.getProductById(productId);
    product.review_rating.review.forEach((element: any, index: number) => {
      if (element.user_id && element.user_id.toString() === userId && element._id.toString() === reviewId) {
        product.review_rating.review.splice(index, 1);
      }
    });
    const rating: number = await this.calculateProductReviewRating(product.review_rating.review);
    product.review_rating.total_review = product.review_rating.review.length;
    product.review_rating.avg_rating = rating / product.review_rating.total_review;
    const condition: object = { _id: productId};

    return productModel.findOneAndUpdate(condition, product);
  }

  public async checkProductReviewAlreadyExist(reviewArray: IReview[], ratingObj: IReview): Promise<IReview[]> {
    let isFound: Boolean = false;
    reviewArray.forEach((element: any, index: number) => {
      if (element.user_id && element.user_id.toString() === ratingObj.user_id) {
        isFound = true;
        // reviewArray.splice(index, 1);
      }
    });
    if (!isFound) {
      reviewArray.push(ratingObj);
    }

    return reviewArray;
  }

  public async checkProductReviewAlreadyExistById(reviewArray: IReview[], ratingObj: IReview, reviewId: ObjectID): Promise<IReview[]> {
    let isFound: Boolean = false;
    reviewArray.forEach((element: any, index: number) => {
      if (element.user_id && element.user_id.toString() === ratingObj.user_id && element._id.toString() === reviewId) {
        isFound = true;
        reviewArray.splice(index, 1);
      }
    });
    if (isFound) {
      reviewArray.push(ratingObj);
    }

    return reviewArray;
  }

  public async calculateProductReviewRating(reviewArray: IReview[]): Promise<number> {
    let rating: number = 0;
    reviewArray.filter(function(review: IReview): void {
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
          name: { $arrayElemAt: [ '$product_brand.name', 0 ] },
        },
      },
      {
        $project: {
          product_count: '$count',
          name: 1,
          _id: '$_id.brand',
        },
      },
    ]);
  }

}
