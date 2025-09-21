const { createAccessToken, createRefreshToken } = require('../../utils/jwt');
const { getUserByEmailPassword } = require('../../models/auth/login');
const { getUserExtraInfo } = require('../../models/user');
const { successResponse, errorResponse } = require('../../utils/response');
const pool = require('../../config/db');

const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await getUserByEmailPassword(email, password);

        const tokenData = {
            user_id: user.user_id,
            role: user.role,
        };
        const token = createAccessToken(tokenData);
        const refreshToken = createRefreshToken(tokenData);

        // Xóa refresh token cũ của user
        await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [user.user_id]);

        const expiresAt = new Date(Date.now() + 168 * 60 * 60 * 1000).toISOString(); //168h

        // Lưu refresh token mới vào database
        await pool.query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [
            user.user_id,
            refreshToken,
            expiresAt,
        ]);

        const extraInfo = await getUserExtraInfo(user.user_id, user.role);

        return successResponse(res, 200, ' Đăng nhập thành công', {
            token,
            refreshToken,
            user: {
                user_id: user.user_id,
                email: user.email,
                role: user.role,
                full_name: user.full_name,
                ...extraInfo,
            },
        });
    } catch (err) {
        return errorResponse(res, 500, 'Lỗi khi đăng nhập', { error: err.message });
    }
};

module.exports = { login };
