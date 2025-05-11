const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Achievement = require('../models/Achievement');
const User = require('../models/User');

// Get all achievements
router.get('/', auth, async (req, res) => {
  try {
    const achievements = await Achievement.find()
      .select('-users')
      .sort({ createdAt: 1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's achievements
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const achievements = await Achievement.find({ users: req.user.userId })
      .sort({ createdAt: 1 });
    
    res.json({
      achievements,
      totalPoints: user.points
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new achievement (parents only)
router.post('/', [auth, require('../middleware/parent')], async (req, res) => {
  try {
    const { name, description, icon, condition, value, badgeImage, points } = req.body;
    
    const achievement = new Achievement({
      name,
      description,
      icon,
      condition,
      value,
      badgeImage,
      points
    });

    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check achievements for user
router.post('/check', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const achievements = await Achievement.find();
    
    const newAchievements = [];
    
    for (const achievement of achievements) {
      if (!user.achievements.includes(achievement._id)) {
        const conditionMet = await checkCondition(achievement, user);
        if (conditionMet) {
          newAchievements.push(achievement._id);
          
          // Update user points
          user.points += achievement.points;
          user.achievements.push(achievement._id);
          await user.save();

          // Update achievement users
          achievement.users.push(user._id);
          await achievement.save();
        }
      }
    }

    if (newAchievements.length > 0) {
      res.json({
        message: 'New achievements unlocked!',
        achievements: await Achievement.find({
          _id: { $in: newAchievements }
        })
      });
    } else {
      res.json({ message: 'No new achievements unlocked' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to check achievement conditions
async function checkCondition(achievement, user) {
  const condition = achievement.condition;
  const value = achievement.value;
  
  switch (condition) {
    case 'points':
      return user.points >= value;
    case 'streak':
      return user.streak >= value;
    case 'rewards':
      const rewards = await Reward.find({
        'redeemedBy.user': user._id
      });
      return rewards.length >= value;
    case 'custom':
      // Custom conditions can be added here
      return true;
    default:
      return false;
  }
}

module.exports = router;
