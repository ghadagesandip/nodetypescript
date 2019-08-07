import * as express from 'express';

import { AuthController } from './modules/auth/auth.controller';
import { BrandController } from './modules/brand/brand.controller';
import { CartController } from './modules/cart/cart.controller';
import { CategoryController } from './modules/category/category.controller';
import { PaymentsController } from './modules/order/order.controller';
import { ProductController } from './modules/products/product.controller';
import { UserController } from './modules/user/user.controller';

export function registerRoutes(app: express.Application): void {
  new UserController().register(app);
  new AuthController().register(app);
  new CategoryController().register(app);
  new ProductController().register(app);
  new CartController().register(app);
  new BrandController().register(app);
  new PaymentsController().register(app);
}
