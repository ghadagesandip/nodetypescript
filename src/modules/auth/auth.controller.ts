import * as crypto from 'crypto';
import { Application, Request, Response } from 'express';
import { Messages } from '../../constants/messages';
import { BaseController } from '../BaseController';
import {
  AuthHelper,
  EmailServer,
  ResponseHandler,
  Utils,
} from './../../helpers';
import { UserLib } from './../user/user.lib';
import { userRules } from './../user/user.rules';
import { IUser } from './../user/user.type';

/**
 * AuthController
 */
export class AuthController extends BaseController {
  constructor() {
    super();
    this.init();
  }

  public register(app: Application): void {
    app.use('/api/auth', this.router);
  }

  public init(): void {
    const authHelper: AuthHelper = new AuthHelper();
    this.router.post(
      '/sign-up',
      userRules.forSignUser,
      authHelper.validation,
      this.signUp,
    );
    this.router.post(
      '/login',
      userRules.forSignIn,
      authHelper.validation,
      this.login,
    );
    this.router.post('/forgot-password', this.forgotPassword);
    this.router.post('/reset-password', authHelper.resetPasswordGuard , this.resetPassword);
    this.router.get('/verify-token/:token', this.verifyToken);
  }

  public async signUp(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const userData: IUser = req.body;
      const userResult: IUser = await user.saveUser(userData);
      res.locals.data = userResult;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'addUser');
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const { email, password } = req.body;
      const loggedInUser: any = await user.loginUserAndCreateToken(
        email,
        password,
      );
      res.locals.data = loggedInUser;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.errorCode = 401;
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'login');
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const mailer: EmailServer = new EmailServer();
      const utils: Utils = new Utils();

      const email: string = req.body.email ? req.body.email : null;
      const tmpForgotPassCode: number = await utils.getToken();
      const userData: IUser = await user.getUserByEmail(email);
      await user.updateUser(userData._id, {
        tmp_forgot_pass_code: tmpForgotPassCode,
        tmp_forgot_pass_datetime: new Date(),
      });
      const options: any = {
        subject: 'Forgot Password',
        templateName: 'password-reset',
        to: userData.email,
        replace: {
          code: tmpForgotPassCode,
        },
      };
      const emailres: any = await mailer.sendEmail(options);
      res.locals.data = emailres;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'forgotPassword');
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const password: string = await user.generateHash(req.body.password);
      const updatedUser: IUser = await user.updateUser(req.body.loggedinUserId, {
        password: password,
      });
      await user.removeTokenAndTime(req.body.loggedinUserId);
      res.locals.data = updatedUser;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'resetPassword');
    }
  }

  public async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const verifyTokenVal: IUser = await user.checkToken(Number(req.params.token));
      if (verifyTokenVal != null) {
        const checkExpiryVal: string = await user.checkExpiry(verifyTokenVal);
        res.locals.data = checkExpiryVal;
        res.locals.message = checkExpiryVal === Messages.TOKEN_EXPIRED ? Messages.TOKEN_EXPIRED : Messages.TOKEN_VERIFIED;
      } else {
        res.locals.data = null;
        res.locals.message = Messages.INVALID_TOKEN;
      }
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (error) {
      res.locals.data = error;
      ResponseHandler.JSONERROR(req, res, 'verifyToken');
    }
  }
}
