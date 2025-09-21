const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

const validateRegister = [
    body('email').isEmail().withMessage('Email không hợp lệ!'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải có ít nhất 6 ký tự!')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
        .withMessage('Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số!'),
    body('role').isIn(['candidate', 'recruiter']).withMessage('Vai trò không hợp lệ!'),
    body('full_name')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Tên chỉ được chứa chữ cái và khoảng trắng!')
        .custom((value) => {
            const words = value.trim().split(/\s+/);
            if (words.length < 2) {
                throw new Error('Tên phải có ít nhất 2 từ!');
            }
            return true;
        }),
    body('company_name')
        .if(body('role').equals('recruiter'))
        .notEmpty()
        .withMessage('Tên công ty không được để trống!'),
    body('website').if(body('role').equals('recruiter')).notEmpty().withMessage('Website không được để trống!'),
    body('province_code')
        .if(body('role').equals('recruiter'))
        .notEmpty()
        .withMessage('Tỉnh/thành phố không được để trống!'),
    body('ward_code').if(body('role').equals('recruiter')).notEmpty().withMessage('Quận/huyện không được để trống!'),
    body('address')
        .if(body('role').equals('recruiter'))
        .notEmpty()
        .withMessage('Địa chỉ chi tiết không được để trống!'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorObject = errors.array().reduce((obj, error) => {
                obj[error.param] = error.msg;
                return obj;
            }, {});
            return errorResponse(res, 400, 'Dữ liệu đầu vào không hợp lệ!', errorObject);
        }
        next();
    },
];

const validateLogin = [
    body('email').isEmail().withMessage('Email không hợp lệ!'),
    body('password').notEmpty().withMessage('Mật khẩu không được để trống!'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorObject = errors.array().reduce((obj, error) => {
                obj[error.param] = error.msg;
                return obj;
            }, {});
            return errorResponse(res, 400, 'Dữ liệu đầu vào không hợp lệ!', errorObject);
        }
        next();
    },
];

const validateForgotPassword = [
    body('email').isEmail().withMessage('Email không hợp lệ!'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorObject = errors.array().reduce((obj, error) => {
                obj[error.param] = error.msg;
                return obj;
            }, {});
            return errorResponse(res, 400, 'Dữ liệu đầu vào không hợp lệ!', errorObject);
        }
        next();
    },
];

const validateResetPassword = [
    body('email').isEmail().withMessage('Email không hợp lệ!'),
    body('otp').isLength({ min: 5, max: 5 }).withMessage('OTP phải có 5 chữ số!'),
    body('new_password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự!')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
        .withMessage('Mật khẩu mới phải chứa ít nhất một chữ hoa, một chữ thường và một số!'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorObject = errors.array().reduce((obj, error) => {
                obj[error.param] = error.msg;
                return obj;
            }, {});
            return errorResponse(res, 400, 'Dữ liệu đầu vào không hợp lệ!', errorObject);
        }
        next();
    },
];

module.exports = { validateRegister, validateLogin, validateForgotPassword, validateResetPassword };
