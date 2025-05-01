// backend/controllers/authController.js

const User = require('../models/User');

// Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // ✅ also get role
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({ name, email, password, role }); // ✅ save role also
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // ✅ Send role back on successful login
    res.json({
      message: 'Login successful',
      user: {
        _id: user._id, // ✅ ADD THIS
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
