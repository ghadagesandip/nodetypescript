import { check } from 'express-validator/check';

export const paymentsRule: any = {
  forAdd: [
    check('token')
      .not()
      .isEmpty()
      .withMessage('Token is required'),
    check('amount')
      .not()
      .isEmpty()
      .withMessage('Amount required'),
  ],
};
