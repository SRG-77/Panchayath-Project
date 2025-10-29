const mongoose = require("mongoose");

const NoticeCommentSchema = new mongoose.Schema(
  {
    NoticeId: { type: mongoose.Schema.Types.ObjectId, ref: "Notices" },
    text: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserDetails" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserDetails" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", NoticeCommentSchema);
