import { NextFunction, Request, Response } from 'express';
import { Result, validationResult } from 'express-validator/check';
import * as HttpStatus from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import { Messages } from './../constants/messages';
import { logger } from './../logger';
import { ResponseHandler } from './response.handler';

export class AuthHelper {

     public async validation(req: Request, res: Response, next: NextFunction): Promise <void> {

        try {
            const errors: Result<{}> = validationResult(req);
            if (!errors.isEmpty()) {
                res.locals.data = errors.array();
                throw new Error('ValidationError');
            } else {
                next();
            }
        } catch (err) {
            res.locals.message = err.message;
            res.locals.details = err;
            res.locals.name = 'ValidationError';
            ResponseHandler.JSONERROR(req, res, 'validation');
        }
    }

    public async guard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const token: string = req.headers.authorization || req.query.token;
            if (token) {
                const auth: any = jwt.verify(token, process.env.SECRET);
                if (auth) {
                    next();
                } else {
                    throw new Error(Messages.INVALID_CREDENTIALS);
                }
            } else {
                throw new Error(Messages.INVALID_CREDENTIALS);
            }
        } catch (err) {
            res.locals.details = err;
            res.locals.data = err;
            res.locals.message = 'AuthenticationError';
            res.locals.statusCode = HttpStatus.UNAUTHORIZED ;
            ResponseHandler.JSONERROR(req, res, 'Authorization');
        }
    }
}
