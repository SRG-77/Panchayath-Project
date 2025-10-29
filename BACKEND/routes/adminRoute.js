const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const auth = require('../middleware/authentication')

router.post('/register', adminController.registerAdmin)
router.post('/login', adminController.loginAdmin)
router.get('/profile', auth, adminController.getAdminProfile)

module.exports = router;
