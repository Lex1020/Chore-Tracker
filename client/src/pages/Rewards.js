import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Star,
  AddCircle,
} from '@mui/icons-material';
import axios from 'axios';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rewards', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRewards(response.data);
      } catch (error) {
        console.error('Error fetching rewards:', error);
      }
    };

    fetchRewards();
  }, [token]);

  const handleRedeemReward = async (rewardId) => {
    try {
      await axios.post(`http://localhost:5000/api/rewards/${rewardId}/redeem`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh rewards
      const response = await axios.get('http://localhost:5000/api/rewards', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRewards(response.data);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom>
                <span role="img" aria-label="rewards">🏆</span> Rewards
              </Typography>
              {user.role === 'parent' && (
                <Button
                  variant="contained"
                  startIcon={<AddCircle />}
                  href="/rewards/add"
                >
                  Add Reward
                </Button>
              )}
            </Box>

            <Grid container spacing={2}>
              {rewards.map((reward) => (
                <Grid item xs={12} sm={6} md={4} key={reward._id}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      minHeight: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    {reward.image && (
                      <img
                        src={reward.image}
                        alt={reward.name}
                        style={{
                          maxWidth: '100%',
                          height: '150px',
                          objectFit: 'contain',
                        }}
                      />
                    )}
                    <Typography variant="h6" gutterBottom>
                      {reward.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {reward.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary">
                        <span role="img" aria-label="points">⭐</span> {reward.pointsRequired}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setSelectedReward(reward);
                          setOpenDialog(true);
                        }}
                        disabled={user.points < reward.pointsRequired}
                      >
                        {user.points < reward.pointsRequired ? 'Insufficient Points' : 'Redeem'}
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Redeem Reward Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Redeem {selectedReward?.name}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to redeem this reward? It will cost you {selectedReward?.pointsRequired} points.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => handleRedeemReward(selectedReward?._id)}
            variant="contained"
            color="primary"
          >
            Redeem
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Rewards;
