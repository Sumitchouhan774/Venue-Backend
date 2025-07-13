const Venue = require('../models/Venue');
const Booking = require('../models/Booking');
const BlockedDate = require('../models/BlockedDate');
const { checkVenueAvailability, calculateBookingPrice } = require('../services/venueService');

// Get all venues
exports.getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.find().populate('owner', 'name email');
    res.send(venues);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Create venue (owner only)
exports.createVenue = async (req, res) => {
  try {
    const venue = new Venue({
      ...req.body,
      owner: req.user._id
    });
    await venue.save();
    res.status(201).send(venue);
  } catch (err) {
    res.status(400).send(err);
  }
};


// Block dates for venue (owner only)
exports.blockDates = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    
    // First check if dates are available
    const { isAvailable, conflicts } = await checkVenueAvailability(
      req.params.id, 
      new Date(startDate), 
      new Date(endDate)
    );
    
    if (!isAvailable && conflicts.bookings.length > 0) {
      return res.status(400).send({ 
        error: 'Cannot block dates with existing bookings',
        conflicts 
      });
    }

    const blockedDate = new BlockedDate({
      venue: req.params.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      createdBy: req.user._id
    });

    await blockedDate.save();
    res.status(201).send(blockedDate);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Get venue bookings (owner only)
exports.getVenueBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ venue: req.params.id })
      .populate('user', 'name email')
      .sort({ startDate: 1 });
    res.send(bookings);
  } catch (err) {
    res.status(500).send(err);
  }
};