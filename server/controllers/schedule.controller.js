const { successResponse, errorResponse } = require('../utils/response');
const { createSchedule, getScheduleById, getSchedules, updateSchedule, deleteSchedule } = require('../models/schedule');
const { getRecruiterByUserId } = require('../models/recruiter');
const { updateApplicationStatus } = require('../models/application');

const scheduleInterview = async (req, res) => {
    try {
        const { application_id, interview_time, location_id, notes } = req.body;

        const user_id = req.user.user_id;

        const recruiter = await getRecruiterByUserId(user_id);
        if (!recruiter) throw new Error('Recruiter không tồn tại!');
        const application = await pool.query('SELECT candidate_id, job_id FROM application WHERE application_id = $1', [
            application_id,
        ]);

        if (!application.rows.length) throw new Error('Đơn ứng tuyển không tồn tại!');

        const schedule = await createSchedule(
            application_id,
            recruiter.recruiter_id,
            application.rows[0].candidate_id,
            interview_time,
            location_id,
            notes,
        );

        // Cập nhật trạng thái application thành interview_scheduled
        await updateApplicationStatus(application_id, 'interview_scheduled');

        return successResponse(res, 201, 'Tạo lịch phỏng vấn thành công!', { schedule });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi tạo lịch phỏng vấn', { error: err.message });
    }
};

const getSchedule = async (req, res) => {
    try {
        const { schedule_id } = req.params;

        const schedule = await getScheduleById(schedule_id);
        if (!schedule) throw new Error('Lịch phỏng vấn không tồn tại!');

        return successResponse(res, 200, 'Lấy lịch phỏng vấn thành công!', { schedule });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi lấy lịch phỏng vấn', { error: err.message });
    }
};

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await getSchedules();
        return successResponse(res, 200, 'Lấy danh sách lịch phỏng vấn thành công!', { schedules });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi lấy danh sách lịch phỏng vấn', { error: err.message });
    }
};

const updateScheduleController = async (req, res) => {
    try {
        const schedule_id = req.params.schedule_id;
        const { interview_time, location_id, notes } = req.body;
        const schedule = await getScheduleById(schedule_id);
        if (!schedule) throw new Error('Lịch phỏng vấn không tồn tại!');

        const updatedSchedule = await updateSchedule(schedule_id, interview_time, location_id, notes);
        return successResponse(res, 200, 'Cập nhật lịch phỏng vấn thành công!', { schedule: updatedSchedule });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi cập nhật lịch phỏng vấn', { error: err.message });
    }
};

const deleteScheduleController = async (req, res) => {
    try {
        const schedule_id = req.params.schedule_id;
        const schedule = await getScheduleById(schedule_id);
        if (!schedule) throw new Error('Lịch phỏng vấn không tồn tại!');

        const deletedSchedule = await deleteSchedule(schedule_id);
        return successResponse(res, 200, 'Xóa lịch phỏng vấn thành công!', { schedule: deletedSchedule });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi xóa lịch phỏng vấn', { error: err.message });
    }
};

module.exports = {
    scheduleInterview,
    getSchedule,
    getAllSchedules,
    updateScheduleController,
    deleteScheduleController,
};
