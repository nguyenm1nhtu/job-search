const { registerUser } = require('../../models/auth/register');
const { successResponse, errorResponse } = require('../../utils/response');

const register = async (req, res) => {
    try {
        const {
            email,
            password,
            role,
            full_name,
            avatar_path,
            company_name,
            company_description,
            website,
            province_code,
            ward_code,
            address,
        } = req.body;

        const user = await registerUser({
            email,
            password,
            role,
            full_name,
            avatar_path,
            company_name,
            company_description,
            website,
            province_code,
            ward_code,
            address,
        });
        return successResponse(res, 201, 'Đăng ký thành công!', {
            user_id: user.user_id,
            email: user.email,
            full_name: user.full_name,
        });
    } catch (err) {
        let errors = {};
        try {
            const parsedError = JSON.parse(err.message);
            errors[parsedError.field] = parsedError.message;
        } catch (parseErr) {
            errors.general = err.message || 'Lỗi khi đăng ký';
        }
        return errorResponse(res, 400, 'Lỗi khi đăng ký', errors);
    }
};

module.exports = { register };
