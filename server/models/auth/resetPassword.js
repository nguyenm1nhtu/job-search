const pool = require('../../config/db');
const bcrypt = require('bcrypt');

const resetPassword = async (email, newPassword, otp) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userQuery = await client.query('SELECT user_id FROM users WHERE email = $1', [email]);
        const user = userQuery.rows[0];
        if (!user || user.code !== otp || new Date() > new Date(user.expires_at)) {
            throw new Error('OTP không hợp lệ hoặc đã hết hạn!');
        }

        await client.query('UPDATE users SET password = $1, otp_id = NULL WHERE email = $2', [hashedPassword, email]);
        await client.query('DELETE FROM otp WHERE otp_id = $1', [user.otp_id]);

        await client.query('COMMIT');
        return { user_id: user.user_id, email: user.email };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

module.exports = { resetPassword };
