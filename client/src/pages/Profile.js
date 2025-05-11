import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
} from '@mui/material';
import {
  Star,
  History,
  Person,
  Badge,
} from '@mui/icons-material';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({});
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchRewardsHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rewards/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRewardsHistory(response.data);
      } catch (error) {
        console.error('Error fetching rewards history:', error);
      }
    };

    fetchUserData();
    fetchRewardsHistory();
  }, [token]);

  // Calculate achievement badges
  const badges = [
    { icon: <Star />, label: 'Points Master', condition: user.points >= 1000 },
    { icon: <Star />, label: 'Streak Hero', condition: user.streak >= 7 },
    { icon: <History />, label: 'Rewards Collector', condition: rewardsHistory.length >= 5 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
              <Avatar
                src={user.avatar}
                sx={{ width: 120, height: 120 }}
              >
                {user.username[0].toUpperCase()}
              </Avatar>
            </Box>
            <Typography variant="h4" align="center" gutterBottom>
              {user.username}
            </Typography>
            <Typography variant="h6" align="center" color="primary" gutterBottom>
              <span role="img" aria-label="points">⭐</span> {user.points} Points
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
              Age: {user.age}
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
              Role: {user.role}
            </Typography>
          </Paper>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom>
                <span role="img" aria-label="achievements">🏆</span> Achievements
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {badges.map((badge, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      opacity: badge.condition ? 1 : 0.5,
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="center" mb={2}>
                        {badge.icon}
                      </Box>
                      <Typography variant="h6" align="center">
                        {badge.label}
                      </Typography>
                      <Typography variant="body2" align="center" color="text.secondary">
                        {badge.condition ? 'Earned' : 'Not yet earned'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Rewards History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              <span role="img" aria-label="history">📜</span> Rewards History
            </Typography>
            <Grid container spacing={2}>
              {rewardsHistory.map((reward) => (
                <Grid item xs={12} sm={6} md={4} key={reward._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={reward.image}
                      alt={reward.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {reward.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Redeemed on: {new Date(reward.redeemedBy[0].date).toLocaleDateString()}
                      </Typography>
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

export default Profile;
