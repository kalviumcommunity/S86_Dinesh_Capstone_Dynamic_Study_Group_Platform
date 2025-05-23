const express = require('express');
const router = express.Router();

// Sample data
const studyGroups = [
  { id: 1, name: "Math Study Group", members: 5 },
  { id: 2, name: "Biology Study Group", members: 8 },
  { id: 3, name: "History Study Group", members: 3 }
];

// GET all groups
router.get('/', (req, res) => {
  res.json(studyGroups);
});

// GET single group by ID
router.get('/:id', (req, res) => {
  const group = studyGroups.find(g => g.id === parseInt(req.params.id));
  if (group) {
    res.json(group);
  } else {
    res.status(404).json({ error: 'Group not found' });
  }
});

module.exports = router;
