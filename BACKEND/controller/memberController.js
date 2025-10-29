const Member = require('../model/memberReg');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =============================
// @desc    Register a new member
// @route   POST /api/members/register
// @access  Public
// =============================
exports.registerMember = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, phone, wardNo, startYear, endYear } = req.body;

  // Validate input
  if (!name || !email || !password || !confirmPassword || !phone || !wardNo || !startYear || !endYear) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Password match check
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if email already exists
  const existingMember = await Member.findOne({ email });
  if (existingMember) {
    return res.status(400).json({ message: 'Member already registered with this email' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create member
  const member = await Member.create({
    name,
    email,
    password: hashedPassword,
    phone,
    wardNo,
    startYear,
    endYear,
  });

  // Generate token
  const token = jwt.sign({ id: member._id }, process.env.JWT_KEY, { expiresIn: '7d' });

  res.status(201).json({
    message: 'Member registered successfully',
    member: {
      id: member._id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      wardNo: member.wardNo,
      startYear: member.startYear,
      endYear: member.endYear,
    },
    token,
  });
});

// =============================
// @desc    Login member
// @route   POST /api/members/login
// @access  Public
// =============================
exports.loginMember = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const member = await Member.findOne({ email });
  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  const isMatch = await bcrypt.compare(password, member.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: member._id }, process.env.JWT_KEY, { expiresIn: '7d' });

  res.status(200).json({
    message: 'Login successful',
    member: {
      id: member._id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      wardNo: member.wardNo,
      startYear: member.startYear,
      endYear: member.endYear,
    },
    token,
  });
});

// =============================
// @desc    Get all members
// @route   GET /api/members
// @access  Private
// =============================
exports.getMembers = asyncHandler(async (req, res) => {
  const members = await Member.find().sort({ createdAt: -1 });
  res.status(200).json(members);
});

// =============================
// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private
// =============================
exports.updateMember = asyncHandler(async (req, res) => {
  const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  res.status(200).json({ message: 'Member updated successfully', member });
});

// =============================
// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private
// =============================
exports.deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findByIdAndDelete(req.params.id);

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  res.status(200).json({ message: 'Member deleted successfully' });
});
