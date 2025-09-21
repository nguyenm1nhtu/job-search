const jwt = require('jsonwebtoken');

module.exports = {
    createAccessToken: (data) => {
        const { JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRE } = process.env;

        const token = jwt.sign(data, JWT_SECRET, {
            expiresIn: JWT_ACCESS_TOKEN_EXPIRE,
        });
        return token;
    },

    createRefreshToken: (data) => {
        const { JWT_SECRET, JWT_REFRESH_TOKEN_EXPIRE } = process.env;
        const token = jwt.sign(data, JWT_SECRET, {
            expiresIn: JWT_REFRESH_TOKEN_EXPIRE,
        });
        return token;
    },

    decodeToken: (token) => {
        const { JWT_SECRET } = process.env;
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    },
};
