const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');

router.post('/', auth, bookingController.createBooking);
router.get('/my-bookings', auth, bookingController.getUserBookings);

module.exports = router;