const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/users/:id - Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/profile - Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, age, gender, bio, travelStyles, preferredBudget, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (bio) user.bio = bio;
    if (travelStyles) user.travelStyles = travelStyles;
    if (preferredBudget) user.preferredBudget = preferredBudget;
    if (avatar) user.avatar = avatar;
    await user.save();
    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users - Browse users (public profiles)
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({ isPublic: true, isActive: true, _id: { $ne: req.user._id } })
      .select('-password -email -phone -facebook -line')
      .limit(50);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
