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
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Star,
  Group,
  Celebration,
  EmojiEvents,
  EmojiObjects,
} from '@mui/icons-material';
import axios from 'axios';

const FamilyDashboard = () => {
  const [family, setFamily] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [newAchievements, setNewAchievements] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFamilyData = async () => {
      try {
        // Get family data
        const familyResponse = await axios.get('http://localhost:5000/api/family', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFamily(familyResponse.data);

        // Get team achievements
        const achievementsResponse = await axios.get('http://localhost:5000/api/teamAchievements', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAchievements(achievementsResponse.data.achievements);

        // Check for new achievements
        const checkResponse = await axios.post('http://localhost:5000/api/teamAchievements/check', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (checkResponse.data.achievements.length > 0) {
          setNewAchievements(checkResponse.data.achievements);
          setOpenDialog(true);
        }
      } catch (error) {
        console.error('Error fetching family data:', error);
      }
    };

    fetchFamilyData();
  }, [token]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* New Achievements Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Congratulations Family!</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Your family has unlocked new achievements!
          </Typography>
          <Grid container spacing={2}>
            {newAchievements.map((achievement) => (
              <Grid item xs={12} key={achievement._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      {achievement.icon && (
                        <Star sx={{ mr: 1 }} />
                      )}
                      <Typography variant="h6">
                        {achievement.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {achievement.description}
                    </Typography>
                    {achievement.points > 0 && (
                      <Chip
                        label={`+${achievement.points} Family Points`}
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

      <Grid container spacing={3}>
        {/* Family Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
              <Avatar
                src={family?.avatar}
                sx={{ width: 120, height: 120 }}
              >
                {family?.name[0].toUpperCase()}
              </Avatar>
            </Box>
            <Typography variant="h4" align="center" gutterBottom>
              {family?.name}
            </Typography>
            <Typography variant="h6" align="center" color="primary" gutterBottom>
              <span role="img" aria-label="points">⭐</span> {family?.totalPoints} Family Points
            </Typography>
            <Typography variant="h6" align="center" color="primary" gutterBottom>
              <span role="img" aria-label="streak">🔥</span> {family?.currentStreak} Day Streak
            </Typography>
          </Paper>
        </Grid>

        {/* Family Members */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              <Group /> Family Members
            </Typography>
            <Grid container spacing={2}>
              {family?.members?.map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={member.avatar}
                      alt={member.username}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {member.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Points: {member.points}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Streak: {member.streak} days
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Family Achievements */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              <Celebration /> Family Achievements
            </Typography>
            <Grid container spacing={2}>
              {achievements.map((achievement) => (
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
                        {achievement.icon && (
                          <EmojiEvents sx={{ mr: 1 }} />
                        )}
                        <Typography variant="h6">
                          {achievement.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                      {achievement.points > 0 && (
                        <Chip
                          label={`+${achievement.points} Family Points`}
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
      </Grid>
    </Container>
  );
};

export default FamilyDashboard;
