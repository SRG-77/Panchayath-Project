const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserDetails" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserDetails" }],
  },
  { timestamps: true }
);

const ReportCommentSchema = new mongoose.Schema(
  {
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: "Reports", required: true },
    text: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserDetails", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserDetails" }],
    replies: [ReplySchema], // Nested replies
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReportComments", ReportCommentSchema);
