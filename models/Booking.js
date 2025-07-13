const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Validate that endDate is after startDate
BookingSchema.path('endDate').validate(function(value) {
  return value > this.startDate;
}, 'End date must be after start date');

module.exports = mongoose.model('Booking', BookingSchema);