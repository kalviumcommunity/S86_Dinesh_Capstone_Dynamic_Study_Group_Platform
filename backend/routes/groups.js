// backend/routes/groups.js
const express = require('express');
const router = express.Router();

let groups = [
  { id: 1, name: "Math Study Group", members: 5 },
  { id: 2, name: "Biology Study Group", members: 3 },
];

// GET all groups
router.get('/', (req, res) => {
  res.json(groups);
});

// GET group by ID
router.get('/:id', (req, res) => {
  const groupId = parseInt(req.params.id);
  const group = groups.find(g => g.id === groupId);
  if (group) {
    res.json(group);
  } else {
    res.status(404).json({ message: "Group not found" });
  }
});

// POST - create a new group
router.post('/', (req, res) => {
  const { name, members } = req.body;
  if (!name || typeof members !== 'number') {
    return res.status(400).json({ message: "Invalid input" });
  }
  const newGroup = {
    id: groups.length + 1,
    name,
    members,
  };
  groups.push(newGroup);
  res.status(201).json(newGroup);
});

module.exports = router;
