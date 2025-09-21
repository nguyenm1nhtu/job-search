const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const { createRecruiter } = require('../recruiter');
const { createCandidate } = require('../candidate');
const { newCompany } = require('../company');
const { newLocation } = require('../location');

const saltRounds = 10;

const registerUser = async ({
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
}) => {
    try {
        // Kiểm tra email trùng
        const emailCheck = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
        if (emailCheck.rows.length) {
            throw new Error(JSON.stringify({ field: 'email', message: 'Email đã tồn tại!' }));
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Tạo user
        const userResult = await pool.query(
            'INSERT INTO users (email, password, role, full_name, avatar_path, created_at, updated_at) ' +
                'VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING user_id, email, role, full_name',
            [email, hashedPassword, role, full_name, avatar_path || null],
        );
        const user = userResult.rows[0];

        // Tạo recruiter hoặc candidate
        if (role === 'recruiter') {
            // Kiểm tra province_code và ward_code
            const provinceCheck = await pool.query('SELECT 1 FROM provinces WHERE code = $1', [province_code]);
            if (!provinceCheck.rows.length) {
                throw new Error(JSON.stringify({ field: 'province_code', message: 'Tỉnh/thành phố không tồn tại!' }));
            }
            const wardCheck = await pool.query('SELECT 1 FROM wards WHERE code = $1 AND province_code = $2', [
                ward_code,
                province_code,
            ]);
            if (!wardCheck.rows.length) {
                throw new Error(JSON.stringify({ field: 'ward_code', message: 'Quận/huyện không tồn tại!' }));
            }

            // Tạo location
            const location = await newLocation({ province_code, ward_code, address });
            const location_id = location.location_id;

            // Tạo công ty
            const company = await newCompany({
                company_name,
                logo_path: null,
                company_description,
                website,
                location_id,
            });
            await createRecruiter(user.user_id, company.company_id);
        } else if (role === 'candidate') {
            await createCandidate(user.user_id, null, null);
        } else {
            throw new Error(JSON.stringify({ field: 'role', message: 'Vai trò không hợp lệ!' }));
        }

        return user;
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { registerUser };
