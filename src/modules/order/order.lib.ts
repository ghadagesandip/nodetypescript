import { Request } from 'express';
import { PaginateResult, Types } from 'mongoose';
import * as Stripe from 'stripe';
import { cartModel } from '../cart/cart.model';
import { ICart } from '../cart/cart.type';
import { IProduct } from '../products/product.type';
import { orderModel } from './order.model';
import { IOrder } from './order.type';

const stripe: Stripe = new Stripe(process.env.STRIPE_PAYMENT_GATEWAY_SECRET);

/**
 * OrderLib
 */
export class OrderLib {
  public async getCustomer(token: Stripe.tokens.ICardToken): Promise<Stripe.customers.ICustomer> {
    return stripe.customers.create({//create customer with card token and email
     // email: email,
      source: token.id,
    });
  }

  public async getToken(card: Stripe.cards.ICardSourceCreationOptionsExtended): Promise<Stripe.tokens.ICardToken> {
    return stripe.tokens.create({//create token using card details
      card,
    });
  }
  public async debitCharges(amount: number, custid: string): Promise<Stripe.charges.ICharge> {
    return stripe.charges.create({ // charge the customer
      amount,
      description: 'Sample Charges',
      currency: process.env.STRIPE_PAYMENT_CURRENCY_CODE,
      customer: custid,
    });
  }

  public async updateOrderDetails(charges: Stripe.charges.ICharge, orderId: Types.ObjectId): Promise<IOrder> {
    const data: object = {
      order_status: 'success',
      receipt_url: charges.receipt_url,
      transaction_id: charges.id,
    };

    return orderModel.findByIdAndUpdate(orderId, {$set: data}, {new: true});
  }

  public async getCartDetails(userId: string): Promise<any> {
    return cartModel.aggregate([
      { $match: {$and: [{user_id: Types.ObjectId(userId)}, {isDeleted: false}]} },
      {
        $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'product',
        },
    },
    {
        $addFields : {
          prod_price: { $arrayElemAt: [ '$product.price', 0 ] },
          prod_discount: { $arrayElemAt: [ '$product.discount', 0 ] },
        },
      },
      {
        $group: {
          _id: { user_id : '$user_id' },
          total_price: { $sum: {$multiply: [{ $multiply: [{$divide: ['$prod_discount', 100]}, '$prod_price'] }, '$quantity' ] }},
          total_qty: {$sum: '$quantity'},
        },
      },
      {
        $project: {
          order_total_qty: '$total_qty',
          order_total_price: '$total_price',
          _id: 0,
         },
      },
    ]);
  }

  public async getCartItems(userId: string) : Promise<ICart[]> {
    return cartModel.find({user_id : userId, isDeleted: false}, { product_id: 1, quantity: 1, _id: 1 })
    .populate({path: 'product_id' , model: 'Product', select: 'name price discount brand', populate : {
      path : 'brand', model: 'Brand', select: 'name',
    } });
  }

  public async placeOrder(cartItems: ICart[], orderDetails: any[], userId: string): Promise<IOrder> {
    const order: object = {
      cart_items: cartItems,
      user_id: userId,
      order_total_qty: orderDetails[0].order_total_qty,
      order_total_price:  orderDetails[0].order_total_price,
    };
    const orderObj: IOrder = new orderModel(order);

    return orderObj.save();
  }

  public async emptyCart(userId: string): Promise<ICart> {
    return cartModel.updateMany({ user_id: Types.ObjectId(userId) }, { $set: { isDeleted: true } });
  }

  public async getAllOrderDetails(req: Request): Promise<PaginateResult<IOrder>> {
    const filters: any = {
      order_status: '',
    };
    if (req.query.status === 'all') {
      delete filters.order_status;
    } else {
      filters.order_status = req.query.status;
    }
    const options: object = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      populate: [{path: 'user_id', model: 'User', select: 'first_name email gender'},
        {path: 'product_id', model: 'Product', select: 'name price category_id discount brand',
         populate: { path: 'brand', model: 'Brand', select: 'name' },
      }],
    };

    return orderModel.paginate({ ...filters }, options);
  }

  public async getMyorders(req: Request): Promise<PaginateResult<IOrder>> {
    const filters: object = {
      user_id: req.body.loggedinUserId,
    };
    const options: object = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      populate: {path: 'product_id', model: 'Product' , select: 'name brand price discount',
                 populate: {
                    path: 'brand',
                    model: 'Brand',
                    select: 'name',
                  },
                },
    };

    return orderModel.paginate({...filters}, options);
  }
}
