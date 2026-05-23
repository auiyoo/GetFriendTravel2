const express = require('express');
const router = express.Router();
const { checkDB } = require('../config/db');
const { MatchMock } = require('../data/mockStore');
const { protect } = require('../middleware/auth');

let Match;
try { Match = require('../models/Match'); } catch (_) {}

// ─── GET /api/matches ─────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    if (!checkDB()) {
      return res.json(MatchMock.findByToUser(req.user._id));
    }
    const matches = await Match.find({ toUser: req.user._id })
      .populate('fromUser', 'name avatar age gender bio travelStyles phone facebook line')
      .populate('tripRequest', 'destination dateRange budget travelStyles status')
      .sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/matches/sent ────────────────────────────────────────
router.get('/sent', protect, async (req, res) => {
  try {
    if (!checkDB()) {
      return res.json(MatchMock.findByFromUser(req.user._id));
    }
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
