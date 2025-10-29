const Reports = require("../model/ReportPost");
const ReportComments = require("../model/ReportComment");
const asyncHandler = require("express-async-handler");

// =============================
// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
// =============================
exports.createReport = asyncHandler(async (req, res) => {
  const { title, description, category, location } = req.body;
  if (!title || !description || !category || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const createdBy = req.user.id;

  let mediaUrls = [];
  if (req.files && req.files.length > 0) {
    mediaUrls = req.files.map((file) => file.path);
  }

  const report = await Reports.create({
    title,
    description,
    category,
    location,
    createdBy,
    media: mediaUrls,
  });

  const populatedReport = await Reports.findById(report._id)
    .populate("createdBy", "name email")
    .populate({
      path: "comments",
      populate: { path: "createdBy", select: "name email" },
    });

  res.status(201).json({
    message: "Report created successfully",
    report: populatedReport,
  });
});

// =============================
// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
// =============================
exports.getReports = asyncHandler(async (req, res) => {
  const reports = await Reports.find()
    .populate("createdBy", "name email")
    .populate({
      path: "comments",
      populate: { path: "createdBy", select: "name email" },
    });

  res.status(200).json(reports);
});

// =============================
// @desc    Get single report by ID
// @route   GET /api/reports/:id
// @access  Public
// =============================
exports.getReportById = asyncHandler(async (req, res) => {
  const report = await Reports.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate({
      path: "comments",
      populate: { path: "createdBy", select: "name email" },
    });

  if (!report) return res.status(404).json({ message: "Report not found" });

  res.status(200).json(report);
});

// =============================
// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
// =============================
exports.updateReport = asyncHandler(async (req, res) => {
  let updatedData = { ...req.body };

  if (req.files && req.files.length > 0) {
    updatedData.media = req.files.map((file) => file.path);
  }

  const report = await Reports.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!report) return res.status(404).json({ message: "Report not found" });

  const populatedReport = await Reports.findById(report._id)
    .populate("createdBy", "name email")
    .populate({
      path: "comments",
      populate: { path: "createdBy", select: "name email" },
    });

  res.status(200).json({ message: "Report updated successfully", report: populatedReport });
});

exports.getReportsByUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const reports = await Reports.find({ createdBy: userId })
    .populate("createdBy", "name email")
    .populate({
      path: "comments",
      populate: { path: "createdBy", select: "name email" },
    });

  res.status(200).json(reports);
});

// =============================
// @desc    Change report status
// @route   PATCH /api/reports/:id/status
// @access  Private
// =============================
// =============================
// @desc    Change report status
// @route   PATCH /api/reports/:id/status
// @access  Private
// =============================
exports.changeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Only allow valid status values
  const allowedStatuses = ["Pending", "Inprogress", "Solved"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const report = await Reports.findById(req.params.id);
  if (!report) return res.status(404).json({ message: "Report not found" });

  // Update status
  report.status = status;
  await report.save();

  const populatedReport = await Reports.findById(report._id)
    .populate("createdBy", "name email")
    .populate({
      path: "comments",
      populate: { path: "createdBy", select: "name email" },
    });

  res.status(200).json({ message: "Status updated successfully", report: populatedReport });
});


// =============================
// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
// =============================
exports.deleteReport = asyncHandler(async (req, res) => {
  const report = await Reports.findByIdAndDelete(req.params.id);

  if (!report) return res.status(404).json({ message: "Report not found" });

  res.status(200).json({ message: "Report deleted successfully" });
});

// =============================
// @desc    Like report
// @route   PATCH /api/reports/:id/like
// @access  Private
// =============================
exports.likeReport = asyncHandler(async (req, res) => {
  const post = await Reports.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Report not found' });

  const userId = req.user.id;

  if (post.likes.includes(userId)) post.likes.pull(userId);
  else {
    post.likes.push(userId);
    post.dislikes.pull(userId); // remove dislike if exists
  }

  await post.save();

  const updatedPost = await Reports.findById(post._id)
    .populate("createdBy", "name email")
    .populate({
      path: "comments",
      populate: { path: "createdBy", select: "name email" },
    });

  res.status(200).json({ message: 'Like updated', updatedPost });
});

// =============================
// @desc    Dislike report
// @route   PATCH /api/reports/:id/dislike
// @access  Private
// =============================
exports.dislikeReport = asyncHandler(async (req, res) => {
  const post = await Reports.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Report not found' });

  const userId = req.user.id;

  if (post.dislikes.includes(userId)) post.dislikes.pull(userId);
  else {
    post.dislikes.push(userId);
    post.likes.pull(userId); // remove like if exists
  }

  await post.save();

  const updatedPost = await Reports.findById(post._id)
    .populate("createdBy", "name email")
    .populate({
      path: "comments",
      populate: { path: "createdBy", select: "name email" },
    });

  res.status(200).json({ message: 'Dislike updated', updatedPost });
});
// =============================
// @desc    Upvote report
// @route   PATCH /api/reports/:id/upvote
// @access  Private
// =============================
exports.upvoteReport = asyncHandler(async (req, res) => {
  const post = await Reports.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Report not found" });

  const userId = req.user.id;

  // Toggle upvote logic
  if (post.upvotes.includes(userId)) {
    post.upvotes.pull(userId); // remove upvote
  } else {
    post.upvotes.push(userId); // add upvote
    post.likes.pull(userId); // optional: remove like if exists
    post.dislikes.pull(userId); // optional: remove dislike if exists
  }

  await post.save();

  const updatedPost = await Reports.findById(post._id)
    .populate("createdBy", "name email")
    .populate({
      path: "comments",
      populate: { path: "createdBy", select: "name email" },
    });

  res.status(200).json({ message: "Upvote updated", updatedPost });
});
