import { Types } from 'mongoose';
import { brandModel } from '../brand/brand.model';
import { productModel } from '../products/product.model';
import { categoryModel } from './category.model';
import { ICategory } from './category.type';

const isDelete: any = { isDelete: false };
const listFields: string = 'name slug';

/**
 * CategoryLib
 */
export class CategoryLib {
  public async getAllCategories(): Promise<ICategory[]> {
    return categoryModel.find({ ...isDelete }, listFields);
  }

  public async getCategoryById(id: string): Promise<ICategory> {
    return categoryModel.findOne({ ...{ _id: id }, ...isDelete });
  }

  public async findByIdAndUpdate(
    id: Types.ObjectId,
    data: ICategory,
  ): Promise<ICategory> {
    return categoryModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public async addCategory(data: ICategory): Promise<ICategory> {
    const categoryObj: ICategory = new categoryModel(data);

    return categoryObj.save();
  }

  public async getCategoryWiseProduct(): Promise<any> {
    return categoryModel.aggregate([
      { $match: { ...isDelete } },
      {
        $lookup: {
          from: 'products',
          as: 'brands',
          let: {
            cat_id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$category_id', '$$cat_id'] },
                    { $eq: ['$isDelete', false] },
                  ],
                },
              },
            },
            { $project: { _id: 1, name: 1, brand: 1, description: 1, price: 1, discount: 1, images: 1} },
            {
              $group: { _id: '$brand' , product: { $first: '$$ROOT' }},
            },
            {
              $limit: 10,
            },
            {
              $lookup:
              {
                from: 'brands',
                localField: '_id',
                foreignField: '_id',
                as: 'brand',
              },
            },
            {
              $project: {
                product: 1,
                name: { $arrayElemAt: [ '$brand.name', 0 ] },
                _id: 0,
              },
            },
          ],
        },
      },
    ]);
  }

}
