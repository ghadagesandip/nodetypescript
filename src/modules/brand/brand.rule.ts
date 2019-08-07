import { check } from 'express-validator/check';

export const brandRule: any = {
  forAdd: [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Brand name is required'),
    check('category_id')
      .not()
      .isEmpty()
      .withMessage('Category id is required'),
  ],
};
