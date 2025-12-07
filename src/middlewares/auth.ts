import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import AppError from '../utils/AppError';
import { Role } from '../types';
import { JwtPayload } from '../types/express';


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            throw new AppError('Unauthorized', 401);
        }

        const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        next(new AppError('Unauthorized', 401));
    }
};

export const authorize = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Unauthorized', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError('Forbidden', 403));
        }

        next();
    };
};
