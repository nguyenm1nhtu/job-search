const express = require('express');
const multer = require('multer');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const cvController = require('../controllers/cv.controller');
const role = require('../middlewares/role.middleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/cvs/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
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

router.post('/upload', auth.authMiddleware, role.role(['candidate']), upload.single('cv'), cvController.uploadCV);
router.get('/:cv_id', auth.authMiddleware, role.role(['candidate', 'recruiter', 'admin']), cvController.getCV);
router.get('/', auth.authMiddleware, role.role(['candidate']), cvController.getCandidateCVs);
router.patch('/:cv_id/status', auth.authMiddleware, role.role(['candidate']), cvController.updateCVStatusController);
router.delete('/:cv_id', auth.authMiddleware, role.role(['candidate']), cvController.deleteCVController);

module.exports = router;
