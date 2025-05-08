import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser, socialLogin } from '../../services/authService';

// Logo Imports
import GoogleLogo from '../../assets/google-logo.svg';
import FacebookLogo from '../../assets/facebook-logo.svg';
import GitHubLogo from '../../assets/github-logo.svg';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    try {
      await loginUser({ email, password });
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    socialLogin(provider);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#000000',
        p: 2
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: '#121212',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={1} color="white">
          Welcome Back!
        </Typography>
        <Typography variant="body1" textAlign="center" mb={2} color="rgba(255, 255, 255, 0.7)">
          Please log in to continue
        </Typography>

        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleLogin}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 'bold',
            py: 1.5,
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>

        {message && (
          <Typography color="error" textAlign="center" mt={1}>
            {message}
          </Typography>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Button
            variant="text"
            onClick={() => navigate('/forgot-password')}
            sx={{ 
              textTransform: 'none',
              color: 'primary.main'
            }}
          >
            Forgot Password?
          </Button>
          <Button
            variant="text"
            onClick={() => navigate('/register')}
            sx={{ 
              textTransform: 'none',
              color: 'primary.main'
            }}
          >
            Register
          </Button>
        </Box>

        <Divider sx={{ 
          my: 2,
          color: 'rgba(255, 255, 255, 0.5)',
          '&::before, &::after': {
            borderColor: 'rgba(255, 255, 255, 0.12)',
          }
        }}>
          OR
        </Divider>

        <Button
          variant="outlined"
          onClick={() => handleSocialLogin('google')}
          startIcon={
            <img src={GoogleLogo} alt="Google" style={{ width: 24, height: 24 }} />
          }
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.23)',
            textTransform: 'none',
            fontWeight: 'bold',
            py: 1.5,
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderColor: 'rgba(255, 255, 255, 0.5)'
            },
          }}
          fullWidth
        >
          Continue with Google
        </Button>

        <Button
          variant="outlined"
          onClick={() => handleSocialLogin('facebook')}
          startIcon={
            <img src={FacebookLogo} alt="Facebook" style={{ width: 24, height: 24 }} />
          }
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.23)',
            textTransform: 'none',
            fontWeight: 'bold',
            py: 1.5,
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderColor: 'rgba(255, 255, 255, 0.5)'
            },
          }}
          fullWidth
        >
          Continue with Facebook
        </Button>

        <Button
          variant="outlined"
          onClick={() => handleSocialLogin('github')}
          startIcon={
            <img src={GitHubLogo} alt="GitHub" style={{ width: 24, height: 24 }} />
          }
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.23)',
            textTransform: 'none',
            fontWeight: 'bold',
            py: 1.5,
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderColor: 'rgba(255, 255, 255, 0.5)'
            },
          }}
          fullWidth
        >
          Continue with GitHub
        </Button>
      </Box>
    </Box>
  );
}

export default Login;