require('dotenv').config();
const crypto = require('node:crypto');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function main() {
  const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'CarXpress Admin';
  if (!email || !password || password.length < 8) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 8 characters) in .env first.');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing.');
  await mongoose.connect(process.env.MONGO_URI);
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }).toString('hex');
  const stored = `scrypt$${salt}$${hash}`;
  await Admin.findOneAndUpdate({ email }, { name, email, password: stored, role: 'admin' }, { upsert: true, new: true, runValidators: true });
  console.log(`Admin account prepared for ${email}.`);
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
