// backend/routes/groups.js
const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// GET all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET group by ID
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (group) {
      res.json(group);
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - create new group
router.post('/', async (req, res) => {
  const { name, members } = req.body;
  if (!name || typeof members !== 'number') {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const newGroup = new Group({ name, members });
  try {
    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - update group
router.put('/:id', async (req, res) => {
  const { name, members } = req.body;
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { name, members },
      { new: true }
    );

    if (updatedGroup) {
      res.json(updatedGroup);
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE group
router.delete('/:id', async (req, res) => {
  try {
    const result = await Group.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: 'Group deleted' });
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
