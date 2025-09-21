const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.connect()
    .then((client) => {
        console.log('Kết nối thành công');
        client.release();
    })
    .catch((err) => {
        console.error('Lỗi kết nối:', err.message);
        process.exit(1);
    });

module.exports = pool;
