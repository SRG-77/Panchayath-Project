const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, trim: true },
    panchayath: { type: mongoose.Schema.Types.ObjectId, ref: 'Panchayath', required: true },
  },
  { timestamps: true }
);

wardSchema.index({ number: 1, panchayath: 1 }, { unique: true });

module.exports = mongoose.model('Ward', wardSchema);


