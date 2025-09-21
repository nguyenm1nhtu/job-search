const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');

const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const applicationController = require('../controllers/application.controller');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/cvs/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /doc|docx|pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Chỉ hỗ trợ file doc, docx, pdf!'));
    },
});

router.post('/', auth.authMiddleware, role.role(['candidate']), upload.single('cv'), applicationController.applyJob);
router.get('/', auth.authMiddleware, role.role(['candidate', 'recruiter']), applicationController.getApplications);
router.get(
    '/:application_id',
    auth.authMiddleware,
    role.role(['candidate', 'recruiter']),
    applicationController.getApplication,
);
router.patch(
    '/:application_id/status',
    auth.authMiddleware,
    role.role(['recruiter']),
    applicationController.updateApplicationStatusController,
);
router.delete(
    '/:application_id',
    auth.authMiddleware,
    role.role(['candidate']),
    applicationController.deleteApplicationController,
);

module.exports = router;
