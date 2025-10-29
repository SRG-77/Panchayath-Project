const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "MemberDetails" },
    media: [String],

    // 👍 Like / 👎 Dislike
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "MemberDetails" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "MemberDetails" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notices", NoticeSchema);
