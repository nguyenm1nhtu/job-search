// Kiem tra user đã đăng nhập hay chưa

const { decodeToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 401, 'Chưa đăng nhập!');
    }

    const token = authHeader.split(' ')[1]; //Lay token sau Bearer

    try {
        const info = decodeToken(token);
        req.user = info; //Luu thong tin user vao req
        next();
    } catch (err) {
        return errorResponse(res, 401, 'Token không hợp lệ hoặc đã hết hạn!');
    }
};

module.exports = { authMiddleware };
