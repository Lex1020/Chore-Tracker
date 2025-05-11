const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const TeamAchievement = require('../models/TeamAchievement');
const Family = require('../models/Family');

// Get all team achievements for family
router.get('/', auth, async (req, res) => {
  try {
    const family = await Family.findOne({
      members: req.user.userId
    });
    
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    const achievements = await TeamAchievement.find({
      familyId: family._id
    })
    .select('-users')
    .sort({ createdAt: 1 });
    
    res.json({
      achievements,
      familyStats: {
        totalPoints: family.totalPoints,
        currentStreak: family.currentStreak
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new team achievement (parents only)
router.post('/', [auth, require('../middleware/parent')], async (req, res) => {
  try {
    const { name, description, icon, condition, value, badgeImage, points } = req.body;
    
    const family = await Family.findOne({
      members: req.user.userId
    });
    
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    const achievement = new TeamAchievement({
      name,
      description,
      icon,
      condition,
      value,
      badgeImage,
      points,
      familyId: family._id
    });

    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check team achievements
router.post('/check', auth, async (req, res) => {
  try {
    const family = await Family.findOne({
      members: req.user.userId
    });
    
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    const achievements = await TeamAchievement.find({
      familyId: family._id
    });
    
    const newAchievements = [];
    
    for (const achievement of achievements) {
      if (!family.badges.includes(achievement._id)) {
        const conditionMet = await checkCondition(achievement, family);
        if (conditionMet) {
          newAchievements.push(achievement._id);
          
          // Update family stats
          family.totalPoints += achievement.points;
          family.badges.push(achievement._id);
          await family.save();

          // Update achievement users
          achievement.users.push(...family.members);
          await achievement.save();
        }
      }
    }

    if (newAchievements.length > 0) {
      res.json({
        message: 'New family achievements unlocked!',
        achievements: await TeamAchievement.find({
          _id: { $in: newAchievements }
        })
      });
    } else {
      res.json({ message: 'No new family achievements unlocked' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to check team achievement conditions
async function checkCondition(achievement, family) {
  const condition = achievement.condition;
  const value = achievement.value;
  
  switch (condition) {
    case 'familyPoints':
      return family.totalPoints >= value;
    case 'familyStreak':
      return family.currentStreak >= value;
    case 'familyRewards':
      const rewards = await Reward.find({
        'redeemedBy.user': { $in: family.members }
      });
      return rewards.length >= value;
    case 'teamChores':
      const chores = await Chore.find({
        assignedTo: { $in: family.members },
        completed: true
      });
      return chores.length >= value;
    default:
      return false;
  }
}

module.exports = router;
