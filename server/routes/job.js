const express = require('express');
const router = express.Router();

const jobController = require('../controllers/job.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.post('/', auth.authMiddleware, role.role(['recruiter']), jobController.createJob);
router.get('/categories', jobController.getCategories);
router.get('/', jobController.getJobs);
router.get('/:job_id', jobController.getJob);
router.get('/related/:job_id', jobController.getRelated);
router.get('/company/:company_id', jobController.getJobsFromCompany);
router.patch('/:job_id/status', auth.authMiddleware, role.role(['recruiter']), jobController.updateJobStatusController);

module.exports = router;
