import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddChore = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: '',
    dueDate: '',
    frequency: 'daily',
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
        // Set the first user as default if available
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
        throw new Error('Please select a user to assign the chore to');
      }

      const updatedFormData = {
        ...formData,
        assignedTo: formData.assignedTo
      };

      const response = await axios.post('http://localhost:5000/api/chores', updatedFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        navigate('/dashboard');
      } else {
        throw new Error('Failed to create chore');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add chore. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Add New Chore
        </Typography>
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
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
            label="Points"
            name="points"
            value={formData.points}
            onChange={handleChange}
            margin="normal"
            type="number"
            required
          />
          <TextField
            fullWidth
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            margin="normal"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            margin="normal"
            select
            SelectProps={{
              native: true
            }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </TextField>
          <TextField
            fullWidth
            label="Assign To"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            margin="normal"
            select
            SelectProps={{
              native: true
            }}
            disabled={loading}
          >
            <option value="">Select a user...</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.role})
              </option>
            ))}
          </TextField>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || !formData.assignedTo}
            >
              Add Chore
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddChore;
