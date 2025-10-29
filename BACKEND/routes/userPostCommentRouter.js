const express = require('express');
const router = express.Router();
const userPostComment = require('../controller/reportCommentController');
const authtoken = require('../middleware/authentication');

// Comments
router.post('/', authtoken, userPostComment.createComment); // Add comment
router.get('/:issueId', userPostComment.getAllComments);    // Get all comments for a report
router.patch('/:commentId/like', authtoken, userPostComment.toggleLike); // Like/unlike comment
router.delete('/:commentId', authtoken, userPostComment.deleteComment);  // Delete comment

// Replies
router.post('/:commentId/reply', authtoken, userPostComment.addReply); // Add reply to a comment
router.patch('/:commentId/reply/:replyId/like', authtoken, userPostComment.toggleLikeReply); // Like/unlike reply

module.exports = router;
