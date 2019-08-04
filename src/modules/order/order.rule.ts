import { check } from 'express-validator/check';

export const paymentsRule: any = {
  forAdd: [
    check('email')
      .not()
      .isEmpty()
      .withMessage('Email is required'),
    check('email')
       .isEmail()
       .withMessage('Provide valid email'),
    check('card')
      .not()
      .isEmpty()
      .withMessage('Card details are required'),
    check('amount')
      .not()
      .isEmpty()
      .withMessage('Amount required'),
  ],
};
