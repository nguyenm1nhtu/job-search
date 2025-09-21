const { successResponse, errorResponse } = require('../utils/response');
const { addFavouriteJob, getFavouriteJobs, removeFavouriteJob } = require('../models/favouriteJob');
const { getCandidateByUserId } = require('../models/candidate');

const addFavouriteJobController = async (req, res) => {
    try {
        const { job_id } = req.body;
        const user_id = req.user.user_id;
        const candidate = await getCandidateByUserId(user_id);
        if (!candidate) throw new Error('Candidate không tồn tại!');
        const favourite = await addFavouriteJob(candidate.candidate_id, job_id);
        return successResponse(res, 201, 'Thêm job yêu thích thành công!', { favourite });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi thêm job yêu thích', { error: err.message });
    }
};

const getFavouriteJobsController = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const candidate = await getCandidateByUserId(user_id);
        if (!candidate) throw new Error('Candidate không tồn tại!');
        const favouriteJobs = await getFavouriteJobs(candidate.candidate_id);
        return successResponse(res, 200, 'Lấy danh sách job yêu thích thành công!', { favouriteJobs });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi lấy danh sách job yêu thích', { error: err.message });
    }
};

const removeFavouriteJobController = async (req, res) => {
    try {
        const { job_id } = req.params;
        const user_id = req.user.user_id;
        const candidate = await getCandidateByUserId(user_id);
        if (!candidate) throw new Error('Candidate không tồn tại!');
        const favourite = await removeFavouriteJob(candidate.candidate_id, job_id);
        return successResponse(res, 200, 'Xóa job yêu thích thành công!', { favourite });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi xóa job yêu thích', { error: err.message });
    }
};

module.exports = { addFavouriteJobController, getFavouriteJobsController, removeFavouriteJobController };
