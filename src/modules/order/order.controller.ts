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

    this.router.get('/placeOrder/:id', authHelper.guard, this.order);
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
      const token: Stripe.tokens.ICardToken = await orderLib.getToken(req.body.card);
      const customer: Stripe.customers.ICustomer = await orderLib.getCustomer(req.body.email, token);
      const charges: Stripe.charges.ICharge = await orderLib.debitCharges(req.body.amount, customer.id);
      res.locals.data = charges;
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
      const getCart: ICart[] = await orderLib.getCartDetails(req.body.loggedinUserId);
      //console.log(getCart);
     // const cartdetails:any = await orderLib.getdetails(getCart);
      const order: ICart = await orderLib.getOrderDetails(req.params.id);
      if (order) {
        await orderLib.placeOrder(order.product_id, order.quantity, order.user_id, req.params.id);
        const emptyCart: ICart = await orderLib.emptyCart(req.params.id);
        res.locals.data = emptyCart;
      } else {
        res.locals.data = Messages.INVALID_CART_ID;
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
