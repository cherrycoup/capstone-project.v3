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
    const docs = await BlockedDate.find().select('date reason -_id');
    docs.forEach(d => console.log(d.date.toISOString().slice(0,10), '-', d.reason || ''));
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
