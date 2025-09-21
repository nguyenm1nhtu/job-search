const { createAccessToken } = require('../../utils/jwt');
const pool = require('../../config/db');

const refreshAccessToken = async (refreshToken) => {
    const result = await pool.query(
        'SELECT rt.user_id, role FROM refresh_tokens rt JOIN users u ON rt.user_id = u.user_id WHERE token = $1 AND expires_at > NOW()',
        [refreshToken],
    );

    if (!result.rows[0]) {
        throw new Error('Refresh token không hợp lệ!');
    }

    const { user_id, role } = result.rows[0];

    const newAccessToken = createAccessToken({ user_id, role });

    return {
        accessToken: newAccessToken,
    };
};

module.exports = { refreshAccessToken };
