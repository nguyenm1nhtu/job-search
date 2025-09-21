const pool = require('../config/db');

const getProvinces = async () => {
    const query = await pool.query('SELECT * FROM provinces');
    return query.rows;
};

const getWards = async (provinceCode) => {
    const query = await pool.query('SELECT code, name FROM wards WHERE province_code = $1 ORDER BY code', [
        provinceCode,
    ]);
    return query.rows;
};

const getLocation = async (locationId) => {
    const query = await pool.query(
        'SELECT location.*, provinces.name AS province_name, wards.name AS ward_name ' +
            'FROM location ' +
            'INNER JOIN provinces ON location.province_code = provinces.code ' +
            'INNER JOIN wards ON location.ward_code = wards.code ' +
            'AND location.province_code = wards.province_code ' +
            'WHERE location.location_id = $1',
        [locationId],
    );
    return query.rows.length ? formatLocation(query.rows[0]) : null;
};

const newLocation = async ({ province_code, ward_code, address }) => {
    const query = await pool.query(
        'INSERT INTO location (province_code, ward_code, address) VALUES ($1, $2, $3) RETURNING *',
        [province_code, ward_code, address],
    );
    return formatLocation(query.rows[0]);
};

const formatLocation = (row) => ({
    location_id: row.location_id,
    province_code: row.province_code,
    province_name: row.province_name || '',
    ward_code: row.ward_code,
    ward_name: row.ward_name || '',
    address: row.address || '',
    full_address: `${row.address || ''}, ${row.ward_name || ''}, ${row.province_name || ''}`
        .trim()
        .replace(/^,+|,+$/g, ''),
});

module.exports = { getProvinces, getWards, newLocation, getLocation };
