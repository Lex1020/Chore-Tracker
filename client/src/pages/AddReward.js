import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert, 
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddReward = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsRequired: '',
    image: '',
    assignedTo: '',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            assignedTo: response.data[0]._id
          }));
        }
      } catch (error) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      setLoading(false);
      setError('Not authenticated');
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.assignedTo) {
        throw new Error('Please select a user to assign the reward to');
      }

      const response = await axios.post(
        'http://localhost:5000/api/rewards',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        navigate('/rewards');
      } else {
        throw new Error('Failed to create reward');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add reward. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Loading...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh' }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Add New Reward
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Reward Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Points Required"
              name="pointsRequired"
              value={formData.pointsRequired}
              onChange={handleChange}
              margin="normal"
              type="number"
              required
            />
            <TextField
              fullWidth
              label="Image URL (optional)"
              name="image"
              value={formData.image}
              onChange={handleChange}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Assign To</InputLabel>
              <Select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value="">Select a user...</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.username} ({user.role})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/rewards')}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading || !formData.assignedTo}
              >
                Add Reward
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AddReward;
