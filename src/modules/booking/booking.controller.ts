import { Request, Response } from "express";
import catchAsync from '../../utils/catchAsync';
import * as bookingService from './booking.service';
import AppError from '../../utils/AppError';
import { CreateBookingType } from '../../types';

export const createBooking = catchAsync(async (req: Request, res: Response) => {
    const result = await bookingService.createBooking(req.body);

    if (!result) {
        throw new AppError('Vehicle not found', 404);
    }

    if ('error' in result) {
        throw new AppError(result.error, 400);
    }

    res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: result
    });
});

export const getAllBookings = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new AppError('Unauthorized', 401);
    }

    const result = await bookingService.getAllBookings(user.userId, user.role);

    const message = user.role === 'admin' 
        ? 'Bookings retrieved successfully' 
        : 'Your bookings retrieved successfully';

    res.status(200).json({
        success: true,
        message,
        data: result
    });
});

export const updateBooking = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    if (!bookingId) {
        throw new AppError('Booking ID is required', 400);
    }

    const user = req.user;
    if (!user) {
        throw new AppError('Unauthorized', 401);
    }

    const { status } = req.body;
    if (!status) {
        throw new AppError('Status is required', 400);
    }

    const result = await bookingService.updateBooking(
        parseInt(bookingId),
        status,
        user.userId,
        user.role
    );

    if (!result) {
        throw new AppError('Booking not found', 404);
    }

    if ('error' in result) {
        throw new AppError(result.error, 403);
    }

    let message = 'Booking updated successfully';
    if (status === 'cancelled') {
        message = 'Booking cancelled successfully';
    } else if (status === 'returned') {
        message = 'Booking marked as returned. Vehicle is now available';
    }

    res.status(200).json({
        success: true,
        message,
        data: result
    });
});
