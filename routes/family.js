const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Family = require('../models/Family');
const User = require('../models/User');

// Get family data
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('family');
    
    if (!user.family) {
      // Create new family if user doesn't have one
      const family = await Family.create({
        name: `${user.username}'s Family`,
        members: [user._id]
      });
      
      user.family = family._id;
      await user.save();
      
      res.json(family);
    } else {
      // Get family data with members
      const family = await Family.findById(user.family)
        .populate('members', '-password')
        .populate('badges');
      
      res.json(family);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add family member (parents only)
router.post('/members', [auth, require('../middleware/parent')], async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(req.user.userId);
    const member = await User.findById(userId);
    
    if (!member) {
      return res.status(404).json({ message: 'User not found' });
    }

    const family = await Family.findById(user.family);
    
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    if (family.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already in family' });
    }

    // Add member to family
    family.members.push(userId);
    await family.save();

    // Update member's family reference
    member.family = family._id;
    await member.save();

    res.json({
      message: 'Member added to family successfully',
      family: await Family.findById(family._id)
        .populate('members', '-password')
        .populate('badges')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove family member (parents only)
router.delete('/members/:userId', [auth, require('../middleware/parent')], async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const family = await Family.findById(user.family);
    
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    // Remove member from family
    family.members = family.members.filter(id => id.toString() !== userId);
    await family.save();

    // Update member's family reference
    const member = await User.findById(userId);
    if (member) {
      member.family = null;
      await member.save();
    }

    res.json({
      message: 'Member removed from family successfully',
      family: await Family.findById(family._id)
        .populate('members', '-password')
        .populate('badges')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update family avatar
router.put('/avatar', auth, async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user.family) {
      return res.status(404).json({ message: 'User is not in a family' });
    }

    const family = await Family.findById(user.family);
    family.avatar = avatarUrl;
    await family.save();

    res.json({
      message: 'Family avatar updated successfully',
      family: await Family.findById(family._id)
        .populate('members', '-password')
        .populate('badges')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
