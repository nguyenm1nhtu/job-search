const pool = require('../../config/db');
const bcrypt = require('bcrypt');

const getUserByEmailPassword = async (email, password) => {
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (!user.rows.length) {
            throw new Error('Email không tồn tại!');
        }
        const passwordMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!passwordMatch) {
            throw new Error('Mật khẩu không chính xác!');
        }
        return user.rows[0];
    } catch (err) {
        throw err;
    }
};

module.exports = { getUserByEmailPassword };
