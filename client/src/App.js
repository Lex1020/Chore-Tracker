import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { orange } from '@mui/material/colors';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import FamilyDashboard from './pages/FamilyDashboard';
import AddChore from './pages/AddChore';
import AddReward from './pages/AddReward';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff9800',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const user = localStorage.getItem('user');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-chore" element={user ? <AddChore /> : <Navigate to="/login" />} />
          <Route path="/rewards/add" element={user ? <AddReward /> : <Navigate to="/login" />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/rewards"
            element={user ? <Rewards /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/achievements"
            element={user ? <Achievements /> : <Navigate to="/login" />}
          />
          <Route
            path="/family"
            element={user ? <FamilyDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/chores/add"
            element={user ? <AddChore /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
