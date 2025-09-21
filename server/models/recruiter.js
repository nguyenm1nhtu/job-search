const pool = require('../config/db');

const createRecruiter = async (user_id, company_id) => {
    try {
        // Kiểm tra user
        const userCheck = await pool.query('SELECT 1 FROM users WHERE user_id = $1 AND role = $2', [
            user_id,
            'recruiter',
        ]);
        if (!userCheck.rows.length) {
            throw new Error(JSON.stringify({ field: 'role', message: 'User không phải recruiter!' }));
        }
        // Kiểm tra company
        const companyCheck = await pool.query('SELECT 1 FROM company WHERE company_id = $1', [company_id]);
        if (!companyCheck.rows.length) {
            throw new Error(JSON.stringify({ field: 'company_id', message: 'Công ty không tồn tại!' }));
        }
        const result = await pool.query(
            'INSERT INTO recruiter (user_id, company_id, created_at, updated_at) ' +
                'VALUES ($1, $2, NOW(), NOW()) RETURNING *',
            [user_id, company_id],
        );
        return result.rows[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

const getRecruiterByUserId = async (user_id) => {
    try {
        const result = await pool.query(
            'SELECT r.*, c.company_name, c.logo_path, c.company_description, c.website, c.location_id ' +
                'FROM recruiter r ' +
                'LEFT JOIN company c ON r.company_id = c.company_id ' +
                'WHERE r.user_id = $1',
            [user_id],
        );
        return result.rows[0] || null;
    } catch (err) {
        throw new Error(JSON.stringify({ field: 'general', message: `Lỗi khi lấy recruiter: ${err.message}` }));
    }
};

const updateRecruiter = async (user_id, company_id) => {
    try {
        const recruiterCheck = await pool.query('SELECT 1 FROM recruiter WHERE user_id = $1', [user_id]);
        if (!recruiterCheck.rows.length) {
            throw new Error(JSON.stringify({ field: 'general', message: 'Recruiter không tồn tại!' }));
        }
        // Kiểm tra company
        const companyCheck = await pool.query('SELECT 1 FROM company WHERE company_id = $1', [company_id]);
        if (!companyCheck.rows.length) {
            throw new Error(JSON.stringify({ field: 'company_id', message: 'Công ty không tồn tại!' }));
        }
        const result = await pool.query(
            'UPDATE recruiter SET company_id = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *',
            [company_id, user_id],
        );
        return result.rows[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = {
    createRecruiter,
    getRecruiterByUserId,
    updateRecruiter,
};
