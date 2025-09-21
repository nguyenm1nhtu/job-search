const pool = require('../config/db');

const createCV = async (candidate_id, file_path, file_name, file_type) => {
    try {
        const result = await pool.query(
            'INSERT INTO cv (candidate_id, file_path, file_name, file_type, status, created_at, updated_at) ' +
                "VALUES ($1, $2, $3, $4, 'active', NOW(), NOW()) RETURNING *",
            [candidate_id, file_path, file_name, file_type],
        );
        return result.rows[0];
    } catch (err) {
        throw new Error(`Lỗi khi tạo CV: ${err.message}`);
    }
};

const getCVById = async (cv_id) => {
    try {
        const result = await pool.query('SELECT * FROM cv WHERE cv_id = $1', [cv_id]);
        return result.rows[0] || null;
    } catch (err) {
        throw new Error(`Lỗi khi lấy CV: ${err.message}`);
    }
};

const getCVsByCandidate = async (candidate_id) => {
    try {
        const result = await pool.query('SELECT * FROM cv WHERE candidate_id = $1 ORDER BY created_at DESC', [
            candidate_id,
        ]);
        return result.rows;
    } catch (err) {
        throw new Error(`Lỗi khi lấy danh sách CV: ${err.message}`);
    }
};

const updateCVStatus = async (cv_id, status) => {
    try {
        const result = await pool.query('UPDATE cv SET status = $1, updated_at = NOW() WHERE cv_id = $2 RETURNING *', [
            status,
            cv_id,
        ]);
        if (!result.rows.length) throw new Error('CV không tồn tại!');
        return result.rows[0];
    } catch (err) {
        throw new Error(`Lỗi khi cập nhật trạng thái CV: ${err.message}`);
    }
};

const deleteCV = async (cv_id, candidate_id) => {
    try {
        const result = await pool.query('DELETE FROM cv WHERE cv_id = $1 AND candidate_id = $2 RETURNING *', [
            cv_id,
            candidate_id,
        ]);
        if (!result.rows.length) throw new Error('CV không tồn tại!');
        return result.rows[0];
    } catch (err) {
        throw new Error(`Lỗi khi xóa CV: ${err.message}`);
    }
};

module.exports = { createCV, getCVById, getCVsByCandidate, updateCVStatus, deleteCV };
