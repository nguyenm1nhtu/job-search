const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const scheduleController = require('../controllers/schedule.controller');

router.post('/', auth.authMiddleware, role.role(['recruiter']), scheduleController.scheduleInterview);

router.get('/', auth.authMiddleware, role.role(['candidate', 'recruiter']), scheduleController.getAllSchedules);

router.get('/:schedule_id', auth.authMiddleware, role.role(['candidate', 'recruiter']), scheduleController.getSchedule);

router.patch(
    '/:schedule_id',
    auth.authMiddleware,
    role.role(['recruiter']),
    scheduleController.updateScheduleController,
);

router.delete(
    '/:schedule_id',
    auth.authMiddleware,
    role.role(['recruiter']),
    scheduleController.deleteScheduleController,
);

module.exports = router;
