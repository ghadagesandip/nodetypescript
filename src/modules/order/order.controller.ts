import { Application, Request, Response } from 'express';
import { PaginateResult } from 'mongoose';
import * as Stripe from 'stripe';
import { Messages } from '../../constants/messages';
import { AuthHelper, ResponseHandler, Utils } from '../../helpers';
import { BaseController } from '../BaseController';
import { ICart } from '../cart/cart.type';
import { OrderLib } from './order.lib';
import { paymentsRule } from './order.rule';
import { IOrder } from './order.type';
/**
 * Payments controller
 */
export class PaymentsController extends BaseController {
  constructor() {
    super();
    this.init();
  }

  public register(app: Application): void {
    app.use('/api/order', this.router);
  }

  public init(): void {
    const authHelper: AuthHelper = new AuthHelper();

    this.router.get('/placeOrder', authHelper.guard, this.order);
    this.router.get('/myOrders', authHelper.guard, this.myOrders);
    this.router.get('/allOrders', authHelper.adminGuard, this.orderDetails);
    this.router.post(
      '/',
      authHelper.guard,
      paymentsRule.forAdd,
      authHelper.validation,
      this.makePayment,
    );
  }

  /**
   * Make payment
   * @param req
   * @param res
   */
  public async makePayment(req: Request, res: Response): Promise<void> {
    try {
      const orderLib: OrderLib = new OrderLib();
      //const token: Stripe.tokens.ICardToken = await orderLib.getToken(req.body.card);
      const customer: Stripe.customers.ICustomer = await orderLib.getCustomer(req.body.token);
      const charges: Stripe.charges.ICharge = await orderLib.debitCharges(req.body.amount, customer.id);
      const orderRes: IOrder = await orderLib.updateOrderDetails(charges, req.body.order_id);
      res.locals.data = orderRes;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'makePayment');
    }
  }

  /**
   * Place order using cart id
   * @param req
   * @param res
   */
  public async order(req: Request, res: Response): Promise<void> {
    try {
      const orderLib: OrderLib = new OrderLib();
      const cartItems: ICart[] = await orderLib.getCartItems(req.body.loggedinUserId);
      if (cartItems.length > 0) {
        const getCartDetails: object[] = await orderLib.getCartDetails(req.body.loggedinUserId);
        const placedOrder: IOrder = await orderLib.placeOrder(cartItems, getCartDetails, req.body.loggedinUserId);
        await orderLib.emptyCart(req.body.loggedinUserId);
        res.locals.data = placedOrder;
      } else {
        res.locals.data = Messages.INVALID_CART;
      }
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'order');
    }
  }

  /**
   * Admin-> all order details
   * @param req
   * @param res
   */
  public async orderDetails(req: Request, res: Response): Promise<void> {
    try {
      const utils: Utils = new Utils();
      const orderLib: OrderLib = new OrderLib();
      const orderDetails: PaginateResult<IOrder> = await orderLib.getAllOrderDetails(req);
      res.locals.data = orderDetails.docs;
      res.locals.pagination = utils.getPaginateResponse(orderDetails);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'orderDetails');
    }
  }

  /**
   * Customers -> my orders
   * @param req
   * @param res
   */
  public async myOrders(req: Request, res: Response): Promise<void> {
    try {
      const utils: Utils = new Utils();
      const orderLib: OrderLib = new OrderLib();
      const myOrders: PaginateResult<IOrder> = await orderLib.getMyorders(req);
      res.locals.data = myOrders.docs;
      res.locals.pagination = utils.getPaginateResponse(myOrders);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'myOrders');
    }
  }

}
