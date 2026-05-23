const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { protect } = require('../middleware/auth');

// GET /api/matches - Get my matches (incoming requests)
router.get('/', protect, async (req, res) => {
  try {
    const matches = await Match.find({ toUser: req.user._id })
      .populate('fromUser', 'name avatar age gender bio travelStyles phone facebook line')
      .populate('tripRequest', 'destination dateRange budget travelStyles status')
      .sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/matches/sent - Get my sent requests
router.get('/sent', protect, async (req, res) => {
  try {
    const matches = await Match.find({ fromUser: req.user._id })
      .populate('toUser', 'name avatar age gender')
      .populate('tripRequest', 'destination dateRange budget status')
      .sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
