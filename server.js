const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chore-chart', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const choreRoutes = require('./routes/chores');
const rewardRoutes = require('./routes/rewards');
const achievementRoutes = require('./routes/achievements');
const teamAchievementRoutes = require('./routes/teamAchievements');
const familyRoutes = require('./routes/family');

app.use('/api/auth', authRoutes);
app.use('/api/chores', choreRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/teamAchievements', teamAchievementRoutes);
app.use('/api/family', familyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
