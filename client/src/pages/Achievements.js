import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Star,
  Badge,
  Celebration,
  EmojiEvents,
  EmojiObjects,
} from '@mui/icons-material';
import axios from 'axios';

const getAchievementIcon = (condition) => {
  switch (condition) {
    case 'points':
    case 'streak':
      return <Star sx={{ mr: 1 }} />;
    case 'rewards':
      return <Badge sx={{ mr: 1 }} />;
    case 'custom':
      return <Celebration sx={{ mr: 1 }} />;
    default:
      return null;
  }
};

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [unearnedAchievements, setUnearnedAchievements] = useState([]);
  const [newAchievements, setNewAchievements] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const [allAchievements, userAchievements] = await Promise.all([
          axios.get('http://localhost:5000/api/achievements', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/achievements/user', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAchievements(allAchievements.data);
        setEarnedAchievements(userAchievements.data.achievements);

        // Check for new achievements
        const checkResponse = await axios.post('http://localhost:5000/api/achievements/check', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (checkResponse.data.achievements.length > 0) {
          setNewAchievements(checkResponse.data.achievements);
          setOpenDialog(true);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    fetchAchievements();
  }, [token]);

  useEffect(() => {
    // Calculate unearned achievements
    const earnedIds = earnedAchievements.map(ach => ach._id);
    const unearned = achievements.filter(ach => !earnedIds.includes(ach._id));
    setUnearnedAchievements(unearned);
  }, [achievements, earnedAchievements]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* New Achievements Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Congratulations!</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              You've unlocked new achievements!
            </Typography>
            <Grid container spacing={2}>
              {newAchievements.map((achievement) => (
                <Grid item xs={12} key={achievement._id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        {achievement.icon && getAchievementIcon(achievement.condition)}
                        <Typography variant="h6">
                          {achievement.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                      {achievement.points > 0 && (
                        <Chip
                          label={`+${achievement.points} Points`}
                          color="primary"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Earned Achievements */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <EmojiEvents /> Earned Achievements
            </Typography>
            <Grid container spacing={2}>
              {earnedAchievements.map((achievement) => (
                <Grid item xs={12} sm={6} md={4} key={achievement._id}>
                  <Card>
                    {achievement.badgeImage && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={achievement.badgeImage}
                        alt={achievement.name}
                      />
                    )}
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        {achievement.icon && getAchievementIcon(achievement.condition)}
                        <Typography variant="h6">
                          {achievement.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                      {achievement.points > 0 && (
                        <Chip
                          label={`+${achievement.points} Points`}
                          color="primary"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Unearned Achievements */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <EmojiObjects /> Upcoming Achievements
            </Typography>
            <Grid container spacing={2}>
              {unearnedAchievements.map((achievement) => (
                <Grid item xs={12} sm={6} md={4} key={achievement._id}>
                  <Card sx={{ opacity: 0.7 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        {achievement.icon && getAchievementIcon(achievement.condition)}
                        <Typography variant="h6">
                          {achievement.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                      {achievement.condition && achievement.value && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {achievement.condition === 'points' && `Need ${achievement.value} points`}
                          {achievement.condition === 'streak' && `Need ${achievement.value} day streak`}
                          {achievement.condition === 'rewards' && `Need ${achievement.value} rewards redeemed`}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Achievements;
