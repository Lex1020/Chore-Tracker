const Achievement = require('../models/Achievement');

const achievements = [
  {
    name: 'Points Master',
    description: 'Earn 1,000 points',
    icon: 'points',
    condition: 'points',
    value: 1000,
    badgeImage: '/images/badges/points-master.png',
    points: 50
  },
  {
    name: 'Streak Hero',
    description: 'Complete chores for 7 consecutive days',
    icon: 'streak',
    condition: 'streak',
    value: 7,
    badgeImage: '/images/badges/streak-hero.png',
    points: 100
  },
  {
    name: 'Reward Collector',
    description: 'Redeem 5 rewards',
    icon: 'rewards',
    condition: 'rewards',
    value: 5,
    badgeImage: '/images/badges/reward-collector.png',
    points: 75
  },
  {
    name: 'Early Bird',
    description: 'Complete all daily chores before 8 AM for 5 days',
    icon: 'custom',
    condition: 'custom',
    value: 5,
    badgeImage: '/images/badges/early-bird.png',
    points: 25
  },
  {
    name: 'Perfect Week',
    description: 'Complete all weekly chores for 4 weeks',
    icon: 'custom',
    condition: 'custom',
    value: 4,
    badgeImage: '/images/badges/perfect-week.png',
    points: 150
  }
];

const seedAchievements = async () => {
  try {
    await Achievement.deleteMany({});
    await Achievement.insertMany(achievements);
    console.log('Achievements seeded successfully');
  } catch (error) {
    console.error('Error seeding achievements:', error);
  }
};

module.exports = seedAchievements;
