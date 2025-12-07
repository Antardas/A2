import { pool } from "../../config/db";
import { CreateVehicleType, IVehicle } from "../../types";

const addVehicle = async (payload: CreateVehicleType) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const result: { rows: IVehicle[] } = await pool.query('INSERT INTO vehicles(vehicle_name,type,registration_number, daily_rent_price, availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *', [vehicle_name, type, registration_number, daily_rent_price, availability_status])
    if (!result.rows[0]) return null;
    return result.rows[0]
}

const getAll = async () => {
    const result: { rows: IVehicle[] } = await pool.query('SELECT * FROM vehicles');
    return result.rows;
}

const getVehicle = async (id: number) => {
    const result: { rows: IVehicle[] } = await pool.query('SELECT * FROM vehicles WHERE id=$1', [id])
    return result.rows[0] ?? null
}

const updateVehicle = async (id: number, payload: Partial<CreateVehicleType>) => {
    let setQueryStr = '';
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(payload).forEach(([key, val]) => {
        if (val !== undefined) {
            if (values.length > 0) {
                setQueryStr += ', ';
            }
            setQueryStr += `${key}=$${paramIndex}`;
            values.push(val);
            paramIndex++;
        }
    });

    if (values.length === 0) {
        return null;
    }

    values.push(id);
    const result: { rows: IVehicle[] } = await pool.query(
        `UPDATE vehicles SET ${setQueryStr} WHERE id=$${paramIndex} RETURNING *`,
        values
    );
    return result.rows[0] ?? null;
}

const checkActiveBookings = async (vehicleId: number) => {
    const result = await pool.query(
        "SELECT COUNT(*) as count FROM bookings WHERE vehicle_id=$1 AND status='active'",
        [vehicleId]
    );
    return parseInt(result.rows[0].count) > 0;
}

const deleteVehicle = async (id: number) => {
    const result: { rows: IVehicle[] } = await pool.query('DELETE FROM vehicles WHERE id=$1 RETURNING *', [id]);
    return result.rows[0] ?? null;
}

export {
    addVehicle,
    getAll,
    getVehicle,
    updateVehicle,
    deleteVehicle,
    checkActiveBookings
}

