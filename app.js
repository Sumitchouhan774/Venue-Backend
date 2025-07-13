const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db');
const venueRoutes = require('./routes/venueRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// ✅ Proper CORS config
const corsOptions = {
  origin: 'https://venue-frontend-flax.vercel.app', // allow your frontend
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// DB + Server start
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
