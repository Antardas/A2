import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({
    path: path.join(process.cwd(), '.env')
})

const config = {
    port: process.env.PORT || 4000,
    connection_str: process.env.CONNECTION_STR,
    node_env: process.env.NODE_ENV || 'development',
    is_dev: process.env.NODE_ENV === 'development',
    jwt_secret: process.env.JWT_SECRET || 'secret'
}

export default config

