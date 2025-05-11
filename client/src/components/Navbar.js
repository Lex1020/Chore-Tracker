import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Person, Logout } from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/#" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Chore Chart
        </Typography>
        {user.id ? (
          <Box>
            <IconButton
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar src={user.avatar}>
                {user.username[0].toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={RouterLink} to="/dashboard">
                <Person /> Dashboard
              </MenuItem>
              <MenuItem component={RouterLink} to="/rewards">
                <Person /> Rewards
              </MenuItem>
              <MenuItem component={RouterLink} to="/profile">
                <Person /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout /> Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
