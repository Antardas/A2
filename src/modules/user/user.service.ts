import { UserResponse } from './../../types/index';
import bcrypt from 'bcryptjs'
import { pool } from "../../config/db";
import { CreateUserType, IUser } from "../../types";

const createUser = async ({ email, name, password, role,phone  }: CreateUserType): Promise<UserResponse | null> => {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result: { rows: IUser[] } = await pool.query('INSERT INTO users(name,email,phone,password,role) VALUES($1,$2,$3,$4,$5) RETURNING *', [name, email,phone, hashedPassword, role]);
    const user = result.rows[0];
    if (!user) {
        return null
    }
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
    }
}

const getUserByEmail = async (email: string) => {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase()])
    if (!result.rows[0]) {
        return null
    }
    return result.rows[0] as IUser
}

const getAllUsers = async () => {
    const result: { rows: IUser[] } = await pool.query('SELECT id, name, email, phone, role FROM users');
    return result.rows.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
    }));
}

const updateUser = async (id: number, payload: Partial<CreateUserType>) => {
    let setQueryStr = '';
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
            if (values.length > 0) {
                setQueryStr += ', ';
            }
            setQueryStr += `${key}=$${paramIndex}`;
            
            if (key === 'password') {
                const hashedPassword = await bcrypt.hash(val as string, 10);
                values.push(hashedPassword);
            } else {
                values.push(val);
            }
            paramIndex++;
        }
    }

    if (values.length === 0) {
        return null;
    }

    values.push(id);
    const result: { rows: IUser[] } = await pool.query(
        `UPDATE users SET ${setQueryStr} WHERE id=$${paramIndex} RETURNING id, name, email, phone, role`,
        values
    );
    return result.rows[0] ?? null;
}

const checkActiveBookings = async (userId: number) => {
    const result = await pool.query(
        "SELECT COUNT(*) as count FROM bookings WHERE customer_id=$1 AND status='active'",
        [userId]
    );
    return parseInt(result.rows[0].count) > 0;
}

const deleteUser = async (id: number) => {
    const result: { rows: IUser[] } = await pool.query('DELETE FROM users WHERE id=$1 RETURNING id', [id]);
    return result.rows[0] ?? null;
}

export {
    createUser,
    getUserByEmail,
    getAllUsers,
    updateUser,
    deleteUser,
    checkActiveBookings
}