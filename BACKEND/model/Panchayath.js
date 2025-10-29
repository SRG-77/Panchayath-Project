const mongoose = require('mongoose');

const panchayathSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    district: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
  },
  { timestamps: true }
);

panchayathSchema.index({ name: 1, district: 1 }, { unique: true });

module.exports = mongoose.model('Panchayath', panchayathSchema);


