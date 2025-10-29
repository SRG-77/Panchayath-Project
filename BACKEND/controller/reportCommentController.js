const ReportComment = require('../model/ReportComment');
const ReportPost = require('../model/ReportPost');
const asyncHandler = require('express-async-handler');

// =============================
// Create a new comment
// POST /api/comments
// Private
// =============================
exports.createComment = asyncHandler(async (req, res) => {
  const { text, issueId } = req.body;
  if (!text || !issueId) return res.status(400).json({ message: "Text and issueId are required" });

  const report = await ReportPost.findById(issueId);
  if (!report) return res.status(404).json({ message: "Report not found" });

  const comment = await ReportComment.create({
    text,
    issueId,
    createdBy: req.user.id,
  });

  report.comments.push(comment._id);
  await report.save();

  const populatedComment = await ReportComment.findById(comment._id)
    .populate('createdBy', 'name email');

  res.status(201).json({ message: 'Comment added successfully', comment: populatedComment });
});

// =============================
// Get all comments for a report
// GET /api/comments/:issueId
// Public
// =============================
exports.getAllComments = asyncHandler(async (req, res) => {
  const { issueId } = req.params;

  const comments = await ReportComment.find({ issueId })
    .populate('createdBy', 'name email')
    .populate('replies.createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json(comments);
});

// =============================
// Like/unlike a comment
// PATCH /api/comments/:commentId/like
// Private
// =============================
exports.toggleLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  const comment = await ReportComment.findById(commentId);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });

  if (comment.likes.includes(userId)) comment.likes.pull(userId);
  else comment.likes.push(userId);

  await comment.save();

  const updatedComment = await ReportComment.findById(commentId)
    .populate('createdBy', 'name email')
    .populate('replies.createdBy', 'name email');

  res.status(200).json({ message: 'Like status updated', updatedComment });
});

// =============================
// Add a reply to a comment
// POST /api/comments/:commentId/reply
// Private
// =============================
exports.addReply = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: 'Reply text is required' });

  const comment = await ReportComment.findById(commentId);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });

  const reply = {
    text,
    createdBy: req.user.id,
    likes: [],
  };

  comment.replies.push(reply);
  await comment.save();

  const updatedComment = await ReportComment.findById(commentId)
    .populate('createdBy', 'name email')
    .populate('replies.createdBy', 'name email');

  res.status(201).json({ message: 'Reply added', updatedComment });
});

// =============================
// Like/unlike a reply
// PATCH /api/comments/:commentId/reply/:replyId/like
// Private
// =============================
exports.toggleLikeReply = asyncHandler(async (req, res) => {
  const { commentId, replyId } = req.params;
  const userId = req.user.id;

  const comment = await ReportComment.findById(commentId);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });

  const reply = comment.replies.id(replyId);
  if (!reply) return res.status(404).json({ message: 'Reply not found' });

  if (reply.likes.includes(userId)) reply.likes.pull(userId);
  else reply.likes.push(userId);

  await comment.save();

  const updatedComment = await ReportComment.findById(commentId)
    .populate('createdBy', 'name email')
    .populate('replies.createdBy', 'name email');

  res.status(200).json({ message: 'Reply like status updated', updatedComment });
});

// =============================
// Delete a comment
// DELETE /api/comments/:commentId
// Private
// =============================
exports.deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await ReportComment.findById(commentId);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });

  if (comment.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
    return res.status(403).json({ message: "Not authorized to delete this comment" });
  }

  await comment.deleteOne();
  res.status(200).json({ message: 'Comment deleted successfully' });
});
