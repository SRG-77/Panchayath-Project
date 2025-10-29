const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')

router.post('/register', userController.createDetails)

router.post('/login', userController.loginDetails)

router.get('/', userController.getDetails)

router.get('/:id', userController.getUserById);

module.exports = router
