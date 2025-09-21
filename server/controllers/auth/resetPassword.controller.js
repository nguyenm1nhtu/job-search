const { resetPassword } = require('../../models/auth/resetPassword');
const { successResponse, errorResponse } = require('../../utils/response');

const resetPasswordController = async (req, res) => {
    try {
        const { email, otp, new_password } = req.body;
        if (!email || !otp || !new_password) {
            return errorResponse(res, 400, 'Email, OTP và mật khẩu mới không được để trống!');
        }
        const user = await resetPassword(email, new_password, otp);
        return successResponse(res, 200, 'Đặt lại mật khẩu thành công!', { user_id: user.user_id, email: user.email });
    } catch (err) {
        if (err.message === 'OTP không hợp lệ hoặc đã hết hạn!') {
            return errorResponse(res, 400, err.message);
        }
        return errorResponse(res, 500, 'Lỗi khi đặt lại mật khẩu', { error: err.message });
    }
};

module.exports = { resetPasswordController };
