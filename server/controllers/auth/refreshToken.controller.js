const { refreshAccessToken } = require('../../models/auth/refreshToken');
const { successResponse, errorResponse } = require('../../utils/response');

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const { accessToken } = await refreshAccessToken(refreshToken);

        return successResponse(res, 200, 'Làm mới token thành công!', {
            token: accessToken,
            expiresIn: 1800,
        });
    } catch (err) {
        return errorResponse(res, 500, 'Lỗi khi làm mới token');
    }
};

module.exports = { refreshToken };
