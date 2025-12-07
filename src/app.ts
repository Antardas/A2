import config from "./config";
import initDB from "./config/db";
import express, { Express, NextFunction, Request, Response } from 'express';
import { authRoute } from "./modules/auth/auth.route";
import { vehicleRoute } from "./modules/vehicle/vehicle.route";
import { userRoute } from "./modules/user/user.route";
import { bookingRoute } from "./modules/booking/booking.route";
import AppError from "./utils/AppError";

initDB();
const app: Express = express()

app.use(express.json())

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/vehicles', vehicleRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/bookings', bookingRoute)

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
})

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error)
    
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const status = error instanceof AppError ? error.status : 'error';
    const message = error.message || 'Something went wrong';
    
    res.status(statusCode).json({
        success: false,
        message,
        errors: message,
        stack: config.is_dev ? error.stack : undefined
    })
})

export default app;