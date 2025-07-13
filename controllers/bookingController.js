const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const { checkVenueAvailability, calculateBookingPrice } = require('../services/venueService');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { venueId, startDate, endDate } = req.body;
    
    // Check availability
    const { isAvailable, conflicts } = await checkVenueAvailability(
      venueId, 
      new Date(startDate), 
      new Date(endDate)
    );
    
    if (!isAvailable) {
      return res.status(400).send({ 
        error: 'Venue not available for selected dates',
        conflicts 
      });
    }

    // Get venue to calculate price
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).send({ error: 'Venue not found' });
    }

    // Calculate price
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = days * venue.pricePerDay;

    // Create booking
    const booking = new Booking({
      venue: venueId,
      user: req.user._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice,
      status: 'confirmed'
    });

    await booking.save();
    res.status(201).send(booking);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('venue', 'name location pricePerDay')
      .sort({ startDate: -1 });
    res.send(bookings);
  } catch (err) {
    res.status(500).send(err);
  }
};