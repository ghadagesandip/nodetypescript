import { Application, Request, Response } from 'express';
import * as Stripe from 'stripe';
import { AuthHelper, ResponseHandler } from '../../helpers';
import { BaseController } from '../BaseController';
import { PaymentsLib } from './payments.lib';
import { paymentsRule } from './payments.rule';
/**
 * Payments controller
 */
export class PaymentsController extends BaseController {
  constructor() {
    super();
    this.init();
  }

  public register(app: Application): void {
    app.use('/api/payments', this.router);
  }

  public init(): void {
    const authHelper: AuthHelper = new AuthHelper();

    this.router.post('/',
                     authHelper.guard,
                     paymentsRule.forAdd,
                     authHelper.validation,
                     this.makePayment);
  }

/**
 * Make payment
 * @param req
 * @param res
 */
  public async makePayment(req: Request, res: Response): Promise<void> {
    try {
      const paymentLib: PaymentsLib = new PaymentsLib();
      const token: Stripe.tokens.ICardToken = await paymentLib.getToken(req.body.card);
      const customer: Stripe.customers.ICustomer = await paymentLib.getCustomer(req.body.email, token);
      const charges: any = await paymentLib.debitCharges(req.body.amount, customer.id);
      res.locals.data = charges;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'makePayment');
    }
  }
}
