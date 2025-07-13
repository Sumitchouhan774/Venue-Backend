const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const { auth, isOwner } = require('../middleware/auth');

// Public routes
router.get('/', venueController.getAllVenues);

// Owner routes
router.post('/', auth, isOwner, venueController.createVenue);
router.post('/:id/block', auth, isOwner, venueController.blockDates);
router.get('/:id/bookings', auth, isOwner, venueController.getVenueBookings);

module.exports = router;