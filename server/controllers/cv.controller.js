const { successResponse, errorResponse } = require('../utils/response');
const { createCV, getCVById, getCVsByCandidate, updateCVStatus, deleteCV } = require('../models/cv');
const { getCandidateByUserId } = require('../models/candidate');
const path = require('path');

const uploadCV = async (req, res) => {
    try {
        const file = req.file;
        if (!file) throw new Error('Vui lòng upload file CV!');

        const user_id = req.user.user_id;

        const candidate = await getCandidateByUserId(user_id);
        if (!candidate) throw new Error('Candidate không tồn tại!');

        const file_name = file.originalname;
        const file_type = path.extname(file_name).slice(1).toLowerCase();
        if (!['doc', 'docx', 'pdf'].includes(file_type)) throw new Error('Định dạng file không hợp lệ!');

        const file_path = path.join('uploads', 'cvs', file.filename);

        const cv = await createCV(candidate.candidate_id, file_path, file_name, file_type);
        return successResponse(res, 201, 'Upload CV thành công!', { cv });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi upload CV', { error: err.message });
    }
};

const getCV = async (req, res) => {
    try {
        const cv_id = req.params.cv_id;

        const cv = await getCVById(cv_id);

        return successResponse(res, 200, 'Lấy CV thành công!', { cv });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi lấy CV', { error: err.message });
    }
};

const getCandidateCVs = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const candidate = await getCandidateByUserId(user_id);
        if (!candidate) throw new Error('Candidate không tồn tại!');
        const cvs = await getCVsByCandidate(candidate.candidate_id);
        return successResponse(res, 200, 'Lấy danh sách CV thành công!', { cvs });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi lấy danh sách CV', { error: err.message });
    }
};

const updateCVStatusController = async (req, res) => {
    try {
        const cv_id = req.params.cv_id;
        const status = req.body.status;

        const cv = await getCVById(cv_id);
        if (!cv) throw new Error('CV không tồn tại!');

        const user_id = req.user.user_id;
        const candidate = await getCandidateByUserId(user_id);
        if (cv.candidate_id !== candidate?.candidate_id) {
            throw new Error('Bạn không có quyền cập nhật CV này!');
        }

        const updatedCV = await updateCVStatus(cv_id, status);
        return successResponse(res, 200, 'Cập nhật trạng thái CV thành công!', { cv: updatedCV });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi cập nhật trạng thái CV', { error: err.message });
    }
};

const deleteCVController = async (req, res) => {
    try {
        const cv_id = req.params.cv_id;
        const user_id = req.user.user_id;

        const cv = await getCVById(cv_id);
        if (!cv) throw new Error('CV không tồn tại!');

        const candidate = await getCandidateByUserId(user_id);
        if (!candidate) {
            throw new Error('Không tìm thấy thông tin candidate!');
        }

        const deletedCV = await deleteCV(cv_id, candidate.candidate_id);

        return successResponse(res, 200, 'Xóa CV thành công!', { cv: deletedCV });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi xóa CV', { error: err.message });
    }
};

module.exports = { uploadCV, getCV, getCandidateCVs, updateCVStatusController, deleteCVController };
