//Kiem tra quyen truy cap cua user

const { errorResponse } = require('../utils/response');

const role = (allowedRole) => (req, res, next) => {
    if (!req.user || !allowedRole.includes(req.user.role)) {
        return errorResponse(res, 403, 'Bạn không có quyền truy cập vào tài nguyên này!');
    }
    next();
};

module.exports = { role };
