import { Application, Request, Response } from 'express';
import { Types } from 'mongoose';
import { AuthHelper, ResponseHandler } from '../../helpers';
import { BaseController } from '../BaseController';
import { ProductLib } from './../products/product.lib';
import { CategoryLib } from './category.lib';
import { categoryRule } from './category.rule';
import { ICategory } from './category.type';
/**
 * category controller
 */
export class CategoryController extends BaseController {
  constructor() {
    super();
    this.init();
  }

  public register(app: Application): void {
    app.use('/api/categories', this.router);
  }

  public init(): void {
    const authHelper: AuthHelper = new AuthHelper();

    this.router.get('/dashboard-products', this.getHomeList);
    this.router.get('/:id/brand-count', this.getBrandWiseCountForCategory);
    this.router.get('/', this.listCategories);
    this.router.get('/:id', this.getCategory);
    this.router.put('/:id', authHelper.adminGuard , this.updateCategory);
    this.router.delete('/:id', authHelper.adminGuard, this.deleteCategory);
    this.router.post(
      '/',
      authHelper.adminGuard,
      categoryRule.forAdd,
      authHelper.validation,
      this.addCategory,
    );
  }

  public async listCategories(req: Request, res: Response): Promise<void> {
    try {
      const categoryLib: CategoryLib = new CategoryLib();
      const categories: ICategory[] = await categoryLib.getAllCategories();
      res.locals.data = categories;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'listCategories');
    }
  }

  public async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryLib: CategoryLib = new CategoryLib();
      const category: ICategory = await categoryLib.getCategoryById(
        req.params.id,
      );
      if (!category) {
        throw Error('Invalid category id passed');
      }
      res.locals.data = category;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'listCategories');
    }
  }

  public async addCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryLib: CategoryLib = new CategoryLib();
      const category: ICategory = await categoryLib.addCategory(req.body);
      res.locals.data = category;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'listCategories');
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
      const categoryProducts: any = await categoryLib.getCategoryWiseProduct();
      res.locals.data = categoryProducts;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getProducts');
    }
  }

  /**
   * Update Category by id
   * @param req
   * @param res
   */
  public async updateCategory(req: Request, res: Response): Promise<void> {
    const body: ICategory = req.body;
    const id: Types.ObjectId = req.params.id;
    try {
      const category: any = await new CategoryLib().findByIdAndUpdate(id, body);
      res.locals.data = category;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'updateCategory');
    }
  }

  /**
   * Delete Category by id
   * @param req
   * @param res
   */
  public async deleteCategory(req: Request, res: Response): Promise<void> {
    const id: Types.ObjectId = req.params.id;
    try {
      const data: any = { isDelete: true };
      const deletedCategory: any = await new CategoryLib().findByIdAndUpdate(
        id,
        data,
      );
      res.locals.data = deletedCategory;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'deleteCategory');
    }
  }

  public async getBrandWiseCountForCategory(req: Request, res: Response): Promise<void> {
    const id: Types.ObjectId = Types.ObjectId(req.params.id);
    try {
      const categories: any =  await new ProductLib().getBrandCountByCategory(id);
      res.locals.data = categories;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'deleteCategory');
    }

  }
}
