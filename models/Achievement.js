const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true,
    enum: [
      'points',     // e.g., "points>1000"
      'streak',     // e.g., "streak>7"
      'rewards',    // e.g., "rewards>5"
      'custom'      // e.g., "choresCompleted>100"
    ]
  },
  value: {
    type: Number,
    required: true
  },
  badgeImage: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
