import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { CreateUserType, LoginUser, UserResponse } from "../../types";
import * as userService from "../user/user.service";
import config from '../../config';
const signup = async (payload: CreateUserType) => {
    payload.email = payload.email.toLowerCase()
    return await userService.createUser(payload)
}

const signIn = async ({ email, password }: LoginUser) => {
    const result = await userService.getUserByEmail(email);
    if (!result) {
        return null;
    }
    const isPasswordMatched = await bcrypt.compare(password, result.password);

    if (!isPasswordMatched) {
        return null;
    }
    const token = jwt.sign({
        email: result.email,
        role: result.role,
        userId: result.id
    }, config.jwt_secret);
    
    const userResponse:UserResponse= {
        email:result.email,
        id:result.id,
        name:result.name,
        role:result.role,
        phone:result.phone
    }
    return {
        token,
        user:userResponse
    }
}

export {
    signup,
    signIn
}