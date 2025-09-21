const { successResponse, errorResponse } = require('../utils/response');
const {
    newJob,
    getJobById,
    updateJobStatus,
    getAllCategories,
    getJobsFiltered,
    getRelatedJobs,
    getJobsByCompany,
} = require('../models/job');
const { getRecruiterByUserId } = require('../models/recruiter');

const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            min_salary,
            max_salary,
            experience,
            status,
            required_cv,
            deadline,
            category_id,
            requirement,
            benefit,
            limited,
        } = req.body;
        const recruiter_id = req.user.user_id;

        const recruiter = await getRecruiterByUserId(recruiter_id);
        if (!recruiter) throw new Error('Recruiter không tồn tại!');

        // Tạo job
        const job = await newJob(
            recruiter_id,
            recruiter.company_id,
            title,
            description,
            min_salary,
            max_salary,
            experience,
            status,
            required_cv,
            deadline,
            category_id,
            requirement,
            benefit,
            limited,
        );

        return successResponse(res, 201, 'Đăng job thành công!', { job });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi đăng job', { error: err.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();
        return successResponse(res, 200, 'Lấy danh mục nghề thành công', categories);
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi lấy danh mục nghề', { error: err.message });
    }
};

const getJob = async (req, res) => {
    try {
        const job_id = req.params.job_id;
        const job = await getJobById(job_id);
        if (!job) throw new Error('Job không tồn tại!');
        return successResponse(res, 200, 'Lấy job thành công!', job);
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi lấy job', { error: err.message });
    }
};

const getJobs = async (req, res) => {
    try {
        const {
            query,
            min_salary,
            max_salary,
            experience,
            category_id,
            required_cv,
            province_code,
            ward_code,
            sort_by,
        } = req.query;

        //Chuyen chuoi thanh mang
        const experienceLevelArray = experience ? experience.split(',').filter(Boolean) : [];
        const categoryIdArray = category_id
            ? category_id
                  .split(',')
                  .map(Number)
                  .filter((id) => !isNaN(id))
            : [];

        const jobs = await getJobsFiltered({
            query,
            min_salary,
            max_salary,
            experience: experienceLevelArray,
            category_id: categoryIdArray,
            required_cv: required_cv ? required_cv === 'true' : undefined,
            province_code,
            ward_code,
            sort_by: sort_by || 'updated_at_desc',
        });
        return successResponse(res, 200, 'Lấy danh sách job thành công!', jobs);
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi lấy danh sách job', { error: err.message });
    }
};

const getRelated = async (req, res) => {
    try {
        const job_id = req.params.job_id;
        const jobs = await getRelatedJobs(job_id);
        if (!jobs || jobs.length === 0) {
            return successResponse(res, 200, 'Không tìm thấy công việc liên quan!', []);
        }
        return successResponse(res, 200, 'Lấy danh sách công việc liên quan thành công!', jobs);
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi lấy danh sách công việc liên quan', { error: err.message });
    }
};

const getJobsFromCompany = async (req, res) => {
    try {
        const company_id = req.params.company_id;
        const jobs = await getJobsByCompany(company_id);
        if (!jobs || jobs.length === 0) {
            return successResponse(res, 200, 'Công ty chưa đăng công việc nào!', []);
        }
        return successResponse(res, 200, 'Lấy danh sách công việc của công ty thành công!', jobs);
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi lấy danh sách công việc của công ty', { error: err.message });
    }
};

const updateJobStatusController = async (req, res) => {
    try {
        const job_id = req.params.job_id;
        const status = req.body.status;
        const recruiter_id = req.user.user_id;

        const job = await getJobById(job_id);
        if (!job) throw new Error('Job không tồn tại!');
        if (job.recruiter_id !== recruiter_id) throw new Error('Bạn không có quyền cập nhật job này!');

        const updatedJob = await updateJobStatus(job_id, status);
        return successResponse(res, 200, 'Cập nhật trạng thái job thành công!', { job: updatedJob });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi cập nhật trạng thái job', { error: err.message });
    }
};

module.exports = {
    createJob,
    getJob,
    getJobs,
    updateJobStatusController,
    getCategories,
    getRelated,
    getJobsFromCompany,
};
