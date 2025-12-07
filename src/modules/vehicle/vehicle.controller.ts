import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import * as vehicleService from './vehicle.service';
import AppError from '../../utils/AppError';
import { CreateVehicleType } from '../../types';

export const createVehicle = catchAsync(async (req: Request<{}, {}, CreateVehicleType>, res: Response) => {
    const result = await vehicleService.addVehicle(req.body);
    
    if (!result) {
        throw new AppError('Vehicle creation failed', 400);
    }

    res.status(201).json({
        success: true,
        message: 'Vehicle created successfully',
        data: result
    });
});

export const getAllVehicles = catchAsync(async (req: Request, res: Response) => {
    const result = await vehicleService.getAll();

    if (result.length === 0) {
        return res.status(200).json({
            success: true,
            message: 'No vehicles found',
            data: []
        });
    }

    res.status(200).json({
        success: true,
        message: 'Vehicles retrieved successfully',
        data: result
    });
});

export const getVehicleById = catchAsync(async (req: Request, res: Response) => {
    const vehicleId = req.params.vehicleId;
    if (!vehicleId) {
        throw new AppError('Vehicle ID is required', 400);
    }
    
    const result = await vehicleService.getVehicle(parseInt(vehicleId));

    if (!result) {
        throw new AppError('Vehicle not found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Vehicle retrieved successfully',
        data: result
    });
});

export const updateVehicle = catchAsync(async (req: Request, res: Response) => {
    const vehicleId = req.params.vehicleId;
    if (!vehicleId) {
        throw new AppError('Vehicle ID is required', 400);
    }
    
    const result = await vehicleService.updateVehicle(parseInt(vehicleId), req.body);

    if (!result) {
        throw new AppError('Vehicle not found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Vehicle updated successfully',
        data: result
    });
});

export const deleteVehicle = catchAsync(async (req: Request, res: Response) => {
    const vehicleId = req.params.vehicleId;
    if (!vehicleId) {
        throw new AppError('Vehicle ID is required', 400);
    }

    const vehicleIdNum = parseInt(vehicleId);

    const bookingCheck = await vehicleService.checkActiveBookings(vehicleIdNum);
    if (bookingCheck) {
        throw new AppError('Cannot delete vehicle with active bookings', 400);
    }
    
    const result = await vehicleService.deleteVehicle(vehicleIdNum);

    if (!result) {
        throw new AppError('Vehicle not found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully'
    });
});
