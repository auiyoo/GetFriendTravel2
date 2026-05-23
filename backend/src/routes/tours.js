const express = require('express');
const router = express.Router();
const { checkDB } = require('../config/db');
const { TourMock, TripMock } = require('../data/mockStore');
const { protect } = require('../middleware/auth');

let TourCompany, TripRequest;
try { TourCompany = require('../models/TourCompany'); } catch (_) {}
try { TripRequest  = require('../models/TripRequest'); } catch (_) {}

// ─── GET /api/tours ───────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    if (!checkDB()) {
      return res.json(TourMock.findAll(req.query));
    }
    const { destination, style } = req.query;
    const filter = { isActive: true };
    if (destination) filter.destinations = { $in: [new RegExp(destination, 'i')] };
    if (style)       filter.styles = { $in: [style] };
    const companies = await TourCompany.find(filter).sort({ rating: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/tours/:id ───────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    if (!checkDB()) {
      const company = TourMock.findById(req.params.id);
      if (!company) return res.status(404).json({ message: 'ไม่พบบริษัททัวร์' });
      return res.json(company);
    }
    const company = await TourCompany.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'ไม่พบบริษัททัวร์' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/tours/:id/request-private ─────────────────────────
router.post('/:id/request-private', protect, async (req, res) => {
  try {
    if (!checkDB()) {
      const company = TourMock.findById(req.params.id);
      if (!company) return res.status(404).json({ message: 'ไม่พบบริษัททัวร์' });

      const { tripId } = req.body;
      if (tripId) {
        const raw = TripMock.getRaw(tripId);
        if (raw && raw.creator === req.user._id) {
          raw.tourCompany  = company._id;
          raw.isPrivateTour = true;
        }
      }
      return res.json({
        message: 'ส่งคำขอ Private Tour เรียบร้อย',
        company: { name: company.name, phone: company.phone, email: company.email, lineId: company.lineId },
        nextStep: `ติดต่อ ${company.name} ผ่าน Tel: ${company.phone} หรือ Line: ${company.lineId}`,
      });
    }

    const company = await TourCompany.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'ไม่พบบริษัททัวร์' });

    const { tripId } = req.body;
    if (tripId) {
      const trip = await TripRequest.findById(tripId);
      if (trip && trip.creator.toString() === req.user._id.toString()) {
        trip.tourCompany  = company._id;
        trip.isPrivateTour = true;
        await trip.save();
      }
    }
    res.json({
      message: 'ส่งคำขอ Private Tour เรียบร้อย',
      company: { name: company.name, phone: company.phone, email: company.email, lineId: company.lineId },
      nextStep: `ติดต่อ ${company.name} ผ่าน Tel: ${company.phone} หรือ Line: ${company.lineId}`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
