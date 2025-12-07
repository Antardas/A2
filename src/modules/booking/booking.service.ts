import { pool } from "../../config/db";
import { CreateBookingType, IBookings } from "../../types";

const createBooking = async (payload: CreateBookingType) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const vehicleResult = await pool.query(
        'SELECT id, vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id=$1',
        [vehicle_id]
    );

    if (!vehicleResult.rows[0]) {
        return null;
    }

    const vehicle = vehicleResult.rows[0];
    if (vehicle.availability_status !== 'available') {
        return { error: 'Vehicle is not available' };
    }

    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const total_price = days * vehicle.daily_rent_price;

    await pool.query('UPDATE vehicles SET availability_status=$1 WHERE id=$2', ['booked', vehicle_id]);

    const result: { rows: IBookings[] } = await pool.query(
        'INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, 'active']
    );

    const booking = result.rows[0];
    return {
        ...booking,
        vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price
        }
    };
};

const getAllBookings = async (userId?: number, role?: string) => {
    let query = `
        SELECT 
            b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
            u.name as customer_name, u.email as customer_email,
            v.vehicle_name, v.registration_number, v.type
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        JOIN vehicles v ON b.vehicle_id = v.id
    `;

    const params: any[] = [];

    if (role !== 'admin' && userId) {
        query += ' WHERE b.customer_id = $1';
        params.push(userId);
    }

    const result = await pool.query(query, params);

    return result.rows.map((row: any) => {
        if (role === 'admin') {
            return {
                id: row.id,
                customer_id: row.customer_id,
                vehicle_id: row.vehicle_id,
                rent_start_date: row.rent_start_date,
                rent_end_date: row.rent_end_date,
                total_price: row.total_price,
                status: row.status,
                customer: {
                    name: row.customer_name,
                    email: row.customer_email
                },
                vehicle: {
                    vehicle_name: row.vehicle_name,
                    registration_number: row.registration_number
                }
            };
        } else {
            return {
                id: row.id,
                vehicle_id: row.vehicle_id,
                rent_start_date: row.rent_start_date,
                rent_end_date: row.rent_end_date,
                total_price: row.total_price,
                status: row.status,
                vehicle: {
                    vehicle_name: row.vehicle_name,
                    registration_number: row.registration_number,
                    type: row.type
                }
            };
        }
    });
};

const updateBooking = async (id: number, status: string, userId: number, role: string) => {
    const bookingResult = await pool.query('SELECT * FROM bookings WHERE id=$1', [id]);

    if (!bookingResult.rows[0]) {
        return null;
    }

    const booking = bookingResult.rows[0];

    if (role !== 'admin' && booking.customer_id !== userId) {
        return { error: 'Forbidden' };
    }

    if (status === 'cancelled') {
        if (role !== 'admin' && booking.customer_id !== userId) {
            return { error: 'Forbidden' };
        }
        await pool.query('UPDATE vehicles SET availability_status=$1 WHERE id=$2', ['available', booking.vehicle_id]);
    } else if (status === 'returned') {
        if (role !== 'admin') {
            return { error: 'Only admin can mark as returned' };
        }
        await pool.query('UPDATE vehicles SET availability_status=$1 WHERE id=$2', ['available', booking.vehicle_id]);
    }

    const result: { rows: IBookings[] } = await pool.query(
        'UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *',
        [status, id]
    );

    return result.rows[0];
};

export {
    createBooking,
    getAllBookings,
    updateBooking
};
