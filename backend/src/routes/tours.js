const express = require('express');
const router = express.Router();
const TourCompany = require('../models/TourCompany');
const TripRequest = require('../models/TripRequest');
const { protect } = require('../middleware/auth');

// GET /api/tours - Get all tour companies
router.get('/', async (req, res) => {
  try {
    const { destination, style, minGroup, maxBudget } = req.query;
    const filter = { isActive: true };
    if (destination) filter.destinations = { $in: [new RegExp(destination, 'i')] };
    if (style) filter.styles = { $in: [style] };

    const companies = await TourCompany.find(filter).sort({ rating: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tours/:id - Get company details
router.get('/:id', async (req, res) => {
  try {
    const company = await TourCompany.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'ไม่พบบริษัททัวร์' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tours/:id/request-private - Request private tour
router.post('/:id/request-private', protect, async (req, res) => {
  try {
    const { tripId } = req.body;
    const company = await TourCompany.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'ไม่พบบริษัททัวร์' });

    if (tripId) {
      const trip = await TripRequest.findById(tripId);
      if (trip && trip.creator.toString() === req.user._id.toString()) {
        trip.tourCompany = company._id;
        trip.isPrivateTour = true;
        await trip.save();
      }
    }

    res.json({
      message: 'ส่งคำขอ Private Tour เรียบร้อย',
      company: { name: company.name, phone: company.phone, email: company.email, lineId: company.lineId },
      nextStep: `ติดต่อ ${company.name} ผ่าน Tel: ${company.phone} หรือ Line: ${company.lineId}`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
