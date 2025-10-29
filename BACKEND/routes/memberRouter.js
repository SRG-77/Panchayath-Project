const express = require('express');
const router = express.Router();
const {
  registerMember,
  loginMember,
  getMembers,
  updateMember,
  deleteMember,
} = require('../controller/memberController');
const auth = require('../middleware/authentication'); // ✅ your middleware

// Public routes
router.post('/register', registerMember);
router.post('/login', loginMember);

// Protected routes
router.get('/', auth, getMembers);
router.put('/:id', auth, updateMember);
router.delete('/:id', auth, deleteMember);

module.exports = router;
