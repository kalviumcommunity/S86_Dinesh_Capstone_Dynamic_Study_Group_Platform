// backend/models/Group.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: { type: Number, required: true },
});

module.exports = mongoose.model('Group', groupSchema);
