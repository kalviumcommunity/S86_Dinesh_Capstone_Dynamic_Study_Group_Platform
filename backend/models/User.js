const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  passwordHash: {
    type: String,
    select: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  avatarUrl: {
    type: String,
    trim: true,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
});

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
