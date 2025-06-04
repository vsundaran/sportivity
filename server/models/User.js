const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: ''
  },
  yearOfBirth: {
    type: String,
    default: ''
  },
  shortBio: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  isNewUser: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);