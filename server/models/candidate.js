const pool = require('../config/db');

const createCandidate = async (user_id, phone, location_id) => {
    const result = await pool.query(
        'INSERT INTO candidate (user_id, phone, location_id, created_at, updated_at) ' +
            'VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
        [user_id, phone || null, location_id || null],
    );
    return result.rows[0];
};

const getCandidateByUserId = async (user_id) => {
    try {
        const result = await pool.query(
            'SELECT c.*, l.province_code, l.ward_code, l.address, u.*, p.name AS province_name, w.name AS ward_name ' +
                'FROM candidate c ' +
                'LEFT JOIN location l ON c.location_id = l.location_id ' +
                'LEFT JOIN users u ON c.user_id = u.user_id ' +
                'LEFT JOIN provinces p ON l.province_code = p.code ' +
                'LEFT JOIN wards w ON l.ward_code = w.code ' +
                'WHERE c.user_id = $1',
            [user_id],
        );
        return result.rows[0] || null;
    } catch (err) {
        throw new Error(`Lỗi khi lấy candidate: ${err.message}`);
    }
};

const updateCandidate = async (user_id, phone, address, province_code, ward_code) => {
    try {
        let location_id = null;
        if (province_code && ward_code) {
            // Kiểm tra location đã tồn tại chưa
            const existingLocation = await pool.query(
                'SELECT location_id FROM location WHERE province_code = $1 AND ward_code = $2',
                [province_code, ward_code],
            );

            if (existingLocation.rows.length > 0) {
                location_id = existingLocation.rows[0].location_id;
                // Update address trong location nếu có
                if (address) {
                    await pool.query('UPDATE location SET address = $1, updated_at = NOW() WHERE location_id = $2', [
                        address,
                        location_id,
                    ]);
                }
            } else {
                const newLocation = await pool.query(
                    'INSERT INTO location (province_code, ward_code, address, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING location_id',
                    [province_code, ward_code, address || null],
                );
                location_id = newLocation.rows[0].location_id;
            }
        }

        const result = await pool.query(
            'UPDATE candidate SET phone = $1, location_id = $2, updated_at = NOW() WHERE user_id = $3 RETURNING *',
            [phone || null, location_id, user_id],
        );

        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

module.exports = {
    createCandidate,
    getCandidateByUserId,
    updateCandidate,
};
