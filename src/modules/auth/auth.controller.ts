import { Request, Response } from "express";
import { CreateUserType, Role } from "../../types";
import * as authService from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/AppError";

const signup = catchAsync(async (req: Request, res: Response) => {
    let { name, email = '', password = '', role = Role.CUSTOMER, phone = '' } = req.body;
    const result = await authService.signup({ name, email, password, role, phone });
    
    if (!result) {
        throw new AppError("User registration failed", 400);
    }
    
    return res.status(201).json({
        "success": true,
        "message": "User registered successfully",
        "data": result
    });
});

const signIn = catchAsync(async (req: Request, res: Response) => {
    let { email, password } = req.body;
    const result = await authService.signIn({ email, password });
    
    if (!result) {
        throw new AppError("Email Or Password wrong", 400);
    }
    
    return res.status(200).json({
        "success": true,
        "message": "Login successful",
        "data": result
    });
});

export {
    signup,
    signIn
};