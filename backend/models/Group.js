const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: {
    type: Number,
    required: true,
    default: 1
  },
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
