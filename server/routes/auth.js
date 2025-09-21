const express = require('express');
const router = express.Router();

const registerController = require('../controllers/auth/register.controller');
const loginController = require('../controllers/auth/login.controller');
const refreshTokenController = require('../controllers/auth/refreshToken.controller');
const otpController = require('../controllers/auth/otp.controller');
const resetPasswordController = require('../controllers/auth/resetPassword.controller');
const logoutController = require('../controllers/auth/logout.controller');

const validate = require('../middlewares/validate.middleware');
const limit = require('../middlewares/limit.middleware');
const auth = require('../middlewares/auth.middleware');

router.post('/auth/register', validate.validateRegister, registerController.register);
router.post('/auth/login', validate.validateLogin, loginController.login);
router.post('/auth/otp', validate.validateForgotPassword, limit.forgotPasswordRateLimiter, otpController.sendOtp);
router.post('/auth/reset-password', validate.validateResetPassword, resetPasswordController.resetPasswordController);
router.post('/auth/refresh-token', refreshTokenController.refreshToken);
router.post('/auth/logout', auth.authMiddleware, logoutController.logout);

module.exports = router;
