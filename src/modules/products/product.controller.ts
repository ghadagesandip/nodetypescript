import { Application, Request, Response } from 'express';
import { PaginateResult, Types } from 'mongoose';
import { BaseController } from '../BaseController';
import { CartLib } from '../cart/cart.lib';
import { ICart } from '../cart/cart.type';
import { AuthHelper, ResponseHandler, Utils } from './../../helpers';
import { CategoryLib } from './../category/category.lib';
import { ProductLib } from './product.lib';
import { IProduct } from './product.type';

/**
 * ProductController
 *
 */
export class ProductController extends BaseController {
  constructor() {
    super();
    this.init();
  }

  public register(app: Application): void {
    app.use('/api/products', this.router);
  }

  public init(): void {
    const authHelper: AuthHelper = new AuthHelper();
    this.router.get('/byCategoryId/:id', authHelper.openGuard, this.getProductsByCategoryId);
    this.router.get('/home-list', this.getHomeList);
    this.router.get('/:id/details', this.getDetails);
    this.router.get('/',  authHelper.guard, this.getProducts);
    this.router.put('/:id', authHelper.adminGuard, this.updateProduct);
    this.router.delete('/:id', authHelper.adminGuard, this.deleteProduct);
    this.router.post(
      '/',
      authHelper.adminGuard,
      authHelper.validation,
      this.addProduct,
    );
  }

  public async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const utils: Utils = new Utils();
      const filters: any = {};
      if (req.query && req.query.brand) {
        filters.brand = req.query.brand;
      }
      const options: any = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        populate: { path: 'brand', model: 'Brand' },
      };
      const user: ProductLib = new ProductLib();
      const users: PaginateResult<IProduct> = await user.getProduct(
        filters,
        options,
      );
      res.locals.data = users.docs;
      res.locals.pagination = utils.getPaginateResponse(users);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getProducts');
    }
  }

  /**
   * addProduct
   * @param req
   * @param res
   */
  public async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const productLib: ProductLib = new ProductLib();
      res.locals.data = await productLib.addProduct(req.body);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'addProduct');
    }
  }

  /**
   * getHomeProductList
   * @param req
   * @param res
   */
  public async getHomeList(req: Request, res: Response): Promise<void> {
    try {
      const categoryLib: CategoryLib = new CategoryLib();
      const categories: any = await categoryLib.getCategoryWiseProduct();
      res.locals.data = categories;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getHomeList');
    }
  }

  /**
   * Update Product by id
   * @param req
   * @param res
   */
  public async updateProduct(req: Request, res: Response): Promise<void> {
    const body: IProduct = req.body;
    const id: Types.ObjectId = req.params.id;
    try {
      const product: any = await new ProductLib().findByIdAndUpdate(id, body);
      res.locals.data = product;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'updateProduct');
    }
  }

  /**
   * Delete Product by id
   * @param req
   * @param res
   */
  public async deleteProduct(req: Request, res: Response): Promise<void> {
    const id: Types.ObjectId = req.params.id;
    try {
      const data: any = { isDelete: true };
      const deletedProduct: any = await new ProductLib().findByIdAndUpdate(
        id,
        data,
      );
      res.locals.data = deletedProduct;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'deleteProduct');
    }
  }

  public async getProductsByCategoryId(req: Request, res: Response): Promise<void> {
    try {
      const utils: Utils = new Utils();
      const filters: any = {};
      if (req.query && req.query.brand && req.query.brand !== 'undefined') {
        filters.brand = req.query.brand;
      }
      filters.category_id = req.params.id;
      const options: any = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        select: 'images name highlight price discount brand',
        populate: [{path: 'category_id', model: 'Category'}, { path: 'brand', model: 'Brand'}],
      };
      const user: ProductLib = new ProductLib();
      const users: PaginateResult<IProduct> = await user.getProduct(
        filters,
        options,
      );
      const cartfilter: any = {};
      cartfilter.user_id = req.body.loggedinUserId;
      cartfilter.isDeleted = false;
      if (req.body.loggedinUserId === undefined) {
        res.locals.data = users.docs;
      } else {
        const userCart: ICart[] = await new CartLib().getCarts(cartfilter);
        const data: IProduct[] = await user.getProductsWithCartInfo(users.docs, userCart);
        res.locals.data = data;
      }
      res.locals.pagination = utils.getPaginateResponse(users);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getProducts');
    }
  }

  /**
   * get produdct details by id
   * @param req
   * @param res
   */
  public async getDetails(req: Request, res: Response): Promise<void> {
    try {
      const product: any = await new ProductLib().getProductById(req.params.id);
      res.locals.data = product;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'updateProduct');
    }

  }
}
