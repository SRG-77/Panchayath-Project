const express = require('express');
const router = express.Router();
const NoticeRoute = require('../controller/NoticePostController');
const authtoken = require('../middleware/authentication');
const upload = require('../middleware/multer');

// =============================
// Notice Routes
// =============================

// Create a new notice
router.post('/', authtoken, upload.array('media', 5), NoticeRoute.createNotice);

// Get all notices
router.get('/', NoticeRoute.getNotices);

// Get a single notice
router.get('/:id', authtoken, NoticeRoute.getNoticeById);

// Update a notice
router.put('/:id', authtoken, upload.array('media', 5), NoticeRoute.updateNotice);

// Delete a notice
router.delete('/:id', authtoken, NoticeRoute.deleteNotice);

// =============================
// Like / Dislike Routes
// =============================

// Like a notice
router.put('/:id/like', authtoken, NoticeRoute.likeNotice);

// Dislike a notice
router.put('/:id/dislike', authtoken, NoticeRoute.dislikeNotice);

module.exports = router;
