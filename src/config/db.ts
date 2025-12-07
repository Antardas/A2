import { Pool } from 'pg'
import config from '.'

export const pool = new Pool({
    connectionString: config.connection_str
})

const initDB = async () => {

    await pool.query(`CREATE TABLE IF NOT EXISTS users(
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL CHECK (email = LOWER(email)),
        password VARCHAR(255) NOT NULL CHECK (char_length(password) >= 6),
        role VARCHAR(20) NOT NULL  DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
        phone VARCHAR(20) NOT NULL
    )`)

    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx ON users (LOWER(email))`)

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
            id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            type VARCHAR(10) NOT NULL CHECK(type IN('car', 'bike', 'van', 'SUV')),
            registration_number VARCHAR(50) NOT NULL UNIQUE,
            daily_rent_price INT CHECK (daily_rent_price > 0),
            availability_status VARCHAR(10) NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'booked'))

        )

    `)

    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            customer_id INT NOT NULL  REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price INT NOT NULL CHECK (total_price > 0),
            status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned')),
            CHECK (rent_end_date > rent_start_date)
        )
    `)


}

export default initDB;
