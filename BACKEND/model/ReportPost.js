const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    category: {
      type: String,
      enum: ["Education", "Roads", "Agriculture", "Waste", "Electricity", "Water"],
      required: true,
    },
    media: [String],
    location: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Inprogress", "Solved"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDetails",
      required: true,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "ReportComments" }],

    // Likes / Dislikes / Upvotes
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserDetails" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserDetails" }],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserDetails" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reports", ReportSchema);
