const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Chore = require('../models/Chore');

// Get all chores for user
router.get('/', auth, async (req, res) => {
  try {
    const chores = await Chore.find({ assignedTo: req.user.id })
      .populate('assignedTo', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(chores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new chore (parents only)
router.post('/', [auth, require('../middleware/parent')], async (req, res) => {
  try {
    const { title, description, frequency, points, assignedTo } = req.body;
    
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    const chore = new Chore({
      title,
      description,
      frequency,
      points,
      assignedTo
    });

    await chore.save();
    res.status(201).json(chore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark chore as completed
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const chore = await Chore.findById(req.params.id);
    if (!chore) {
      return res.status(404).json({ message: 'Chore not found' });
    }

    // Only assigned user can complete
    if (chore.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    chore.completed = true;
    chore.completionDate = new Date();
    chore.streak = chore.streak + 1;

    await chore.save();

    // Update user points
    const user = await User.findById(req.user.id);
    user.points += chore.points;
    await user.save();

    res.json(chore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unmark chore (parents only)
router.put('/:id/uncomplete', [auth, require('../middleware/parent')], async (req, res) => {
  try {
    const chore = await Chore.findById(req.params.id);
    if (!chore) {
      return res.status(404).json({ message: 'Chore not found' });
    }

    chore.completed = false;
    chore.completionDate = null;
    chore.streak = 0;

    await chore.save();

    // Deduct points if previously completed
    if (chore.completed) {
      const user = await User.findById(chore.assignedTo);
      user.points -= chore.points;
      await user.save();
    }

    res.json(chore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
