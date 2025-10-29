require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const District = require('../model/District');
const Panchayath = require('../model/Panchayath');
const Ward = require('../model/Ward');

const DATA = [
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

async function seed() {
  try {
    await connectDB();
    console.log('Seeding locations...');

    await Ward.deleteMany({});
    await Panchayath.deleteMany({});
    await District.deleteMany({});

    for (const d of DATA) {
      const distDoc = await District.create({ name: d.name });
      for (const p of d.panchayaths) {
        const panDoc = await Panchayath.create({ name: p.name, district: distDoc._id });
        const wardDocs = p.wards.map((num) => ({ number: String(num), panchayath: panDoc._id }));
        await Ward.insertMany(wardDocs);
      }
    }

    console.log('Seeding completed.');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();


