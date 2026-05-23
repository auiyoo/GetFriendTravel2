const express = require('express');
const router = express.Router();
const destinations = require('../data/destinations');

// GET /api/destinations/international - All international
router.get('/international', (req, res) => {
  const list = destinations.international.map(d => ({
    country: d.country,
    countryEn: d.countryEn,
    code: d.code,
    flag: d.flag,
    continent: d.continent,
    currency: d.currency,
    bestSeason: d.bestSeason
  }));
  res.json(list);
});

// GET /api/destinations/domestic - All Thai provinces
router.get('/domestic', (req, res) => {
  const list = destinations.domestic.map(d => ({
    province: d.province,
    provinceEn: d.provinceEn,
    region: d.region,
    emoji: d.emoji
  }));
  res.json(list);
});

// GET /api/destinations/international/:code - Get country details with attractions
router.get('/international/:code', (req, res) => {
  const dest = destinations.international.find(
    d => d.code === req.params.code.toUpperCase() || d.country === req.params.code
  );
  if (!dest) return res.status(404).json({ message: 'ไม่พบข้อมูลประเทศ' });
  res.json(dest);
});

// GET /api/destinations/domestic/:province - Get province details with attractions
router.get('/domestic/:province', (req, res) => {
  const dest = destinations.domestic.find(
    d => d.province === decodeURIComponent(req.params.province) ||
         d.provinceEn.toLowerCase() === req.params.province.toLowerCase()
  );
  if (!dest) return res.status(404).json({ message: 'ไม่พบข้อมูลจังหวัด' });
  res.json(dest);
});

// GET /api/destinations/search?q=... - Search destinations
router.get('/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const intl = destinations.international.filter(
    d => d.country.includes(q) || d.countryEn.toLowerCase().includes(q)
  ).map(d => ({ type: 'international', label: d.country, flag: d.flag, code: d.code }));

  const dom = destinations.domestic.filter(
    d => d.province.includes(q) || d.provinceEn.toLowerCase().includes(q)
  ).map(d => ({ type: 'domestic', label: d.province, emoji: d.emoji, region: d.region }));

  res.json([...intl, ...dom]);
});

module.exports = router;
