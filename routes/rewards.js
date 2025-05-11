const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Reward = require('../models/Reward');

// Get all rewards
router.get('/', auth, async (req, res) => {
  try {
    const rewards = await Reward.find()
      .select('-redeemedBy')
      .sort({ pointsRequired: 1 });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new reward (parents only)
router.post('/', [auth, require('../middleware/parent')], async (req, res) => {
  try {
    const { name, description, pointsRequired, image } = req.body;
    
    const reward = new Reward({
      name,
      description,
      pointsRequired,
      image
    });

    await reward.save();
    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Redeem reward
router.post('/:id/redeem', auth, async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    const user = await User.findById(req.user.id);
    if (user.points < reward.pointsRequired) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // Deduct points
    user.points -= reward.pointsRequired;
    await user.save();

    // Add to redemption history
    reward.redeemedBy.push({
      user: req.user.id,
      date: new Date()
    });
    await reward.save();

    res.json({
      message: 'Reward redeemed successfully',
      updatedUser: {
        points: user.points
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's redemption history
router.get('/history', auth, async (req, res) => {
  try {
    const rewards = await Reward.find({
      'redeemedBy.user': req.user.id
    })
    .populate('redeemedBy.user', 'username avatar')
    .sort({ 'redeemedBy.date': -1 });

    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
