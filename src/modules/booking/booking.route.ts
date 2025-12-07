import express, { Router } from "express";
import * as bookingController from './booking.controller';
import { authenticate } from '../../middlewares/auth';

const router: Router = Router();

router.post('/', authenticate, bookingController.createBooking);
router.get('/', authenticate, bookingController.getAllBookings);
router.put('/:bookingId', authenticate, bookingController.updateBooking);

export const bookingRoute = router;
