const { successResponse, errorResponse } = require('../utils/response');
const {
    createApplication,
    getApplicationById,
    getApplicationsFiltered,
    updateApplicationStatus,
    deleteApplication,
} = require('../models/application');
const { getCandidateByUserId } = require('../models/candidate');
const { getUserByEmail } = require('../models/user');
const { createCV } = require('../models/cv');
const path = require('path');

const applyJob = async (req, res) => {
    try {
        const file = req.file;
        const { job_id, email, full_name, phone } = req.body;
        if (!file) throw new Error('Vui lòng upload file CV!');
        if (!email || !full_name || !phone) throw new Error('Email, tên và số điện thoại là bắt buộc!');

        const user = await getUserByEmail(email);
        const candidate = await getCandidateByUserId(user.user_id);

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) throw new Error('Email không hợp lệ!');

        // Kiểm tra định dạng phone
        const phoneRegex = /^0[0-9]{9,10}$/;
        if (!phoneRegex.test(phone)) throw new Error('Số điện thoại phải là 10-11 chữ số và bắt đầu bằng 0!');

        // Kiểm tra file type
        const file_type = path.extname(file.originalname).slice(1).toLowerCase();
        if (!['doc', 'docx', 'pdf'].includes(file_type))
            throw new Error('Định dạng file CV phải là doc, docx hoặc pdf!');

        const filePath = path.join('uploads', 'cvs', file.filename);

        console.log({ candidate, filePath, file_type });

        const cv = await createCV(candidate.candidate_id, filePath, file.originalname, file_type);

        const application = await createApplication(candidate.candidate_id, job_id, cv.cv_id, email, full_name, phone);

        return successResponse(res, 201, 'Ứng tuyển thành công!', { application });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi ứng tuyển', { error: err.message });
    }
};

const getApplication = async (req, res) => {
    try {
        const { application_id } = req.params;
        const application = await getApplicationById(application_id);
        if (!application) throw new Error('Đơn ứng tuyển không tồn tại!');
        const user_id = req.user.user_id;
        const candidate = await getCandidateByUserId(user_id);
        const recruiter = await getRecruiterByUserId(user_id);
        const job = await pool.query('SELECT recruiter_id FROM job WHERE job_id = $1', [application.job_id]);
        if (
            application.candidate_id !== candidate?.candidate_id &&
            job.rows[0]?.recruiter_id !== recruiter?.recruiter_id &&
            req.user.role !== 'admin'
        ) {
            throw new Error('Bạn không có quyền xem đơn ứng tuyển này!');
        }
        return successResponse(res, 200, 'Lấy đơn ứng tuyển thành công!', { application });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi lấy đơn ứng tuyển', { error: err.message });
    }
};

const getApplications = async (req, res) => {
    try {
        const { job_id, status } = req.query;
        const user_id = req.user.user_id;
        let candidate_id, recruiter_id;

        if (req.user.role === 'candidate') {
            const candidate = await getCandidateByUserId(user_id);
            if (!candidate) throw new Error('Candidate không tồn tại!');
            candidate_id = candidate.candidate_id;
        } else if (req.user.role === 'recruiter') {
            const recruiter = await getRecruiterByUserId(user_id);
            if (!recruiter) throw new Error('Recruiter không tồn tại!');
            recruiter_id = recruiter.recruiter_id;
            if (job_id) {
                const jobCheck = await pool.query('SELECT 1 FROM job WHERE job_id = $1 AND recruiter_id = $2', [
                    job_id,
                    recruiter.recruiter_id,
                ]);
                if (!jobCheck.rows.length) throw new Error('Bạn không có quyền xem đơn ứng tuyển cho job này!');
            }
        }

        const applications = await getApplicationsFiltered({ candidate_id, job_id, status, recruiter_id });
        return successResponse(res, 200, 'Lấy danh sách đơn ứng tuyển thành công!', { applications });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi lấy danh sách đơn ứng tuyển', { error: err.message });
    }
};

const updateApplicationStatusController = async (req, res) => {
    try {
        const { application_id } = req.params;
        const { status } = req.body;
        const application = await getApplicationById(application_id);
        if (!application) throw new Error('Đơn ứng tuyển không tồn tại!');
        const user_id = req.user.user_id;
        const recruiter = await getRecruiterByUserId(user_id);
        const job = await pool.query('SELECT recruiter_id FROM job WHERE job_id = $1', [application.job_id]);
        if (job.rows[0]?.recruiter_id !== recruiter?.recruiter_id && req.user.role !== 'admin') {
            throw new Error('Bạn không có quyền cập nhật đơn ứng tuyển này!');
        }
        const updatedApplication = await updateApplicationStatus(application_id, status);
        return successResponse(res, 200, 'Cập nhật trạng thái đơn ứng tuyển thành công!', {
            application: updatedApplication,
        });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi cập nhật trạng thái đơn ứng tuyển', { error: err.message });
    }
};

const deleteApplicationController = async (req, res) => {
    try {
        const { application_id } = req.params;
        const application = await getApplicationById(application_id);
        if (!application) throw new Error('Đơn ứng tuyển không tồn tại!');
        const user_id = req.user.user_id;
        const candidate = await getCandidateByUserId(user_id);
        if (application.candidate_id !== candidate?.candidate_id && req.user.role !== 'admin') {
            throw new Error('Bạn không có quyền xóa đơn ứng tuyển này!');
        }
        const deletedApplication = await deleteApplication(application_id);
        return successResponse(res, 200, 'Xóa đơn ứng tuyển thành công!', { application: deletedApplication });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi xóa đơn ứng tuyển', { error: err.message });
    }
};

module.exports = {
    applyJob,
    getApplication,
    getApplications,
    updateApplicationStatusController,
    deleteApplicationController,
};
