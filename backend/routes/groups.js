const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// GET all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups', error });
  }
});

// GET group by ID
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group', error });
  }
});

// POST - create a new group
router.post('/', async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || typeof members !== 'number') {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const newGroup = new Group({ name, members });
    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group', error });
  }
});

// PUT - update group by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || typeof members !== 'number') {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { name, members },
      { new: true, runValidators: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error updating group', error });
  }
});

module.exports = router;
