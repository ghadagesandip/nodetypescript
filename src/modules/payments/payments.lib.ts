import { Types } from 'mongoose';
import * as Stripe from 'stripe';
import { cartModel } from '../cart/cart.model';
import { IProduct } from '../products/product.type';

import { ICart } from '../cart/cart.type';
import { orderModel } from '../payments/order.model';
import { IOrder } from '../payments/order.type';
const stripe: Stripe = new Stripe(process.env.STRIPE_PAYMENT_GATEWAY_SECRET);

/**
 * PaymentsLib
 */
export class PaymentsLib {
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
  public async debitCharges(amount: number, custid : string): Promise<any> {
    return  stripe.charges.create({ // charge the customer
        amount,
        description: 'Sample Charges',
            currency: process.env.STRIPE_PAYMENT_CURRENCY_CODE,
            customer: custid,
        });
  }

  public async getOrderDetails(cartId: string): Promise<ICart> {
    return  cartModel.findOne({_id: cartId, isDeleted: false}).populate({path: 'product_id', model: 'Product'});
  }

  public async placeOrder(product: IProduct, quantity: number, userId: string): Promise<IOrder> {
    const totalAmount: number = product.price * quantity;
    const order: object = {
      product_id: product._id,
      user_id: userId,
      total_amount: totalAmount,
    };
    const orderObj: IOrder = new orderModel(order);

    return orderObj.save();
  }

  public async emptyCart(cartId: string): Promise<ICart> {
    return  cartModel.findByIdAndUpdate({_id: cartId}, { $set: { isDeleted: true}});
  }
}
