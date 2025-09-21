const { newCompany, getCompany, getAllCompanies } = require('../models/company');
const { newLocation } = require('../models/location');
const { successResponse, errorResponse } = require('../utils/response');
const pool = require('../config/db');

const createCompany = async (req, res) => {
    try {
        const { company_name, logo_path, company_description, website, province_code, ward_code, address } = req.body;
        if (!company_name || !province_code || !ward_code || !address) {
            return errorResponse(res, 400, 'Dữ liệu đầu vào không hợp lệ!', {
                ...(company_name ? {} : { company_name: 'Tên công ty không được để trống!' }),
                ...(province_code ? {} : { province_code: 'Tỉnh/thành phố không được để trống!' }),
                ...(ward_code ? {} : { ward_code: 'Quận/huyện không được để trống!' }),
                ...(address ? {} : { address: 'Địa chỉ chi tiết không được để trống!' }),
            });
        }

        // Kiểm tra province_code và ward_code
        const provinceCheck = await pool.query('SELECT 1 FROM provinces WHERE code = $1', [province_code]);
        if (!provinceCheck.rows.length) {
            return errorResponse(res, 400, 'Tỉnh/thành phố không tồn tại!', {
                province_code: 'Tỉnh/thành phố không tồn tại!',
            });
        }
        const wardCheck = await pool.query('SELECT 1 FROM wards WHERE code = $1 AND province_code = $2', [
            ward_code,
            province_code,
        ]);
        if (!wardCheck.rows.length) {
            return errorResponse(res, 400, 'Quận/huyện không tồn tại!', { ward_code: 'Quận/huyện không tồn tại!' });
        }

        // Tạo location
        const location = await newLocation({ province_code, ward_code, address });
        const location_id = location.location_id;

        const company = await newCompany({ company_name, logo_path, company_description, website, location_id });
        return successResponse(res, 201, 'Công ty đã được tạo thành công!', company);
    } catch (err) {
        let errors = {};
        try {
            const parsedError = JSON.parse(err.message);
            errors[parsedError.field] = parsedError.message;
        } catch (parseErr) {
            errors.general = err.message || 'Lỗi khi tạo công ty';
        }
        return errorResponse(res, 400, 'Lỗi khi tạo công ty', errors);
    }
};

const getCompanyById = async (req, res) => {
    try {
        const id = req.params.id;
        const company = await getCompany(id);
        if (!company) {
            return errorResponse(res, 404, 'Không tìm thấy công ty này!', { general: 'Công ty không tồn tại' });
        }
        return successResponse(res, 200, 'Công ty được tìm thấy', company);
    } catch (err) {
        let errors = {};
        try {
            const parsedError = JSON.parse(err.message);
            errors[parsedError.field] = parsedError.message;
        } catch (parseErr) {
            errors.general = err.message || 'Lỗi server';
        }
        return errorResponse(res, 500, 'Lỗi server', errors);
    }
};

const getCompanies = async (req, res) => {
    try {
        const companies = await getAllCompanies();
        return successResponse(res, 200, 'Danh sách công ty đã được lấy thành công!', companies);
    } catch (err) {
        let errors = {};
        try {
            const parsedError = JSON.parse(err.message);
            errors[parsedError.field] = parsedError.message;
        } catch (parseErr) {
            errors.general = err.message || 'Lỗi khi lấy danh sách công ty';
        }
        return errorResponse(res, 500, 'Lỗi khi lấy danh sách công ty', errors);
    }
};

module.exports = {
    createCompany,
    getCompanyById,
    getCompanies,
};
