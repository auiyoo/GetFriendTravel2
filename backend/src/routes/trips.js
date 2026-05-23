const express = require('express');
const router = express.Router();
const { checkDB } = require('../config/db');
const { TripMock, MatchMock } = require('../data/mockStore');
const { protect } = require('../middleware/auth');
const { findCompatibleTrips } = require('../services/matchingService');

let TripRequest, Match;
try { TripRequest = require('../models/TripRequest'); } catch (_) {}
try { Match       = require('../models/Match');       } catch (_) {}

// ─── POST /api/trips ──────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    if (!checkDB()) {
      const trip = TripMock.create({ ...req.body, creator: req.user._id });
      return res.status(201).json(trip);
    }
    const trip = await TripRequest.create({ ...req.body, creator: req.user._id });
    await trip.populate('creator', 'name avatar age gender travelStyles phone facebook line');
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/trips ───────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const { country, province, style, budgetMax, status = 'open' } = req.query;

    if (!checkDB()) {
      const trips = TripMock.findAll({ status, country, province, style, budgetMax });
      return res.json(trips);
    }

    const filter = { status };
    if (country)    filter['destination.country']  = new RegExp(country, 'i');
    if (province)   filter['destination.province'] = new RegExp(province, 'i');
    if (style)      filter.travelStyles = { $in: [style] };
    if (budgetMax)  filter['budget.max'] = { $lte: parseInt(budgetMax) };

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

// ─── GET /api/trips/my ────────────────────────────────────────────
router.get('/my', protect, async (req, res) => {
  try {
    if (!checkDB()) {
      const trips = TripMock.findByCreator(req.user._id);
      return res.json(trips);
    }
    const trips = await TripRequest.find({ creator: req.user._id })
      .populate('currentMembers', 'name avatar age gender')
      .populate('tourCompany', 'name logo rating')
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/trips/:id ───────────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    if (!checkDB()) {
      const trip = TripMock.findById(req.params.id);
      if (!trip) return res.status(404).json({ message: 'ไม่พบทริป' });
      // increment views in raw store
      const raw = TripMock.getRaw(req.params.id);
      if (raw) raw.views = (raw.views || 0) + 1;
      return res.json(trip);
    }
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

// ─── GET /api/trips/:id/matches ───────────────────────────────────
router.get('/:id/matches', protect, async (req, res) => {
  try {
    if (!checkDB()) {
      const sourceTrip = TripMock.getRaw(req.params.id);
      if (!sourceTrip) return res.status(404).json({ message: 'ไม่พบทริป' });
      const allTrips = TripMock.findAll({ status: 'open' })
        .filter(t => (t.creator?._id || t.creator) !== req.user._id);
      const matches = findCompatibleTrips(sourceTrip, allTrips);
      return res.json(matches);
    }
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

// ─── POST /api/trips/:id/join ─────────────────────────────────────
router.post('/:id/join', protect, async (req, res) => {
  try {
    if (!checkDB()) {
      const trip = TripMock.getRaw(req.params.id);
      if (!trip) return res.status(404).json({ message: 'ไม่พบทริป' });
      if (trip.creator === req.user._id)
        return res.status(400).json({ message: 'ไม่สามารถขอเข้าร่วมทริปของตัวเองได้' });
      if (trip.pendingRequests.includes(req.user._id) || trip.currentMembers.includes(req.user._id))
        return res.status(400).json({ message: 'คุณส่งคำขอแล้วหรือเป็นสมาชิกแล้ว' });

      trip.pendingRequests.push(req.user._id);
      MatchMock.create({ tripRequest: trip._id, fromUser: req.user._id, toUser: trip.creator, message: req.body.message || '' });
      return res.json({ message: 'ส่งคำขอเข้าร่วมเรียบร้อย' });
    }

    const trip = await TripRequest.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'ไม่พบทริป' });
    if (trip.creator.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'ไม่สามารถขอเข้าร่วมทริปของตัวเองได้' });
    if (trip.pendingRequests.includes(req.user._id) || trip.currentMembers.includes(req.user._id))
      return res.status(400).json({ message: 'คุณส่งคำขอแล้วหรือเป็นสมาชิกแล้ว' });

    trip.pendingRequests.push(req.user._id);
    await trip.save();
    await Match.create({ tripRequest: trip._id, fromUser: req.user._id, toUser: trip.creator, message: req.body.message || '' });
    res.json({ message: 'ส่งคำขอเข้าร่วมเรียบร้อย' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUT /api/trips/:id/respond ───────────────────────────────────
router.put('/:id/respond', protect, async (req, res) => {
  try {
    const { userId, action } = req.body;

    if (!checkDB()) {
      const trip = TripMock.getRaw(req.params.id);
      if (!trip) return res.status(404).json({ message: 'ไม่พบทริป' });
      if (trip.creator !== req.user._id)
        return res.status(403).json({ message: 'ไม่มีสิทธิ์จัดการทริปนี้' });

      trip.pendingRequests = trip.pendingRequests.filter(id => id !== userId);
      if (action === 'accept' && !trip.currentMembers.includes(userId)) {
        trip.currentMembers.push(userId);
        if (trip.currentMembers.length >= trip.groupSize.min) trip.status = 'forming';
      }
      MatchMock.update(trip._id, userId, { status: action === 'accept' ? 'accepted' : 'declined', respondedAt: new Date() });
      return res.json({ message: action === 'accept' ? 'ยืนยันรับสมาชิกแล้ว' : 'ปฏิเสธคำขอแล้ว', trip: TripMock.findById(trip._id) });
    }

    const trip = await TripRequest.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'ไม่พบทริป' });
    if (trip.creator.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'ไม่มีสิทธิ์จัดการทริปนี้' });

    trip.pendingRequests = trip.pendingRequests.filter(id => id.toString() !== userId);
    if (action === 'accept') {
      if (!trip.currentMembers.includes(userId)) {
        trip.currentMembers.push(userId);
        if (trip.currentMembers.length >= trip.groupSize.min) trip.status = 'forming';
      }
      await Match.findOneAndUpdate({ tripRequest: trip._id, fromUser: userId }, { status: 'accepted', respondedAt: new Date() });
    } else {
      await Match.findOneAndUpdate({ tripRequest: trip._id, fromUser: userId }, { status: 'declined', respondedAt: new Date() });
    }
    await trip.save();
    res.json({ message: action === 'accept' ? 'ยืนยันรับสมาชิกแล้ว' : 'ปฏิเสธคำขอแล้ว', trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUT /api/trips/:id ───────────────────────────────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    if (!checkDB()) {
      const trip = TripMock.getRaw(req.params.id);
      if (!trip || trip.creator !== req.user._id)
        return res.status(403).json({ message: 'ไม่มีสิทธิ์แก้ไขทริปนี้' });
      const updated = TripMock.update(req.params.id, req.body);
      return res.json(updated);
    }
    const trip = await TripRequest.findById(req.params.id);
    if (!trip || trip.creator.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'ไม่มีสิทธิ์แก้ไขทริปนี้' });
    Object.assign(trip, req.body);
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
