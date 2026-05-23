const express = require('express');
const router = express.Router();
const { checkDB } = require('../config/db');
const { UserMock, toPublicUser } = require('../data/mockStore');
const { protect } = require('../middleware/auth');

let User;
try { User = require('../models/User'); } catch (_) {}

// ─── GET /api/users ────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    if (!checkDB()) {
      const users = UserMock.findAll(req.user._id).map(toPublicUser);
      return res.json(users);
    }
    const users = await User.find({ isPublic: true, isActive: true, _id: { $ne: req.user._id } })
      .select('-password -email -phone -facebook -line')
      .limit(50);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/users/:id ────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    if (!checkDB()) {
      const user = UserMock.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
      const { password, email, ...pub } = user;
      return res.json(pub);
    }
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUT /api/users/profile ────────────────────────────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, age, gender, bio, travelStyles, preferredBudget, avatar } = req.body;

    if (!checkDB()) {
      const updates = {};
      if (name)            updates.name            = name;
      if (age)             updates.age             = age;
      if (gender)          updates.gender          = gender;
      if (bio)             updates.bio             = bio;
      if (travelStyles)    updates.travelStyles    = travelStyles;
      if (preferredBudget) updates.preferredBudget = preferredBudget;
      if (avatar)          updates.avatar          = avatar;
      const user = UserMock.update(req.user._id, updates);
      return res.json({ user: toPublicUser(user) });
    }

    const user = await User.findById(req.user._id);
    if (name)            user.name            = name;
    if (age)             user.age             = age;
    if (gender)          user.gender          = gender;
    if (bio)             user.bio             = bio;
    if (travelStyles)    user.travelStyles    = travelStyles;
    if (preferredBudget) user.preferredBudget = preferredBudget;
    if (avatar)          user.avatar          = avatar;
    await user.save();
    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
