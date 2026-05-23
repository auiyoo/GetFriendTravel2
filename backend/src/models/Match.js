const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  tripRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'TripRequest', required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  message: { type: String, maxlength: 300 },
  createdAt: { type: Date, default: Date.now },
  respondedAt: { type: Date }
});

module.exports = mongoose.model('Match', matchSchema);
