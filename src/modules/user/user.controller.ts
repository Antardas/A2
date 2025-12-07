import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as userService from './user.service';
import AppError from '../../utils/AppError';
import { Role } from '../../types';

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.getAllUsers();

    res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: result
    });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    if (!userId) {
        throw new AppError('User ID is required', 400);
    }

    const userIdNum = parseInt(userId);
    const requestingUser = req.user;

    if (!requestingUser) {
        throw new AppError('Unauthorized', 401);
    }

    if (requestingUser.role !== Role.ADMIN && requestingUser.userId !== userIdNum) {
        throw new AppError('Forbidden', 403);
    }

    const result = await userService.updateUser(userIdNum, req.body);

    if (!result) {
        throw new AppError('User not found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: result
    });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    if (!userId) {
        throw new AppError('User ID is required', 400);
    }

    const userIdNum = parseInt(userId);

    const bookingCheck = await userService.checkActiveBookings(userIdNum);
    if (bookingCheck) {
        throw new AppError('Cannot delete user with active bookings', 400);
    }

    const result = await userService.deleteUser(userIdNum);

    if (!result) {
        throw new AppError('User not found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});
