const mongoose = require('mongoose');

const tourCompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameEn: { type: String },
  logo: { type: String, default: '' },
  description: { type: String },
  website: { type: String },
  phone: { type: String },
  email: { type: String },
  lineId: { type: String },

  // Coverage
  destinations: [{ type: String }],   // countries/provinces covered
  tripTypes: [{ type: String }],       // international, domestic
  styles: [{ type: String }],          // travel styles they specialize in

  // Group specs
  minGroupSize: { type: Number, default: 2 },
  maxGroupSize: { type: Number, default: 20 },

  // Pricing
  priceRange: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'THB' }
  },

  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },

  // Tags
  highlights: [{ type: String }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TourCompany', tourCompanySchema);
