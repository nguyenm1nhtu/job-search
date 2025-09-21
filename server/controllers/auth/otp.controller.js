const { getUserByEmail } = require('../../models/user');
const { successResponse, errorResponse } = require('../../utils/response');
const { generateOTP } = require('../../models/auth/otp');
const { sendMail } = require('../../utils/mail');

const sendOtp = async (req, res) => {
    try {
        const email = req.body.email;

        const user = await getUserByEmail(email);

        if (!user) {
            throw new Error('Email không tồn tại!');
        }

        const otp = await generateOTP(user.user_id);

        sendMail(email, 'Xác minh tài khoản', `<h1>Mã xác minh là: ${otp}</h1>`);

        return successResponse(res, 200, 'Mã OTP đã được gửi đến email của bạn!', { otp });
    } catch (err) {
        return errorResponse(res, 500, 'Lỗi khi gửi mã OTP', { error: err.message });
    }
};

module.exports = { sendOtp };
