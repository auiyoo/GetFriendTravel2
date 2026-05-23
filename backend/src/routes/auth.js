const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'defaultsecret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'อีเมลนี้ถูกใช้แล้ว' });

    const user = await User.create({ name, email, password, age, gender });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
    const token = generateToken(user._id);
    res.json({ token, user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

// POST /api/auth/verify-contact  (mock OTP verification)
router.post('/verify-contact', protect, async (req, res) => {
  try {
    const { type, value } = req.body; // type: phone | facebook | line
    const user = await User.findById(req.user._id);

    if (type === 'phone') {
      user.phone = { number: value, verified: true };
    } else if (type === 'facebook') {
      user.facebook = { url: value, verified: true };
    } else if (type === 'line') {
      user.line = { id: value, verified: true };
    }

    await user.save();
    res.json({ message: 'ยืนยันข้อมูลติดต่อสำเร็จ', user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

module.exports = router;
