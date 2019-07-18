import { Application, Request, Response } from 'express';
import { PaginateResult, Types } from 'mongoose';
import { BaseController } from '../BaseController';
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
    this.router.get('/', this.getProducts);
    this.router.put('/:id', authHelper.guard, this.updateProduct);
    this.router.delete('/:id', authHelper.guard, this.deleteProduct);
    this.router.post(
      '/',
      authHelper.guard,
      authHelper.validation,
      this.addProduct,
    );
    this.router.get('/home-list', this.getHomeList);
  }

  public async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const utils: Utils = new Utils();
      const filters: any = {};
      if (req.query.brand) {
        filters.brand = { $regex: req.query.brand, $options: 'i' };
      }
      if (req.query.category_id) {
        filters.category_id = req.query.category_id;
      }
      const options: any = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
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
}
