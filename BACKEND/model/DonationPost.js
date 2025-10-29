const mongoose = require("mongoose")
const donationPostSchema = new mongoose.Schema({
     title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    goalAmount: {
      type: Number,
      default: 0, // optional if you want goal tracking
    },
    collectedAmount: {
      type: Number,
      default: 0, // to track how much donated so far
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DonationPosts", donationPostSchema);
