const mongoose = require('mongoose');

const teamAchievementSchema = new mongoose.Schema({
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
      'familyPoints',     // e.g., "familyPoints>5000"
      'familyStreak',     // e.g., "familyStreak>14"
      'familyRewards',    // e.g., "familyRewards>20"
      'teamChores'        // e.g., "teamChores>100"
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
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family'
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('TeamAchievement', teamAchievementSchema);
