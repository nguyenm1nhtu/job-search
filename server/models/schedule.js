const pool = require('../config/db');

const createSchedule = async (application_id, recruiter_id, candidate_id, interview_time, location_id, notes) => {
    try {
        const applicationCheck = await pool.query(
            'SELECT candidate_id, job_id FROM application WHERE application_id = $1 AND status = $2',
            [application_id, 'submitted'],
        );
        if (!applicationCheck.rows.length)
            throw new Error('Đơn ứng tuyển không tồn tại hoặc không ở trạng thái submitted!');

        if (applicationCheck.rows[0].candidate_id !== candidate_id)
            throw new Error('Candidate không khớp với đơn ứng tuyển!');

        if (location_id) {
            const locationCheck = await pool.query('SELECT 1 FROM location WHERE location_id = $1', [location_id]);
            if (!locationCheck.rows.length) throw new Error('Địa điểm không tồn tại!');
        }
        const result = await pool.query(
            'INSERT INTO schedule (application_id, recruiter_id, candidate_id, interview_time, location_id, notes, created_at, updated_at) ' +
                'VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
            [application_id, recruiter_id, candidate_id, interview_time, location_id || null, notes || null],
        );
        return result.rows[0];
    } catch (err) {
        throw new Error(`Lỗi khi tạo lịch phỏng vấn: ${err.message}`);
    }
};

const getScheduleById = async (schedule_id) => {
    try {
        const result = await pool.query(
            'SELECT s.*, a.job_id, j.title AS job_title, c.company_name, c.logo_path, l.address, p.name AS province_name, w.name AS ward_name ' +
                'FROM schedule s ' +
                'JOIN application a ON s.application_id = a.application_id ' +
                'JOIN job j ON a.job_id = j.job_id ' +
                'JOIN company c ON j.company_id = c.company_id ' +
                'LEFT JOIN location l ON s.location_id = l.location_id ' +
                'LEFT JOIN provinces p ON l.province_code = p.code ' +
                'LEFT JOIN wards w ON l.ward_code = w.code ' +
                'WHERE s.schedule_id = $1',
            [schedule_id],
        );
        return result.rows[0] || null;
    } catch (err) {
        throw new Error(`Lỗi khi lấy lịch phỏng vấn: ${err.message}`);
    }
};

const getSchedules = async () => {
    try {
        const result = await pool.query(
            'SELECT s.*, a.job_id, j.title AS job_title, c.company_name, c.logo_path, l.address, p.name AS province_name, w.name AS ward_name ' +
                'FROM schedule s ' +
                'JOIN application a ON s.application_id = a.application_id ' +
                'JOIN job j ON a.job_id = j.job_id ' +
                'JOIN company c ON j.company_id = c.company_id ' +
                'LEFT JOIN location l ON s.location_id = l.location_id ' +
                'LEFT JOIN provinces p ON l.province_code = p.code ' +
                'LEFT JOIN wards w ON l.ward_code = w.code ' +
                'ORDER BY s.interview_time DESC',
        );
        return result.rows;
    } catch (err) {
        throw new Error(`Lỗi khi lấy danh sách lịch phỏng vấn: ${err.message}`);
    }
};

const updateSchedule = async (schedule_id, interview_time, location_id, notes) => {
    try {
        const result = await pool.query(
            'UPDATE schedule SET interview_time = $1, location_id = $2, notes = $3, updated_at = NOW() WHERE schedule_id = $4 RETURNING *',
            [interview_time, location_id || null, notes || null, schedule_id],
        );

        if (!result.rows.length) throw new Error('Lịch phỏng vấn không tồn tại!');
        return result.rows[0];
    } catch (err) {
        throw new Error(`Lỗi khi cập nhật lịch phỏng vấn: ${err.message}`);
    }
};

const deleteSchedule = async (schedule_id) => {
    try {
        const result = await pool.query('DELETE FROM schedule WHERE schedule_id = $1 RETURNING *', [schedule_id]);
        if (!result.rows.length) throw new Error('Lịch phỏng vấn không tồn tại!');
        return result.rows[0];
    } catch (err) {
        throw new Error(`Lỗi khi xóa lịch phỏng vấn: ${err.message}`);
    }
};

module.exports = { createSchedule, getScheduleById, getSchedules, updateSchedule, deleteSchedule };
