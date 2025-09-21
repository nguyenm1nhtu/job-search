const express = require('express');
const multer = require('multer');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const role = require('../middlewares/role.middleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file JPEG hoặc PNG!'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});

router.get('/me', auth.authMiddleware, userController.getUserByToken);

router.get('/profile/:candidate_id', auth.authMiddleware, role.role(['candidate']), userController.getCandidateProfile);
router.patch(
    '/profile/:user_id/patch',
    auth.authMiddleware,
    role.role(['candidate']),
    upload.single('avatar'),
    userController.updatedCandidate,
);

module.exports = router;
