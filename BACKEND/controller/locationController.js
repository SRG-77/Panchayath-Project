const asyncHandler = require('express-async-handler');
const District = require('../model/District');
const Panchayath = require('../model/Panchayath');
const Ward = require('../model/Ward');

// Default data to auto-bootstrap if DB is empty
const DEFAULT_DATA = [
  {
    name: 'Ernakulam',
    panchayaths: [
      { name: 'Aluva', wards: ['1', '2', '3', '4', '5'] },
      { name: 'Kalamassery', wards: ['1', '2', '3', '4'] },
      { name: 'Kothamangalam', wards: ['1', '2', '3'] },
    ],
  },
  {
    name: 'Thrissur',
    panchayaths: [
      { name: 'Kodungallur', wards: ['1', '2', '3', '4', '5'] },
      { name: 'Chalakudy', wards: ['1', '2', '3'] },
      { name: 'Irinjalakuda', wards: ['1', '2', '3', '4'] },
    ],
  },
];

async function ensureBootstrapped() {
  const count = await District.countDocuments();
  if (count > 0) return; // Already bootstrapped

  for (const d of DEFAULT_DATA) {
    const distDoc = await District.create({ name: d.name });
    for (const p of d.panchayaths) {
      const panDoc = await Panchayath.create({ name: p.name, district: distDoc._id });
      const wardDocs = p.wards.map((num) => ({ number: String(num), panchayath: panDoc._id }));
      await Ward.insertMany(wardDocs);
    }
  }
}

exports.getDistricts = asyncHandler(async (req, res) => {
  await ensureBootstrapped();
  const districts = await District.find({}, 'name').sort({ name: 1 });
  res.json(districts.map((d) => d.name));
});

exports.getPanchayaths = asyncHandler(async (req, res) => {
  await ensureBootstrapped();
  const { district } = req.query;
  if (!district) return res.status(400).json({ message: 'district is required' });

  const dist = await District.findOne({ name: district });
  if (!dist) return res.status(404).json({ message: 'district not found' });

  const panchayaths = await Panchayath.find({ district: dist._id }, 'name').sort({ name: 1 });
  res.json(panchayaths.map((p) => p.name));
});

exports.getWards = asyncHandler(async (req, res) => {
  await ensureBootstrapped();
  const { district, panchayath } = req.query;
  if (!district || !panchayath) return res.status(400).json({ message: 'district and panchayath are required' });

  const dist = await District.findOne({ name: district });
  if (!dist) return res.status(404).json({ message: 'district not found' });

  const pan = await Panchayath.findOne({ name: panchayath, district: dist._id });
  if (!pan) return res.status(404).json({ message: 'panchayath not found' });

  const wards = await Ward.find({ panchayath: pan._id }, 'number').sort({ number: 1 });
  res.json(wards.map((w) => w.number));
});


