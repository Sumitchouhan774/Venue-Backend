const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res) => {
  try {
    // Validate role (only allow 'owner' or 'customer')
    if (req.body.role && !['owner', 'customer'].includes(req.body.role)) {
      return res.status(400).send({ error: 'Invalid role specified' });
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'customer' // Default to customer if not specified
    });

    await user.save();
    
    // Generate auth token
    const token = jwt.sign(
      { _id: user._id.toString() }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Don't send password back
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).send({ user: userWithoutPassword, token });
  } catch (err) {
    res.status(400).send({
      error: 'Registration failed',
      details: err.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }

    // Generate auth token
    const token = jwt.sign(
      { _id: user._id.toString() }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Don't send password back
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.send({ user: userWithoutPassword, token });
  } catch (err) {
    res.status(400).send({
      error: 'Login failed',
      details: err.message
    });
  }
};
