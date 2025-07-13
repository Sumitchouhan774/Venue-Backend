const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  capacity: { type: Number },
  location: { type: String },
  pricePerDay: { type: Number, required: true },
  amenities: { type: [String] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Venue', VenueSchema);