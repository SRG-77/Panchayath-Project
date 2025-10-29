const Notices = require('../model/NoticePosts');
const asyncHandler = require('express-async-handler');

// =============================
// @desc    Create a new notice
// @route   POST /api/notice
// @access  Private
// =============================
exports.createNotice = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized, token missing or invalid" });
  }

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and Content are required" });
  }

  // Cloudinary returns full URLs in file.path
  let media = [];
  if (req.files && req.files.length > 0) {
    media = req.files.map((file) => file.path); 
  }

  const createdBy = req.user.id;
  const notice = await Notices.create({ title, content, media, createdBy });

  res.status(201).json({ message: "Notice created successfully", notice });
});


// =============================
// @desc    Get all notices
// @route   GET /api/notice
// @access  Public
// =============================
exports.getNotices = asyncHandler(async (req, res) => {
  const notices = await Notices.find().populate("createdBy", "name email");
  res.status(200).json(notices);
});


// =============================
// @desc    Get single notice by ID
// @route   GET /api/notice/:id
// @access  Private
// =============================
exports.getNoticeById = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized, token missing or invalid" });
  }

  const notice = await Notices.findById(req.params.id).populate("createdBy", "name email");
  if (!notice) return res.status(404).json({ message: "Notice not found" });

  res.status(200).json(notice);
});


// =============================
// @desc    Update a notice
// @route   PUT /api/notice/:id
// @access  Private
// =============================
exports.updateNotice = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized, token missing or invalid" });
  }

  const { title, content } = req.body;
  let updateData = { title, content };

  if (req.files && req.files.length > 0) {
    updateData.media = req.files.map((file) => file.path);
  }

  const notice = await Notices.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  if (!notice) return res.status(404).json({ message: "Notice not found" });

  res.status(200).json({ message: "Notice updated successfully", notice });
});


// =============================
// @desc    Delete a notice
// @route   DELETE /api/notice/:id
// @access  Private
// =============================
exports.deleteNotice = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const notice = await Notices.findByIdAndDelete(req.params.id);
  if (!notice) return res.status(404).json({ message: "Notice not found" });

  res.status(200).json({ message: "Notice deleted successfully" });
});


// =============================
// @desc    Like a notice
// @route   PUT /api/notice/:id/like
// @access  Private
// =============================
exports.likeNotice = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const notice = await Notices.findById(req.params.id);
  if (!notice) return res.status(404).json({ message: "Notice not found" });

  const userId = req.user.id;

  // Remove from dislikes if present
  notice.dislikes = notice.dislikes.filter(
    (id) => id.toString() !== userId.toString()
  );

  // Toggle like
  if (notice.likes.includes(userId)) {
    notice.likes = notice.likes.filter(
      (id) => id.toString() !== userId.toString()
    );
  } else {
    notice.likes.push(userId);
  }

  await notice.save();
  res.status(200).json({ message: "Like status updated", notice });
});


// =============================
// @desc    Dislike a notice
// @route   PUT /api/notice/:id/dislike
// @access  Private
// =============================
exports.dislikeNotice = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const notice = await Notices.findById(req.params.id);
  if (!notice) return res.status(404).json({ message: "Notice not found" });

  const userId = req.user.id;

  // Remove from likes if present
  notice.likes = notice.likes.filter(
    (id) => id.toString() !== userId.toString()
  );

  // Toggle dislike
  if (notice.dislikes.includes(userId)) {
    notice.dislikes = notice.dislikes.filter(
      (id) => id.toString() !== userId.toString()
    );
  } else {
    notice.dislikes.push(userId);
  }

  await notice.save();
  res.status(200).json({ message: "Dislike status updated", notice });
});
