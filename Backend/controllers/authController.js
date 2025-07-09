const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// User registration
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already registered. Please log in.' });
    }

    // Create new user
    user = new User({
      username: username || email.split('@')[0], // Use email prefix if no username
      email,
      password,
    });

    await user.save();

    // Generate JWT token
    const payload = { user: { id: user.id } };
    // Ensure JWT_SECRET is loaded, use a strong default if not set
    const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey'; // Consider using a more robust default or throwing an error if not set

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT Sign Error (Registration):', err);
          return res.status(500).json({ message: 'Token generation failed.' });
        }
        res.status(201).json({ message: 'User registered successfully', token });
      }
    );
  } catch (error) {
    console.error('Registration Error:', error.message);
    // Differentiate between validation errors and server errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).send('Server error during registration');
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT
    const payload = { user: { id: user.id } };
    // Ensure JWT_SECRET is loaded, use a strong default if not set
    const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey'; // Consider using a more robust default or throwing an error if not set

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT Sign Error (Login):', err);
          return res.status(500).json({ message: 'Token generation failed.' });
        }
        res.status(200).json({ message: 'Login successful', token });
      }
    );
  } catch (error) {
    console.error('Login Error:', error.message);
    // Provide more specific error messages for common issues
    if (error.name === 'MongoNetworkError') {
      return res.status(500).json({ message: 'Database connection error. Please try again later.' });
    } else if (error.name === 'MongooseError') {
      return res.status(500).json({ message: 'Database operation failed. Please try again.' });
    }
    res.status(500).send('Server error during login');
  }
};

// User logout
exports.logout = (req, res) => {
  // Client should delete the token on logout
  res.status(200).json({ message: 'Logged out successfully (token removed on client)' });
};
