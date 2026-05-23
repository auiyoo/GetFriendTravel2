const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  age: { type: Number, min: 18, max: 80 },
  gender: { type: String, enum: ['male', 'female', 'other', ''] },
  bio: { type: String, maxlength: 500 },

  // Contact & Verification
  phone: {
    number: { type: String, default: '' },
    verified: { type: Boolean, default: false }
  },
  facebook: {
    url: { type: String, default: '' },
    verified: { type: Boolean, default: false }
  },
  line: {
    id: { type: String, default: '' },
    verified: { type: Boolean, default: false }
  },

  // Travel Preferences
  travelStyles: [{ type: String }],
  preferredBudget: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100000 }
  },

  // Stats
  tripsCompleted: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },

  // Settings
  isPublic: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return public profile (exclude password)
userSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
