const Booking = require('../models/Booking');
const BlockedDate = require('../models/BlockedDate');

const checkVenueAvailability = async (venueId, startDate, endDate) => {
  // Check for overlapping bookings
  const conflictingBookings = await Booking.find({
    venue: venueId,
    status: { $in: ['confirmed', 'pending'] },
    $or: [
      { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
    ]
  });

  // Check for blocked dates
  const blockedPeriods = await BlockedDate.find({
    venue: venueId,
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  });

  return {
    isAvailable: conflictingBookings.length === 0 && blockedPeriods.length === 0,
    conflicts: {
      bookings: conflictingBookings,
      blockedDates: blockedPeriods
    }
  };
};

const calculateBookingPrice = async (venueId, startDate, endDate) => {
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  return days * pricePerDay;
};

module.exports = {
  checkVenueAvailability,
  calculateBookingPrice
};