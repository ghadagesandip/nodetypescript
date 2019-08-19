import { Types } from 'mongoose';
import { brandModel } from './brand.model';
import { IBrand } from './brand.type';

const isDelete: any = { isDelete: false };
const listFields: any = ['name', 'image', 'category_id', 'description'];

/**
 * BrandLib
 */
export class BrandLib {
  public async getAllBrands(filters: any): Promise<IBrand[]> {
    let query: any = {};
    if (filters.category_id) {
      query = {
        category_id: {
          $in: [filters.category_id],
        },
        ...isDelete,
      };
    } else {
      query = {
        ...isDelete,
      };
    }

    return brandModel.find(query, listFields);
  }

  public async getBrandById(id: string): Promise<IBrand> {
    return brandModel.findOne({ ...{ _id: id }, ...isDelete });
  }

  public async findByIdAndUpdate(
    id: Types.ObjectId,
    data: IBrand,
  ): Promise<IBrand> {
    let query: any;
    if (data.category_id) {
      const category_id: Types.ObjectId = data.category_id;
      delete data.category_id;
      query = { $addToSet: { category_id:  category_id  },
      $set: { data } };
    } else {
      query = { $set: data };
    }

    return brandModel.update({_id: id}, query);
  }

  public async addBrand(data: IBrand): Promise<IBrand> {
    data.name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const brandObj: IBrand = new brandModel(data);

    return brandObj.save();
  }

  public async filterByBrand(id: string): Promise<any> {
    return brandModel.aggregate([
      { $match: {$and: [{ _id: Types.ObjectId(id) }, isDelete] }},
      {$lookup: {
        from: 'products',
        as: 'products',
        let: {
          br_id: '$_id',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$brand', '$$br_id'] },
                  { $eq: ['$isDelete', false] },
                ],
              },
            },
          },
          { $project: { _id: 1, name: 1, brand: 1, description: 1, price: 1, discount: 1, images: 1} },
        ],
      },
    },
    { $project: { _id: 1, name: 1, description: 1, image: 1, products: 1 } },
    ]);
  }

}
