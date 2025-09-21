const pool = require('../../config/db');

const generateOTP = async (user_id) => {
    const code = Math.floor(10000 + Math.random() * 90000); //Radom OTP
    const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 phút sau sẽ hết hạn
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const query = await client.query(
            'INSERT INTO otp (user_id, code, expires_at) VALUES ($1, $2, $3) ' + 'RETURNING user_id, code, expires_at',
            [user_id, code, expires_at],
        );
        const otp = query.rows[0];

        await client.query('COMMIT');
        return otp;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

module.exports = { generateOTP };
