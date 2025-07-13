const mongoose = require('mongoose');

const BlockedDateSchema = new mongoose.Schema({
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Validate that endDate is after startDate
BlockedDateSchema.path('endDate').validate(function(value) {
  return value > this.startDate;
}, 'End date must be after start date');

module.exports = mongoose.model('BlockedDate', BlockedDateSchema);