const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Authorization token required');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user with token
    const user = await User.findOne({ 
      _id: decoded._id 
    }).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    // Attach user to request
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({ 
      error: 'Please authenticate',
      details: err.message 
    });
  }
};

const isOwner = (req, res, next) => {
  if (req.user.role !== 'owner') {
    return res.status(403).send({ 
      error: 'Access denied. Owner privileges required.' 
    });
  }
  next();
};

module.exports = { auth, isOwner };