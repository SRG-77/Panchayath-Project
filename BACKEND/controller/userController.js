const User = require("../model/userReg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const District = require('../model/District');
const Panchayath = require('../model/Panchayath');
const Ward = require('../model/Ward');
const Member = require('../model/memberReg');

// ✅ Register a new user
exports.createDetails = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, district, panchayath, wardNo } = req.body;

  // Check for required fields
  if (!name || !email || !password || !confirmPassword || !district || !panchayath || !wardNo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Check if email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user directly (no location validation)
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    district,
    panchayath,
    wardNo: Number(wardNo),
  });

  // Generate token
  const token = jwt.sign(
    { id: newUser._id, name: newUser.name, email: newUser.email },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  );

  res.status(201).json({ token, userId: newUser._id });
});


// ✅ Get all users (without passwords)
exports.getDetails = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

// ✅ Get user by ID
exports.getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login user
exports.loginDetails = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token, userId: user._id });
});

// Get options for user location fields based on memberReg data
exports.getAvailableUserLocations = asyncHandler(async (req, res) => {
  const { district, panchayath } = req.query;
  if (!district && !panchayath) {
    // Return all distinct districts
    const districts = await Member.distinct('district');
    return res.json({ districts });
  }
  if (district && !panchayath) {
    // Return distinct panchayaths for given district
    const panchayaths = await Member.find({ district }).distinct('panchayath');
    return res.json({ panchayaths });
  }
  if (district && panchayath) {
    // Return distinct wardNos for district+panchayath
    const wardNos = await Member.find({ district, panchayath }).distinct('wardNo');
    return res.json({ wardNos });
  }
  res.status(400).json({ message: 'Invalid query' });
});
