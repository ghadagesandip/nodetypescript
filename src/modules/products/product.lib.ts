import { PaginateResult, Types } from 'mongoose';
import { productModel } from './product.model';
import { IProduct } from './product.type';

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

}
