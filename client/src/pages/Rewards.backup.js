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
import { Navigate } from 'react-router-dom';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);

  // Check if user is logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else {
          setError('User data not found');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Error loading user data');
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

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

    if (token) {
      fetchRewards();
    }
  }, [token]);

  const handleRedeemReward = async (rewardId) => {
    if (!user) {
      alert('Loading user data... Please try again in a moment.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/rewards/${rewardId}/redeem`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 200) {
        const newRewards = await axios.get('http://localhost:5000/api/rewards', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRewards(newRewards.data);
        setOpenDialog(false);
        alert('Reward redeemed successfully!');
      } else {
        throw new Error('Failed to redeem reward');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert(error.response?.data?.message || 'Failed to redeem reward. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          Loading rewards...
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          Loading user data...
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" gutterBottom>
                  <span role="img" aria-label="rewards">🏆</span> Rewards
                </Typography>
                {user?.role === 'parent' && (
                  <Button
                    variant="contained"
                    startIcon={<AddCircle />}
                    onClick={() => window.location.href = '/rewards/add'}
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
                          disabled={!user || user.points < reward.pointsRequired}
                        >
                          {!user ? 'Loading...' : user.points < reward.pointsRequired ? 'Insufficient Points' : 'Redeem'}
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

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
    </>
  );
};

export default Rewards;                    )}
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
                          disabled={!user || user.points < reward.pointsRequired}
                        >
                          {!user ? 'Loading...' : user.points < reward.pointsRequired ? 'Insufficient Points' : 'Redeem'}
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
                        disabled={!user || user.points < reward.pointsRequired}
                      >
                        {!user ? 'Loading...' : user.points < reward.pointsRequired ? 'Insufficient Points' : 'Redeem'}
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>

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
  );
};

export default Rewards;
