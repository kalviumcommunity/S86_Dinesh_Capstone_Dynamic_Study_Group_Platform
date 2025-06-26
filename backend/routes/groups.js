const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/user');

// POST - create a group and relate to user
router.post('/', async (req, res) => {
  const { name, members, createdBy } = req.body;

  try {
    const user = await User.findById(createdBy);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newGroup = new Group({ name, members, createdBy });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - all groups with user info populated
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find().populate('createdBy', 'name email');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;