const pool = require('../config/db');

const createApplication = async (candidate_id, job_id, cv_id, email, name, phone) => {
    try {
        const candidateCheck = await pool.query('SELECT 1 FROM candidate WHERE candidate_id = $1', [candidate_id]);
        if (!candidateCheck.rows.length) throw new Error('Candidate không tồn tại!');

        const jobCheck = await pool.query('SELECT required_cv FROM job WHERE job_id = $1 AND status = $2', [
            job_id,
            'open',
        ]);
        if (!jobCheck.rows.length) throw new Error('Job không tồn tại hoặc đã đóng!');

        if (!cv_id) throw new Error('CV là bắt buộc!');
        const cvCheck = await pool.query('SELECT 1 FROM cv WHERE cv_id = $1 AND candidate_id = $2 AND status = $3', [
            cv_id,
            candidate_id,
            'active',
        ]);

        if (!cvCheck.rows.length) throw new Error('CV không hợp lệ hoặc không hoạt động!');

        const result = await pool.query(
            'INSERT INTO application (candidate_id, job_id, cv_id, email, name, phone, status, applied_at, updated_at) ' +
                'VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *',
            [candidate_id, job_id, cv_id, email, name, phone, 'submitted'],
        );

        return result.rows[0];
    } catch (err) {
        throw new Error(`Lỗi khi tạo đơn ứng tuyển: ${err.message}`);
    }
};

const getApplicationById = async (application_id) => {
    try {
        const result = await pool.query(
            'SELECT a.*, j.title AS job_title, c.company_name, c.logo_path, cat.name AS category_name ' +
                'FROM application a ' +
                'JOIN job j ON a.job_id = j.job_id ' +
                'JOIN company c ON j.company_id = c.company_id ' +
                'LEFT JOIN category cat ON j.category_id = cat.category_id ' +
                'WHERE a.application_id = $1',
            [application_id],
        );
        return result.rows[0] || null;
    } catch (err) {
        throw new Error(`Lỗi khi lấy đơn ứng tuyển: ${err.message}`);
    }
};

const getApplicationsFiltered = async ({ candidate_id, job_id, status, recruiter_id }) => {
    try {
        let query = `
            SELECT a.*, j.title AS job_title, c.company_name, c.logo_path, cat.name AS category_name
            FROM application a
            JOIN job j ON a.job_id = j.job_id
            JOIN company c ON j.company_id = c.company_id
            LEFT JOIN category cat ON j.category_id = cat.category_id
            WHERE 1=1
        `;
        const values = [];
        let paramIndex = 1;

        if (candidate_id) {
            query += ` AND a.candidate_id = $${paramIndex++}`;
            values.push(candidate_id);
        }
        if (job_id) {
            query += ` AND a.job_id = $${paramIndex++}`;
            values.push(job_id);
        }
        if (status) {
            query += ` AND a.status = $${paramIndex++}`;
            values.push(status);
        }
        if (recruiter_id) {
            query += ` AND j.recruiter_id = $${paramIndex++}`;
            values.push(recruiter_id);
        }

        query += ' ORDER BY a.applied_at DESC';

        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        throw new Error(`Lỗi khi lấy danh sách đơn ứng tuyển: ${err.message}`);
    }
};

const updateApplicationStatus = async (application_id, status) => {
    try {
        if (!['submitted', 'interview_scheduled', 'accepted', 'rejected'].includes(status)) {
            throw new Error('Trạng thái đơn ứng tuyển không hợp lệ!');
        }
        const result = await pool.query(
            'UPDATE application SET status = $1, updated_at = NOW() WHERE application_id = $2 RETURNING *',
            [status, application_id],
        );
        if (!result.rows.length) throw new Error('Đơn ứng tuyển không tồn tại!');
        return result.rows[0];
    } catch (err) {
        throw new Error(`Lỗi khi cập nhật trạng thái đơn ứng tuyển: ${err.message}`);
    }
};

const deleteApplication = async (application_id) => {
    try {
        const result = await pool.query('DELETE FROM application WHERE application_id = $1 RETURNING *', [
            application_id,
        ]);
        if (!result.rows.length) throw new Error('Đơn ứng tuyển không tồn tại!');
        return result.rows[0];
    } catch (err) {
        throw new Error(`Lỗi khi xóa đơn ứng tuyển: ${err.message}`);
    }
};

module.exports = {
    createApplication,
    getApplicationById,
    getApplicationsFiltered,
    updateApplicationStatus,
    deleteApplication,
};
