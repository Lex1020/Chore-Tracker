const mongoose = require('mongoose');

const choreSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly'],
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completionDate: {
    type: Date
  },
  streak: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Chore', choreSchema);
