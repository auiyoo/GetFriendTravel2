const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { checkDB } = require('../config/db');
const { UserMock, toPublicUser } = require('../data/mockStore');
const { protect } = require('../middleware/auth');

let User;
try { User = require('../models/User'); } catch (_) {}

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'defaultsecret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

// ─── POST /api/auth/register ──────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });

    if (!checkDB()) {
      // ── Mock mode ──
      if (UserMock.findByEmail(email))
        return res.status(400).json({ message: 'อีเมลนี้ถูกใช้แล้ว' });
      const user = await UserMock.create({ name, email, password, age, gender });
      return res.status(201).json({ token: generateToken(user._id), user: toPublicUser(user) });
    }

    // ── DB mode ──
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'อีเมลนี้ถูกใช้แล้ว' });
    const user = await User.create({ name, email, password, age, gender });
    res.status(201).json({ token: generateToken(user._id), user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'กรุณากรอกอีเมลและรหัสผ่าน' });

    if (!checkDB()) {
      // ── Mock mode ──
      const user = UserMock.findByEmail(email);
      if (!user || !(await UserMock.checkPassword(user, password)))
        return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
      return res.json({ token: generateToken(user._id), user: toPublicUser(user) });
    }

    // ── DB mode ──
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    res.json({ token: generateToken(user._id), user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────
router.get('/me', protect, (req, res) => {
  const user = req.user;
  // req.user is already the right shape from protect middleware
  if (typeof user.toPublicJSON === 'function') {
    return res.json({ user: user.toPublicJSON() });
  }
  res.json({ user: toPublicUser(user) });
});

// ─── POST /api/auth/verify-contact ───────────────────────────────
router.post('/verify-contact', protect, async (req, res) => {
  try {
    const { type, value } = req.body;

    if (!checkDB()) {
      // ── Mock mode ──
      const updates = {};
      if (type === 'phone')    updates.phone = { number: value, verified: true };
      if (type === 'facebook') updates.facebook = { url: value, verified: true };
      if (type === 'line')     updates.line = { id: value, verified: true };
      const user = UserMock.update(req.user._id, updates);
      return res.json({ message: 'ยืนยันข้อมูลติดต่อสำเร็จ', user: toPublicUser(user) });
    }

    // ── DB mode ──
    const user = await User.findById(req.user._id);
    if (type === 'phone')    user.phone    = { number: value, verified: true };
    if (type === 'facebook') user.facebook = { url: value, verified: true };
    if (type === 'line')     user.line     = { id: value, verified: true };
    await user.save();
    res.json({ message: 'ยืนยันข้อมูลติดต่อสำเร็จ', user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

module.exports = router;
