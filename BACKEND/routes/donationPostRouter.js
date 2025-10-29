const express = require("express");
const router = express.Router();

// Controllers & Middleware
const DonationPostController = require("../controller/DonationPostController");
const authtoken = require("../middleware/authentication"); // ✅ JWT auth middleware
const upload = require("../middleware/multer"); // ✅ Multer for image uploads

// 📤 CREATE donation post (only authenticated member can create)
router.post(
  "/create",
  authtoken, // Verify member token
  upload.single("image"), // Upload one image
  DonationPostController.createDonationPost
);

// 📥 GET all donation posts (public)
router.get("/", DonationPostController.getDonations);

// 📥 GET a single donation post by ID (for editing)
router.get("/:id", DonationPostController.getDonationById);


// ✏️ UPDATE donation post (only authenticated member)
router.put(
  "/:id",
  authtoken, // Verify member token
  upload.single("image"), // Optional image update
  DonationPostController.updateDonationPost
);

// ❌ DELETE donation post (only authenticated member)
router.delete(
  "/:id",
  authtoken, // Verify member token
  DonationPostController.deleteDonationPost
);

module.exports = router;
