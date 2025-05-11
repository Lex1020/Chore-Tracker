import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  AddCircle,
  Star,
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [chores, setChores] = useState([]);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchChores = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chores', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChores(response.data);
      } catch (error) {
        console.error('Error fetching chores:', error);
      }
    };

    const fetchUserStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPoints(response.data.points);
        setStreak(response.data.streak);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchChores();
    fetchUserStats();
  }, [token]);

  const handleCompleteChore = async (choreId) => {
    try {
      await axios.put(`http://localhost:5000/api/chores/${choreId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh chores
      const response = await axios.get('http://localhost:5000/api/chores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChores(response.data);
    } catch (error) {
      console.error('Error completing chore:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Points and Streak Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              <span role="img" aria-label="points">⭐</span> Points
            </Typography>
            <Typography variant="h4" align="center" gutterBottom>
              {points}
            </Typography>
            <Typography variant="h6" gutterBottom>
              <span role="img" aria-label="streak">🔥</span> Current Streak
            </Typography>
            <Typography variant="h4" align="center">
              {streak} days
            </Typography>
          </Paper>
        </Grid>

        {/* Chores List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom>
                <span role="img" aria-label="chores">🧹</span> Your Chores
              </Typography>
              {user.role === 'parent' && (
                <Button
                  variant="contained"
                  startIcon={<AddCircle />}
                  href="/chores/add"
                >
                  Add Chore
                </Button>
              )}
            </Box>

            <List>
              {chores.map((chore) => (
                <ListItem
                  key={chore._id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleCompleteChore(chore._id)}
                      disabled={chore.completed}
                    >
                      {chore.completed ? <Cancel /> : <CheckCircle />}
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={chore.title}
                    secondary={
                      <>
                        <span role="img" aria-label="points">⭐</span> {chore.points} points
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
