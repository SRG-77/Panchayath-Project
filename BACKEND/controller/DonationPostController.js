const Donation = require("../model/DonationPost");
const cloudinary = require("../config/cloudinary");

// ✅ Create a donation post
exports.createDonationPost = async (req, res) => {
  try {
    const member = req.user; // from authentication middleware
    if (!member) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const { title, description, goalAmount } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "donations",
    });

    const newDonation = new Donation({
      title,
      description,
      image: uploadResult.secure_url,
      goalAmount: goalAmount || 0,
      collectedAmount: 0,
    });

    await newDonation.save();

    res.status(201).json({
      message: "Donation post created successfully",
      donation: newDonation,
    });
  } catch (error) {
    console.error("Donation create error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all donation posts
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Edit / Update donation post
exports.updateDonationPost = async (req, res) => {
  try {
    const member = req.user;
    if (!member) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const { id } = req.params;
    const { title, description, goalAmount } = req.body;

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation post not found" });
    }

    // Optional: delete old image and upload new one if provided
    let imageUrl = donation.image;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "donations",
      });
      imageUrl = uploadResult.secure_url;
    }

    donation.title = title || donation.title;
    donation.description = description || donation.description;
    donation.goalAmount =
      goalAmount !== undefined ? goalAmount : donation.goalAmount;
    donation.image = imageUrl;

    await donation.save();

    res.status(200).json({
      message: "Donation post updated successfully",
      donation,
    });
  } catch (error) {
    console.error("Update donation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get a single donation post by ID
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: "Donation post not found" });
    }
    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Delete donation post
exports.deleteDonationPost = async (req, res) => {
  try {
    const member = req.user;
    if (!member) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const { id } = req.params;
    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({ message: "Donation post not found" });
    }

    // Optional: delete image from Cloudinary
    const imagePublicId = donation.image
      .split("/")
      .slice(-1)[0]
      .split(".")[0]; // extract public ID
    await cloudinary.uploader.destroy(`donations/${imagePublicId}`);

    await donation.deleteOne();

    res.status(200).json({ message: "Donation post deleted successfully" });
  } catch (error) {
    console.error("Delete donation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
