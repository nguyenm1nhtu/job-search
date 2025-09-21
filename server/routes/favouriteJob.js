const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const favouriteJobController = require('../controllers/favouriteJob.controller');
const role = require('../middlewares/role.middleware');

router.post('/', auth.authMiddleware, role.role(['candidate']), favouriteJobController.addFavouriteJobController);
router.get('/', auth.authMiddleware, role.role(['candidate']), favouriteJobController.getFavouriteJobsController);
router.delete(
    '/:job_id',
    auth.authMiddleware,
    role.role(['candidate']),
    favouriteJobController.removeFavouriteJobController,
);

module.exports = router;
