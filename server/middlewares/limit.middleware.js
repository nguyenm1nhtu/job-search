const rateLimit = require('express-rate-limit');

// Giới hạn đăng nhập: 10 lần trong 15 phút
const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau 15 phút.',
});

// Giới hạn gửi OTP: 10 lần trong 15 phút
const forgotPasswordRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Quá nhiều yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau 15 phút.',
});

module.exports = { loginRateLimiter, forgotPasswordRateLimiter };
