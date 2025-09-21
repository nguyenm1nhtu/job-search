const pool = require('../config/db');

const addFavouriteJob = async (candidate_id, job_id) => {
    try {
        const candidateCheck = await pool.query('SELECT 1 FROM candidate WHERE candidate_id = $1', [candidate_id]);
        if (!candidateCheck.rows.length) throw new Error('Candidate không tồn tại!');

        const jobCheck = await pool.query('SELECT 1 FROM job WHERE job_id = $1 AND status = $2', [job_id, 'open']);
        if (!jobCheck.rows.length) throw new Error('Job không tồn tại hoặc đã đóng!');

        //Kiem tra da co job trong job yeu thich chua
        const existingCheck = await pool.query('SELECT 1 FROM favourite_job WHERE candidate_id = $1 AND job_id = $2', [
            candidate_id,
            job_id,
        ]);
        if (existingCheck.rows.length) throw new Error('Job đã có trong danh sách yêu thích!');

        const result = await pool.query(
            'INSERT INTO favourite_job (candidate_id, job_id, created_at) VALUES ($1, $2, NOW()) RETURNING *',
            [candidate_id, job_id],
        );
        return result.rows[0];
    } catch (err) {
        throw new Error(`Lỗi khi thêm job yêu thích: ${err.message}`);
    }
};

const getFavouriteJobs = async (candidate_id) => {
    try {
        const result = await pool.query(
            'SELECT fj.*, j.title AS job_title, c.company_name, c.logo_path, cat.name AS category_name ' +
                'FROM favourite_job fj ' +
                'JOIN job j ON fj.job_id = j.job_id ' +
                'JOIN company c ON j.company_id = c.company_id ' +
                'LEFT JOIN category cat ON j.category_id = cat.category_id ' +
                'WHERE fj.candidate_id = $1 ' +
                'ORDER BY fj.created_at DESC',
            [candidate_id],
        );
        return result.rows;
    } catch (err) {
        throw new Error(`Lỗi khi lấy danh sách job yêu thích: ${err.message}`);
    }
};

const removeFavouriteJob = async (candidate_id, job_id) => {
    try {
        const result = await pool.query(
            'DELETE FROM favourite_job WHERE candidate_id = $1 AND job_id = $2 RETURNING *',
            [candidate_id, job_id],
        );
        if (!result.rows.length) throw new Error('Job không có trong danh sách yêu thích!');
        return result.rows[0];
    } catch (err) {
        throw new Error(`Lỗi khi xóa job yêu thích: ${err.message}`);
    }
};

module.exports = { addFavouriteJob, getFavouriteJobs, removeFavouriteJob };
