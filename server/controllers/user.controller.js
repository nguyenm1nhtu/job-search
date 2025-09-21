const { getCandidateByUserId, updateCandidate } = require('../models/candidate');
const { getUserById, updateUserProfile } = require('../models/user');
const { getCVsByCandidate } = require('../models/cv');
const { getFavouriteJobs } = require('../models/favouriteJob');
const { successResponse, errorResponse } = require('../utils/response');

const jwt = require('../utils/jwt');

const getCandidateProfile = async (req, res) => {
    const { user_id } = req.user;
    try {
        const candidate = await getCandidateByUserId(user_id);
        if (!candidate) {
            throw new Error('Candidate không tồn tại hoặc bạn không có quyền truy cập!');
        }

        const user = await getUserById(user_id);
        if (!user || user.role !== 'candidate') {
            throw new Error('Người dùng không phải candidate hoặc không tồn tại');
        }

        const cv = await getCVsByCandidate(candidate.candidate_id);
        const favorites = await getFavouriteJobs(candidate.candidate_id);

        return successResponse(res, 200, 'Lấy thông tin ứng viên thành công', {
            user,
            candidate,
            cv: cv.rows,
            favorites: favorites.rows,
        });
    } catch (err) {
        return errorResponse(res, 500, 'Lỗi khi lấy ứng viên', { error: err.message });
    }
};

const getUserByToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 401, 'Chưa đăng nhập!');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.decodeToken(token);
        const userId = decoded.user_id;

        const user = await getUserById(userId);

        return successResponse(res, 200, 'Lấy thông tin người dùng thành công', user);
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return errorResponse(res, 401, 'Token không hợp lệ hoặc đã hết hạn');
        }
        return errorResponse(res, 500, 'Lỗi server');
    }
};

const updatedCandidate = async (req, res) => {
    const user_id = req.user.user_id;
    const { full_name, email, phone, address, province_code, ward_code } = req.body;
    const avatar_path = req.file ? `/server/uploads/avatars/${req.file.filename}` : undefined;

    try {
        let updatedUser;
        if (full_name || email || avatar_path) {
            updatedUser = await updateUserProfile(user_id, full_name, email, avatar_path);
        } else {
            updatedUser = await getUserById(user_id);
        }

        let updatedCandidate;
        if (phone || address || province_code || ward_code) {
            updatedCandidate = await updateCandidate(user_id, phone, address, province_code, ward_code);
        }

        return successResponse(res, 200, 'Cập nhật ứng viên thành công', {
            user: updatedUser,
            candidate: updatedCandidate,
        });
    } catch (err) {
        return errorResponse(res, 400, 'Lỗi khi cập nhật ứng viên', { error: err.message });
    }
};

module.exports = { getCandidateProfile, updatedCandidate, getUserByToken };
