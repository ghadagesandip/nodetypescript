import { check } from 'express-validator/check';

export const categoryRule: any = {
  forAdd: [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Category name is required'),
    check('slug')
      .not()
      .isEmpty()
      .withMessage('Category name is required'),
  ],
};
