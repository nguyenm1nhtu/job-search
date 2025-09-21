const express = require('express');
const router = express.Router();
const {
    getAllProvinces,
    getWardsByProvince,
    getLocationById,
    createLocation,
} = require('../controllers/location.controller');

router.get('/provinces', getAllProvinces);
router.get('/wards', getWardsByProvince);
router.get('/:id', getLocationById);
router.post('/', createLocation);

module.exports = router;
