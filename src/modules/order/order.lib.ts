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
  public async getCustomer(email: string, token: Stripe.tokens.ICardToken): Promise<Stripe.customers.ICustomer> {
    return stripe.customers.create({//create customer with card token and email
      email: email,
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

  public async getOrderDetails(cartId: string): Promise<ICart> {
    return cartModel.findOne({ _id: cartId, isDeleted: false }).populate({ path: 'product_id', model: 'Product' });
  }

  public async getCartDetails(userId: string): Promise<any> {
    //return cartModel.find({user_id: Types.ObjectId(userId), isDeleted: false}).populate({ path: 'product_id', model: 'Product' });
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
          produ_id: { $arrayElemAt: [ '$product._id', 0 ] },
          prod_discount: { $arrayElemAt: [ '$product.discount', 0 ] },
        },
      },
      {
        $group: {
          _id: { user_id : '$user_id' },
          prod_dis: {$addToSet: '$prod_discount'},
          total_price: { $sum: {$multiply: ['$prod_price', '$quantity' ] }},
          total_qty: {$sum: '$quantity'},
          prod_id: { $addToSet: '$product_id' },
        },
      },
      {
        $project: {
          product_total_qty: '$total_qty',
          product_total_price: '$total_price',
          prod_id: 1,
          prod_dis: 1,
        },
      },
    ]);
  }

  public async getdetails(getCart:any[]) : Promise<any> {
    //  getCart.find(function (element, index, array) {
    //   console.log(element.quantity)
    // });
  }

  public async placeOrder(product: IProduct, quantity: number, userId: string, cartId: string): Promise<IOrder> {
    const totalAmount: number = product.price * quantity;
    const order: object = {
      product_id: product._id,
      user_id: userId,
      total_amount: totalAmount,
      quantity: quantity,
      cart_id: cartId,
    };
    const orderObj: IOrder = new orderModel(order);

    return orderObj.save();
  }

  public async emptyCart(cartId: string): Promise<ICart> {
    return cartModel.findByIdAndUpdate({ _id: cartId }, { $set: { isDeleted: true } });
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
