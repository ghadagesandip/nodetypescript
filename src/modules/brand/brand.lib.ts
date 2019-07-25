import { Types } from 'mongoose';
import { brandModel } from './brand.model';
import { IBrand } from './brand.type';

const isDelete: any = { isDelete: false };
const listFields:any=['name','image','category_id','description']

/**
 * BrandLib
 */
export class BrandLib {
  public async getAllBrands(): Promise<IBrand[]> {
    return brandModel.find({ ...isDelete }, listFields);
  }

  public async getBrandById(id: number): Promise<IBrand> {
    return brandModel.findOne({ ...{ _id: id }, ...isDelete });
  }

  public async findByIdAndUpdate(
    id: Types.ObjectId,
    data: IBrand,
  ): Promise<IBrand> {
    return brandModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public async addBrand(data: IBrand): Promise<IBrand> {
    data.name=data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const brandObj: IBrand = new brandModel(data);

    return brandObj.save();
  }

}
