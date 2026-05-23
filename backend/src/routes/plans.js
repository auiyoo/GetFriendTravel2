const express = require('express');
const router = express.Router();
const TripRequest = require('../models/TripRequest');
const { protect } = require('../middleware/auth');
const { generateTripPlan } = require('../services/planGenerator');

// POST /api/plans/generate - Generate plan from trip request
router.post('/generate', protect, async (req, res) => {
  try {
    const { tripId } = req.body;
    const trip = await TripRequest.findById(tripId).populate('currentMembers', 'name');
    if (!trip) return res.status(404).json({ message: 'ไม่พบทริป' });

    const plan = generateTripPlan(trip);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/plans/preview - Preview plan from raw data (before saving trip)
router.post('/preview', protect, async (req, res) => {
  try {
    const plan = generateTripPlan(req.body);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
