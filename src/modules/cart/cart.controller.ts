import { Application, Request, Response } from 'express';
import { PaginateResult, Types } from 'mongoose';
import { BaseController } from '../BaseController';
import { OrderLib } from '../order/order.lib';
import { AuthHelper, ResponseHandler, Utils } from './../../helpers';
import { CartLib } from './cart.lib';
import { ICart } from './cart.type';

/**
 * CartController
 *
 */
export class CartController extends BaseController {
  constructor() {
    super();
    this.init();
  }

  public register(app: Application): void {
    const authHelper: AuthHelper = new AuthHelper();
    app.use('/api/carts', authHelper.guard, this.router);
  }

  public init(): void {
    this.router.post('/', this.addProductIntoCart);
    this.router.get('/pagination', this.getPaginatedCarts);
    this.router.get('/', this.getCarts);
    this.router.delete('/', this.deleteCartItem);
    this.router.delete('/remove-item/:id', this.removeItem);
  }

  public async getPaginatedCarts(req: Request, res: Response): Promise<void> {
    try {
      const utils: Utils = new Utils();
      const filters: any = {};
      filters.user_id = req.body.loggedinUserId;
      filters.isDeleted = false;
      const options: any = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      };
      const cart: CartLib = new CartLib();
      const carts: PaginateResult<ICart> = await cart.getPaginatedCarts(
        filters,
        options,
      );
      res.locals.data = carts.docs;
      res.locals.pagination = utils.getPaginateResponse(carts);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getProducts');
    }
  }

  public async getCarts(req: Request, res: Response): Promise<void> {
    try {
      const filters: any = {};
      filters.user_id = req.body.loggedinUserId;
      filters.isDeleted = false;
      const cart: CartLib = new CartLib();
      const order: OrderLib =  new OrderLib();
      const carts: ICart[] = await cart.getCarts(filters);
      const totalItems: any = await order.getCartDetails(req.body.loggedinUserId);
      const resObj: object = {
        carts: carts,
        totalItems: totalItems,
      };
      res.locals.data = resObj;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getProducts');
    }
  }

  /**
   * addProduct into cart
   * @param req
   * @param res
   */
  public async addProductIntoCart(req: Request, res: Response): Promise<void> {
    try {
      const cartLib: CartLib = new CartLib();
      req.body.user_id = req.body.loggedinUserId;
      const checkCart: ICart = await new CartLib().checkProdInCart(req.body);
      if (checkCart) {
        const product: any = await new CartLib().updateIfExists(checkCart, req.body);
        res.locals.data = product;
      } else {
        res.locals.data = await cartLib.add(req.body);
      }
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'addProductIntoCart');
    }
  }

  /**
   * Delete Cart by id
   * @param req
   * @param res
   */
  public async deleteCartItem(req: Request, res: Response): Promise<void> {
    const id: Types.ObjectId = req.body.loggedinUserId;
    try {
      const deletedProduct: object = await new CartLib().deleteCustomerCart(id);
      if (!deletedProduct) {
        throw new Error('Invalid id passed.');
      }
      res.locals.data = deletedProduct;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'deleteCartItem');
    }
  }

  /**
   * Remove item from user cart
   * @param req
   * @param res
   */
  public async removeItem(req: Request, res: Response): Promise<any> {
   try {
     const cart: CartLib = new CartLib();
     const cartItemRemove: ICart = await cart.removeCartItem(req.params.id);
     res.locals.data = cartItemRemove;
     ResponseHandler.JSONSUCCESS(req, res);
   } catch (error) {
    res.locals.data = error;
    ResponseHandler.JSONERROR(req, res, 'removeItem');
   }
  }
}
