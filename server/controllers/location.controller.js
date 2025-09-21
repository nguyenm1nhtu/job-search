const { getProvinces, getWards, newLocation, getLocation } = require('../models/location');
const { successResponse, errorResponse } = require('../utils/response');

const getAllProvinces = async (req, res) => {
    try {
        const provinces = await getProvinces();
        return successResponse(res, 200, 'Lấy tỉnh thành thành công!', provinces);
    } catch (err) {
        let errors = {};
        try {
            const parsedError = JSON.parse(err.message);
            errors[parsedError.field] = parsedError.message;
        } catch (parseErr) {
            errors.general = err.message || 'Lỗi khi lấy danh sách tỉnh thành';
        }
        return errorResponse(res, 500, 'Lỗi khi lấy danh sách tỉnh thành', errors);
    }
};

const getWardsByProvince = async (req, res) => {
    try {
        const provinceCode = req.query.provinceCode;
        if (!provinceCode) {
            return errorResponse(res, 400, 'Mã tỉnh không được để trống!', {
                provinceCode: 'Mã tỉnh không được để trống!',
            });
        }
        const wards = await getWards(provinceCode);
        return successResponse(res, 200, 'Lấy phường thành công!', wards);
    } catch (err) {
        let errors = {};
        try {
            const parsedError = JSON.parse(err.message);
            errors[parsedError.field] = parsedError.message;
        } catch (parseErr) {
            errors.general = err.message || 'Lỗi khi lấy danh sách quận/huyện';
        }
        return errorResponse(res, 500, 'Lỗi khi lấy danh sách quận/huyện', errors);
    }
};

const getLocationById = async (req, res) => {
    try {
        const id = req.params.id;
        const location = await getLocation(id);
        if (!location) {
            return errorResponse(res, 404, 'Không tìm thấy địa điểm này!', { general: 'Địa điểm không tồn tại' });
        }
        return successResponse(res, 200, 'Địa điểm được tìm thấy', location);
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

const createLocation = async (req, res) => {
    try {
        const { province_code, ward_code, address } = req.body;
        if (!province_code || !ward_code || !address) {
            return errorResponse(res, 400, 'Dữ liệu đầu vào không hợp lệ!', {
                ...(province_code ? {} : { province_code: 'Tỉnh/thành phố không được để trống!' }),
                ...(ward_code ? {} : { ward_code: 'Quận/huyện không được để trống!' }),
                ...(address ? {} : { address: 'Địa chỉ chi tiết không được để trống!' }),
            });
        }
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
        const location = await newLocation({ province_code, ward_code, address });
        return successResponse(res, 201, 'Tạo địa điểm thành công!', location);
    } catch (err) {
        let errors = {};
        try {
            const parsedError = JSON.parse(err.message);
            errors[parsedError.field] = parsedError.message;
        } catch (parseErr) {
            errors.general = err.message || 'Lỗi khi tạo địa điểm';
        }
        return errorResponse(res, 400, 'Lỗi khi tạo địa điểm', errors);
    }
};

module.exports = {
    getAllProvinces,
    getWardsByProvince,
    getLocationById,
    createLocation,
};
