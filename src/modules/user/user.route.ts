import express, { Router } from "express";
import * as userController from './user.controller';
import { authenticate, authorize } from '../../middlewares/auth';
import { Role } from '../../types';

const router: Router = Router();

router.get('/', authenticate, authorize(Role.ADMIN), userController.getAllUsers);
router.put('/:userId', authenticate, userController.updateUser);
router.delete('/:userId', authenticate, authorize(Role.ADMIN), userController.deleteUser);

export const userRoute = router;
