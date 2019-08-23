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
  // public async getCartsItemTotal(filters: any): Promise<any> {
  //   return cartModel.aggregate([
  //     { $match: {$and: [{user_id: Types.ObjectId(filters.user_id)}, {isDeleted: filters.isDeleted}]} },
  //     {
  //       $group:
  //         {
  //           _id:  '$user_id',
  //           totalQuantity: { $sum: '$quantity' },
  //         },
  //     }]);
  // }

  public async add(data: ICart): Promise<ICart> {
    const cartObj: ICart = new cartModel(data);

    return cartObj.save();
  }

  public async updateIfExists(
    cart: ICart,
    data: ICart,
  ): Promise<ICart> {
    data.quantity = (data.quantity  + cart.quantity);

    return cartModel.findByIdAndUpdate(cart._id, { $set: data }, { new: true });
  }

  public async checkProdInCart(data: ICart): Promise<any> {
    return cartModel.findOne({user_id: data.user_id , product_id: data.product_id, isDeleted: false});
  }

  public async removeCartItem(id: Types.ObjectId): Promise<any> {
    return cartModel.remove({_id: id});
  }

  public async deleteCustomerCart(id: Types.ObjectId): Promise<object> {
    return cartModel.remove({user_id: id});
  }
}
