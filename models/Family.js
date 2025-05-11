const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalPoints: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamAchievement'
  }],
  avatar: {
    type: String,
    default: 'default-family-avatar'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update family stats when a member completes a chore
familySchema.methods.updateStats = async function(userId, points) {
  const family = this;
  
  // Update total points
  family.totalPoints += points;
  
  // Check streak
  const lastChore = await Chore.findOne({
    assignedTo: userId,
    completed: true
  }).sort({ completionDate: -1 });
  
  if (lastChore) {
    const lastDate = new Date(lastChore.completionDate);
    const today = new Date();
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      family.currentStreak++;
    } else {
      family.currentStreak = 1;
    }
  }
  
  await family.save();
};

module.exports = mongoose.model('Family', familySchema);
