const pool = require('../../config/db');
const { successResponse, errorResponse } = require('../../utils/response');

const logout = async (req, res) => {
    try {
        await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [req.user.user_id]);
        return successResponse(res, 200, 'Đăng xuất thành công');
    } catch (err) {
        return errorResponse(res, 500, 'Lỗi khi đăng xuất', { error: err.message });
    }
};

module.exports = { logout };
