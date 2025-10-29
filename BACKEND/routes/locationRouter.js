const express = require('express');
const router = express.Router();
const { getDistricts, getPanchayaths, getWards } = require('../controller/locationController');

router.get('/districts', getDistricts);
router.get('/panchayaths', getPanchayaths); // expects ?district=
router.get('/wards', getWards); // expects ?district=&panchayath=

module.exports = router;


