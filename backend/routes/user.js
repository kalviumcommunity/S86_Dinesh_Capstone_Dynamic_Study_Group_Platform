const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

function buildAuthResponse(user) {
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET || 'study-group-dev-secret',
    { expiresIn: '7d' }
  );

  return {
    token,
    user,
  };
}

async function registerUser(req, res) {
  try {
    const { name, email, username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ username: username.trim() });

    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      username: username.trim(),
      passwordHash,
    });

    await user.save();

    res.status(201).json(buildAuthResponse(user.toJSON()));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

router.post('/register', registerUser);

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ username: username.trim() }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    res.json(buildAuthResponse(user.toJSON()));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Create user (backward-compatible alias)
router.post('/', registerUser);

// GET all users (optional)
router.get('/', async (req, res) => {
  const users = await User.find().select('name email username');
  res.json(users);
});

module.exports = router;
