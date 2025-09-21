const pool = require('../config/db');

const newCompany = async ({ company_name, logo_path, company_description, website, location_id }) => {
    try {
        // Kiểm tra location_id
        const locationCheck = await pool.query('SELECT 1 FROM location WHERE location_id = $1', [location_id]);
        if (!locationCheck.rows.length) {
            throw new Error(JSON.stringify({ field: 'location_id', message: 'ID vị trí không tồn tại!' }));
        }
        const query = await pool.query(
            'INSERT INTO company (company_name, logo_path, company_description, website, location_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [company_name, logo_path, company_description || null, website, location_id],
        );
        return query.rows[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

const getCompany = async (companyId) => {
    try {
        const query = await pool.query(
            'SELECT company.*, location.province_code, location.ward_code, location.address, ' +
                'provinces.name AS province_name, wards.name AS ward_name ' +
                'FROM company ' +
                'LEFT JOIN location ON company.location_id = location.location_id ' +
                'LEFT JOIN provinces ON location.province_code = provinces.code ' +
                'LEFT JOIN wards ON location.ward_code = wards.code ' +
                'WHERE company.company_id = $1',
            [companyId],
        );
        return query.rows.length ? query.rows[0] : null;
    } catch (err) {
        throw new Error(JSON.stringify({ field: 'general', message: `Lỗi khi lấy công ty: ${err.message}` }));
    }
};

const getAllCompanies = async () => {
    try {
        const query = await pool.query(
            'SELECT company.*, location.province_code, location.ward_code, location.address, ' +
                'provinces.name AS province_name, wards.name AS ward_name ' +
                'FROM company ' +
                'LEFT JOIN location ON company.location_id = location.location_id ' +
                'LEFT JOIN provinces ON location.province_code = provinces.code ' +
                'LEFT JOIN wards ON location.ward_code = wards.code',
        );
        return query.rows;
    } catch (err) {
        throw new Error(JSON.stringify({ field: 'general', message: `Lỗi khi lấy danh sách công ty: ${err.message}` }));
    }
};

module.exports = { newCompany, getCompany, getAllCompanies };
