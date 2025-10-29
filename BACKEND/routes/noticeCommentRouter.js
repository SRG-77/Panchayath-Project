const express = require('express')
const router = express.Router()
const noticeCommentController = require('../controller/noticeCommentController')
const authtoken = require('../middleware/authentication')

// Create a comment
router.post('/', authtoken, noticeCommentController.createComment)

// Get all comments for a notice
router.get('/:noticeId', noticeCommentController.getAllComments)

// Toggle like for a comment
router.patch('/:commentId/like', authtoken, noticeCommentController.togglelike)

// Delete a comment
router.delete('/:commentId', authtoken, noticeCommentController.deleteComment)

module.exports = router
