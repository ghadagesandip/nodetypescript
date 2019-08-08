import { PaginateResult, Types } from 'mongoose';
import { cartModel } from './cart.model';
import { ICart } from './cart.type';

/**
 * CartLib
 */
export class CartLib {
  public async getPaginatedCarts(
    filters: any,
    options: any,
  ): Promise<PaginateResult<ICart>> {
    return cartModel.paginate(filters, options);
  }

  public async getCarts(filters: any): Promise<ICart[]> {
    return cartModel.find(filters).populate('product_id', 'name price images discount brand');
  }

  public async add(data: ICart): Promise<ICart> {
    const cartObj: ICart = new cartModel(data);

    return cartObj.save();
  }

  public async findByIdAndUpdate(
    id: Types.ObjectId,
    data: ICart,
  ): Promise<ICart> {
    return cartModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public async checkCart(
    id: Types.ObjectId,
  ): Promise<ICart> {
    return cartModel.findOne({_id: id , isDeleted: false});
  }

  public async deleteById(id: Types.ObjectId): Promise<ICart> {
    return cartModel.findByIdAndRemove(id);
  }
}
