export interface JwtPayload {
    email: string;
    role: Role;
    userId: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}