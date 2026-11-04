const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const HASH_BYTES = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, HASH_BYTES, SCRYPT_OPTIONS).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  if (typeof stored !== 'string') return false;
  const [scheme, salt, hash] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const actual = crypto.scryptSync(password, salt, HASH_BYTES, SCRYPT_OPTIONS);
  const expected = Buffer.from(hash, 'hex');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function signToken(account) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters');
  }
  return jwt.sign({ sub: account._id.toString(), role: account.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

function publicAccount(account) {
  return { id: account._id, name: account.name, email: account.email, role: account.role };
}

exports.register = async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = req.body.password;
    if (name.length < 2 || name.length > 80 || !/^\S+@\S+\.\S+$/.test(email) || typeof password !== 'string' || password.length < 8 || password.length > 128) {
      return res.status(400).json({ success: false, message: 'Enter a valid name/email and a password of 8–128 characters.' });
    }
    const exists = await User.exists({ email });
    if (exists || await Admin.exists({ email })) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });

    const user = await User.create({ name, email, password: hashPassword(password), phone: String(req.body.phone || '').trim() });
    return res.status(201).json({ success: true, message: 'Registration successful. You can now log in.', user: publicAccount(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = req.body.password;
    if (!email || typeof password !== 'string' || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });

    let account = await Admin.findOne({ email });
    if (account && verifyPassword(password, account.password)) {
      return res.json({ success: true, token: signToken(account), user: publicAccount(account) });
    }

    account = await User.findOne({ email });
    if (!account || !verifyPassword(password, account.password)) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return res.json({ success: true, token: signToken(account), user: publicAccount(account) });
  } catch (error) { next(error); }
};

exports.logout = (req, res) => res.json({ success: true, message: 'Logged out. Remove the token from client storage.' });

exports.getProfile = async (req, res, next) => {
  try {
    const Model = req.user.role === 'admin' ? Admin : User;
    const account = await Model.findById(req.user.sub).select('-password');
    if (!account) return res.status(404).json({ success: false, message: 'Account not found.' });
    res.json({ success: true, user: publicAccount(account) });
  } catch (error) { next(error); }
};
