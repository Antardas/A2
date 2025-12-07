export enum Role {
    ADMIN = 'admin',
    CUSTOMER = 'customer'
}
export enum VehicleType {
    CAR = 'car',
    BIKE = 'bike',
    VAN = 'van',
    SUV = 'SUV'
}
export interface IUser {
    id: number;
    name: string;
    email: string;
    phone:string;
    password: string;
    role: Role;
}

export type CreateUserType = Omit<IUser, 'id'>;
export type UserResponse = Omit<IUser, 'password'>;
export type LoginUser = {
    email:string,
    password:string 
}

export interface IVehicle {
    id: number;
    vehicle_name: string
    type: VehicleType
    registration_number: string
    daily_rent_price: number
    availability_status: string
}

export interface IBookings {
    id: number;
    customer_id: number
    vehicle_id: number
    rent_start_date: Date
    rent_end_date: Date
    total_price: number
    status: string
}

export type CreateVehicleType = Omit<IVehicle, 'id'>;
export type CreateBookingType = {
    customer_id: number;
    vehicle_id: number;
    rent_start_date: string;
    rent_end_date: string;
};