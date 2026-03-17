const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const googleClient = new OAuth2Client();

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

function normalizeUsernameCandidate(value) {
  const fallback = 'googleuser';
  const cleanedValue = (value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 18);

  return cleanedValue || fallback;
}

async function createUniqueUsername(baseValue) {
  const baseUsername = normalizeUsernameCandidate(baseValue);
  let candidate = baseUsername;
  let suffix = 1;

  while (await User.findOne({ username: candidate })) {
    candidate = `${baseUsername}${suffix}`;
    suffix += 1;
  }

  return candidate;
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
      authProvider: 'local',
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

    if (!user.passwordHash) {
      return res.status(401).json({ message: 'This account uses Google sign-in. Continue with Google instead.' });
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

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required.' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({ message: 'Google sign-in is not configured on the server yet.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload?.email) {
      return res.status(400).json({ message: 'Unable to read Google account information.' });
    }

    let user = await User.findOne({
      $or: [
        { googleId: payload.sub },
        { email: payload.email.toLowerCase() },
      ],
    });

    if (!user) {
      const username = await createUniqueUsername(payload.email.split('@')[0] || payload.name);

      user = new User({
        name: payload.name,
        email: payload.email.toLowerCase(),
        username,
        googleId: payload.sub,
        avatarUrl: payload.picture,
        authProvider: 'google',
      });
    } else {
      user.googleId = user.googleId || payload.sub;
      user.name = user.name || payload.name;
      user.email = user.email || payload.email.toLowerCase();
      user.avatarUrl = payload.picture || user.avatarUrl;
      user.authProvider = 'google';
    }

    await user.save();

    res.json(buildAuthResponse(user.toJSON()));
  } catch (err) {
    res.status(401).json({ message: 'Google token verification failed.' });
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
  const users = await User.find().select('name email username authProvider');
  res.json(users);
});

module.exports = router;
