import express, { Router } from "express";
import * as vehicleController from './vehicle.controller';
import { authenticate, authorize } from '../../middlewares/auth';
import { Role } from '../../types';

const router: Router = Router();

router.post('/', authenticate, authorize(Role.ADMIN), vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);
router.get('/:vehicleId', vehicleController.getVehicleById);
router.put('/:vehicleId', authenticate, authorize(Role.ADMIN), vehicleController.updateVehicle);
router.delete('/:vehicleId', authenticate, authorize(Role.ADMIN), vehicleController.deleteVehicle);

export const vehicleRoute = router;
