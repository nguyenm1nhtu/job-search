const pool = require('../config/db');

const checkEmailExists = async (email) => {
    const query = await pool.query('SELECT COUNT(*) FROM users WHERE email = $1', [email]);
    return parseInt(query.rows[0].count) > 0;
};

const getUserByEmail = async (email) => {
    const query = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return query.rows.length ? query.rows[0] : null;
};

const getUserById = async (user_id) => {
    const query = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    return query.rows.length ? query.rows[0] : null;
};

//Bo sung them thong tin nguoi dung tuy vao role
const getUserExtraInfo = async (userId, role) => {
    let extraInfo = {};

    if (role === 'recruiter') {
        const recruiter = await pool.query('SELECT company_id FROM recruiter WHERE user_id = $1', [userId]);
        extraInfo.company_id = recruiter.rows[0]?.company_id;
    } else if (role === 'candidate') {
        const candidate = await pool.query('SELECT phone, location_id FROM candidate WHERE user_id = $1', [userId]);
        extraInfo = {
            phone: candidate.rows[0]?.phone,
            location_id: candidate.rows[0]?.location_id,
        };
    }

    return extraInfo;
};

const updateUserProfile = async (user_id, full_name, email, avatar_path) => {
    try {
        const userCheck = await pool.query('SELECT 1 FROM users WHERE user_id = $1', [user_id]);
        if (!userCheck.rows.length) {
            throw new Error('Người dùng không tồn tại!');
        }

        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (full_name) {
            updates.push(`full_name = $${paramIndex++}`);
            values.push(full_name);
        }
        if (email) {
            updates.push(`email = $${paramIndex++}`);
            values.push(email);
        }
        if (avatar_path) {
            updates.push(`avatar_path = $${paramIndex++}`);
            values.push(avatar_path);
        }

        if (updates.length === 0) {
            throw new Error('Không có thông tin nào để cập nhật!');
        }

        updates.push(`updated_at = NOW()`);
        values.push(user_id);

        const query = `UPDATE users SET ${updates.join(', ')} WHERE user_id = $${paramIndex} RETURNING *`;
        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (err) {
        throw new Error(`Lỗi khi cập nhật profile: ${err.message}`);
    }
};

module.exports = {
    checkEmailExists,
    getUserByEmail,
    getUserExtraInfo,
    updateUserProfile,
    getUserById,
};
