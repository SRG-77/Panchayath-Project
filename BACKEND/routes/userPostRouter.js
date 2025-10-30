const express = require('express');
const router = express.Router();
const PostController = require('../controller/postController');
const upload = require('../middleware/multer');
const auth = require('../middleware/authentication');

// Reports CRUD
router.post('/', auth, upload.array('media', 5), PostController.createReport);
router.get('/', PostController.getReports);
router.get('/:id', PostController.getReportById);
router.put('/:id', auth, PostController.updateReport);
router.patch('/:id/status', auth, PostController.changeStatus);
router.delete('/:id', auth, PostController.deleteReport);
router.get("/user/:id", auth, PostController.getReportsByUser);

// Likes / Dislikes
router.patch('/:id/like', auth, PostController.likeReport);
router.patch('/:id/dislike', auth, PostController.dislikeReport);
router.patch("/:id/upvote", auth, PostController.upvoteReport);
router.get('/locations', PostController.getAvailableReportLocations);
module.exports = router;
