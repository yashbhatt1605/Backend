const User = require('../models/User');
const crypto = require('node:crypto');

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }).toString('hex');
  return `scrypt$${salt}$${hash}`;
};

exports.getUsers = async (req, res, next) => {
  try { res.json({ success: true, users: await User.find().select('-password').sort({ createdAt: -1 }) }); }
  catch (error) { next(error); }
};
exports.getUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.sub !== req.params.id) return res.status(403).json({ success: false, message: 'You can only view your own account.' });
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (error) { next(error); }
};
exports.updateUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.sub !== req.params.id) return res.status(403).json({ success: false, message: 'You can only update your own account.' });
    const updates = {};
    for (const key of ['name', 'phone', 'avatar']) if (req.body[key] !== undefined) updates[key] = req.body[key];
    if (req.body.password !== undefined) {
      if (typeof req.body.password !== 'string' || req.body.password.length < 8 || req.body.password.length > 128) return res.status(400).json({ success: false, message: 'Password must be 8–128 characters.' });
      updates.password = hashPassword(req.body.password);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (error) { next(error); }
};
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, message: 'User deleted.' });
  } catch (error) { next(error); }
};
