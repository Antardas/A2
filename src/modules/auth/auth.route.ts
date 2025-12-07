import express, { Router } from "express";
import * as authController from './auth.controller'

const router: Router = Router();

router.post('/signup', authController.signup)
router.post('/signin', authController.signIn)

export const authRoute = router;