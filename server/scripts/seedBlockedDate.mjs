import 'dotenv/config';
import mongoose from 'mongoose';
import BlockedDate from '../models/BlockedDate.js';

const uri = process.env.MONGODB_URI || process.env.URI || process.env.MONGODB_URL;
if (!uri) {
  console.error('No MongoDB URI found in env');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || undefined });
    console.log('Connected to DB');

    // seed a blocked date 3 days from today
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(0,0,0,0);

    const exists = await BlockedDate.findOne({ date: d });
    if (exists) {
      console.log('Blocked date already exists:', d.toISOString().slice(0,10));
    } else {
      const b = await BlockedDate.create({ date: d, reason: 'Test seed' });
      console.log('Created blocked date:', b.date.toISOString().slice(0,10));
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
