const mongoose = require('mongoose');

const tripRequestSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Destination Info
  tripType: { type: String, enum: ['international', 'domestic'], required: true },
  destination: {
    country: { type: String, required: true },
    countryCode: { type: String },
    province: { type: String },   // for Thailand domestic
    city: { type: String },
    flag: { type: String }
  },

  // Selected attractions from smart suggestions
  selectedAttractions: [{ type: String }],

  // Trip Details
  dateRange: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  duration: { type: Number }, // auto-calculated days

  budget: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'THB' },
    perPerson: { type: Boolean, default: true }
  },

  travelStyles: [{ type: String }],

  groupSize: {
    min: { type: Number, default: 2 },
    max: { type: Number, default: 10 }
  },

  description: { type: String, maxlength: 1000 },
  title: { type: String },

  // Members
  currentMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Status
  status: {
    type: String,
    enum: ['open', 'forming', 'confirmed', 'completed', 'cancelled'],
    default: 'open'
  },

  // Tour Company
  tourCompany: { type: mongoose.Schema.Types.ObjectId, ref: 'TourCompany' },
  isPrivateTour: { type: Boolean, default: false },

  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-calculate duration
tripRequestSchema.pre('save', function(next) {
  if (this.dateRange.start && this.dateRange.end) {
    const diff = this.dateRange.end - this.dateRange.start;
    this.duration = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TripRequest', tripRequestSchema);
