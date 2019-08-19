import { Application, Request, Response } from 'express';
import { Types } from 'mongoose';
import { AuthHelper, ResponseHandler } from '../../helpers';
import { BaseController } from '../BaseController';
import { BrandLib } from './brand.lib';
import { brandRule } from './brand.rule';
import { IBrand } from './brand.type';
/**
 * Brand controller
 */
export class BrandController extends BaseController {
  constructor() {
    super();
    this.init();
  }

  public register(app: Application): void {
    app.use('/api/brands', this.router);
  }

  public init(): void {
    const authHelper: AuthHelper = new AuthHelper();

    this.router.get('/', this.listBrands);
    this.router.get('/:id', this.getBrand);
    this.router.get('/filter/:id', this.filterProdByBrand);
    this.router.put('/:id', authHelper.adminGuard, this.updateBrand);
    this.router.delete('/:id', authHelper.adminGuard, this.deleteBrand);
    this.router.post(
      '/',
      authHelper.adminGuard,
      brandRule.forAdd,
      authHelper.validation,
      this.addBrand,
    );
  }

/**
 * List of all brands
 * @param req
 * @param res
 */
  public async listBrands(req: Request, res: Response): Promise<void> {
    try {
      const brandLib: BrandLib = new BrandLib();
      const filters: any = {};
      filters.category_id = req.query && req.query.category_id ? req.query.category_id : undefined;
      const brands: IBrand[] = await brandLib.getAllBrands(filters);
      res.locals.data = brands;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'listBrands');
    }
  }

/**
 * Get brand by id
 * @param req
 * @param res
 */
  public async getBrand(req: Request, res: Response): Promise<void> {
    try {
      const brandLib: BrandLib = new BrandLib();
      const brand: IBrand = await brandLib.getBrandById(
        req.params.id,
      );
      if (!brand) {
        throw Error('Invalid brand id passed');
      }
      res.locals.data = brand;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getBrand');
    }
  }

/**
 * Insert Brand
 * @param req
 * @param res
 */
  public async addBrand(req: Request, res: Response): Promise<void> {
    try {
      const brandLib: BrandLib = new BrandLib();
      const brand: IBrand = await brandLib.addBrand(req.body);
      res.locals.data = brand;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'addBrand');
    }
  }

  /**
   * Update Brand by id
   * @param req
   * @param res
   */
  public async updateBrand(req: Request, res: Response): Promise<void> {
    const body: IBrand = req.body;
    const id: Types.ObjectId = req.params.id;
    try {
      const brand: any = await new BrandLib().findByIdAndUpdate(id, body);
      res.locals.data = brand;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'updateBrand');
    }
  }

  /**
   * Delete Brand by id
   * @param req
   * @param res
   */
  public async deleteBrand(req: Request, res: Response): Promise<void> {
    const id: Types.ObjectId = req.params.id;
    try {
      const data: any = { isDelete: true };
      const deletedBrand: any = await new BrandLib().findByIdAndUpdate(
        id,
        data,
      );
      res.locals.data = deletedBrand;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'deleteBrand');
    }
  }
/**
 * Get products by brand (filter)
 * @param req
 * @param res
 */
  public async filterProdByBrand(req: Request, res: Response): Promise<void> {
    try {
      const brandLib: BrandLib = new BrandLib();
      const brand: IBrand = await brandLib.filterByBrand(
        req.params.id,
      );
      if (!brand) {
        throw Error('Invalid brand id');
      }
      res.locals.data = brand;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getBrand');
    }
  }
}
