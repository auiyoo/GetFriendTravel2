const express = require('express');
const router = express.Router();
const TripRequest = require('../models/TripRequest');
const Match = require('../models/Match');
const { protect } = require('../middleware/auth');
const { findCompatibleTrips } = require('../services/matchingService');

// POST /api/trips - Create trip request
router.post('/', protect, async (req, res) => {
  try {
    const trip = await TripRequest.create({ ...req.body, creator: req.user._id });
    await trip.populate('creator', 'name avatar age gender travelStyles phone facebook line');
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/trips - Get all open trips (Discover page)
router.get('/', protect, async (req, res) => {
  try {
    const { country, province, style, budgetMax, status = 'open' } = req.query;
    const filter = { status };

    if (country) filter['destination.country'] = new RegExp(country, 'i');
    if (province) filter['destination.province'] = new RegExp(province, 'i');
    if (style) filter.travelStyles = { $in: [style] };
    if (budgetMax) filter['budget.max'] = { $lte: parseInt(budgetMax) };

    const trips = await TripRequest.find(filter)
      .populate('creator', 'name avatar age gender travelStyles phone facebook line')
      .populate('currentMembers', 'name avatar age gender')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/trips/my - Get my trips
router.get('/my', protect, async (req, res) => {
  try {
    const trips = await TripRequest.find({ creator: req.user._id })
      .populate('currentMembers', 'name avatar age gender')
      .populate('tourCompany', 'name logo rating')
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/trips/:id - Get trip details
router.get('/:id', protect, async (req, res) => {
  try {
    const trip = await TripRequest.findById(req.params.id)
      .populate('creator', 'name avatar age gender bio travelStyles phone facebook line')
      .populate('currentMembers', 'name avatar age gender bio travelStyles')
      .populate('tourCompany');
    if (!trip) return res.status(404).json({ message: 'ไม่พบทริป' });
    trip.views += 1;
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/trips/:id/matches - Find compatible trips (matching algorithm)
router.get('/:id/matches', protect, async (req, res) => {
  try {
    const sourceTripRequest = await TripRequest.findById(req.params.id);
    if (!sourceTripRequest) return res.status(404).json({ message: 'ไม่พบทริป' });

    const allTrips = await TripRequest.find({ status: 'open', creator: { $ne: req.user._id } })
      .populate('creator', 'name avatar age gender travelStyles phone facebook line');

    const matches = findCompatibleTrips(sourceTripRequest, allTrips);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/trips/:id/join - Request to join a trip
router.post('/:id/join', protect, async (req, res) => {
  try {
    const trip = await TripRequest.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'ไม่พบทริป' });
    if (trip.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'ไม่สามารถขอเข้าร่วมทริปของตัวเองได้' });
    }
    if (trip.pendingRequests.includes(req.user._id) || trip.currentMembers.includes(req.user._id)) {
      return res.status(400).json({ message: 'คุณส่งคำขอแล้วหรือเป็นสมาชิกแล้ว' });
    }

    trip.pendingRequests.push(req.user._id);
    await trip.save();

    // Create match record
    await Match.create({
      tripRequest: trip._id,
      fromUser: req.user._id,
      toUser: trip.creator,
      message: req.body.message || ''
    });

    res.json({ message: 'ส่งคำขอเข้าร่วมเรียบร้อย' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/trips/:id/respond - Accept/Decline a join request
router.put('/:id/respond', protect, async (req, res) => {
  try {
    const { userId, action } = req.body; // action: 'accept' | 'decline'
    const trip = await TripRequest.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'ไม่พบทริป' });
    if (trip.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์จัดการทริปนี้' });
    }

    trip.pendingRequests = trip.pendingRequests.filter(id => id.toString() !== userId);

    if (action === 'accept') {
      if (!trip.currentMembers.includes(userId)) {
        trip.currentMembers.push(userId);
        if (trip.currentMembers.length >= trip.groupSize.min) {
          trip.status = 'forming';
        }
      }
      await Match.findOneAndUpdate(
        { tripRequest: trip._id, fromUser: userId },
        { status: 'accepted', respondedAt: new Date() }
      );
    } else {
      await Match.findOneAndUpdate(
        { tripRequest: trip._id, fromUser: userId },
        { status: 'declined', respondedAt: new Date() }
      );
    }

    await trip.save();
    res.json({ message: action === 'accept' ? 'ยืนยันรับสมาชิกแล้ว' : 'ปฏิเสธคำขอแล้ว', trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/trips/:id - Update trip
router.put('/:id', protect, async (req, res) => {
  try {
    const trip = await TripRequest.findById(req.params.id);
    if (!trip || trip.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์แก้ไขทริปนี้' });
    }
    Object.assign(trip, req.body);
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
